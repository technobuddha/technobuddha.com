import React         from 'react';
import useAPI        from '#context/api';
import shallowEquals from '@technobuddha/library/shallowEquals';
import settings      from '#settings/authentication';

import type { Account } from '#schema/account';

type AuthenticationState = {
    error:          boolean;
    account:        Account | null;
    login:          (username: string, password: string) => Promise<boolean>;
    logout:         () => Promise<void>;
    createAccount:  (first: string, last: string, email: string, password: string) => Promise<Account | null>;
};

const AuthenticationContext = React.createContext<AuthenticationState>(null!);

export function useAuthentication() {
    return React.useContext(AuthenticationContext);
}

const KEY       = 'authenticationProvider';

type AuthenticationProviderProps = {
    children?: React.ReactNode;
};

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({ children }) => {
    const [ error,   setError ]       = React.useState<boolean>(false);
    const [ account, setAccount ]     = React.useState<Account | null>(null);
    const [ loading, setLoading ]     = React.useState<boolean>(true);
    const { authentication }        = useAPI();

    const checkLogin = async () => {
        return authentication.readSession().then(
            api => {
                if(api.status === 200) {
                    if(!shallowEquals(api.payload, account))
                        setAccount(api.payload);
                } else if(api.status === 401) {
                    setAccount(null);
                }
                //setError(false);
            }
        ).catch(() => {
            setAccount(null);
            setError(true);
        });
    };

    const initialCheck = async () => {
        await checkLogin();
        setLoading(false);
    };

    const killTimeout = () => {
        const handle = sessionStorage.getItem(KEY);
        if(handle) {
            clearTimeout(Number.parseInt(handle, 10));
            sessionStorage.removeItem(KEY);
        }
    };

    const periodicCheck = async () => {
        const checker = () => {
            killTimeout();

            void checkLogin()
            .then(() => sessionStorage.setItem(KEY, setTimeout(checker, settings.session.keepAlive).toString()));
        };

        killTimeout();
        sessionStorage.setItem(KEY, setTimeout(checker, settings.session.keepAlive).toString());

        return () => {
            killTimeout();
        };
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        return authentication.createSession(username, password)
        .then(result => {
            if(result.status === 201) {
                setAccount(result.payload);
                return true;
            }
            return false;
        });
    };

    const logout = async (): Promise<void> => {
        await authentication.deleteSession();
        setAccount(null);
    };

    const createAccount = async (first: string, last: string, email: string, password: string): Promise<Account | null> => {
        return authentication.createAccount(first, last, email, password)
        .then(result => {
            if(result.status === 201) {
                setAccount(result.payload);
                return result.payload;
            }
            return null;
        });
    };

    killTimeout();

    React.useEffect(
        () => {
            if(loading)
                void initialCheck();
            if(account)
                void periodicCheck();
        },
        []
    );

    if(loading)
        return null;

    return (
        <AuthenticationContext.Provider value={{ error, account, login, logout, createAccount }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export default useAuthentication;
