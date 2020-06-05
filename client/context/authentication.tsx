import React                        from 'react';
import Account                      from '$interface/Account';
import useAPI                       from '$client/context/api';
import shallowEquals                from '$library/shallowEquals';
import settings                     from '$/settings';

type AuthenticationState = {
    error:          boolean;
    account:        Account | null,
    login:          (username: string, password: string) => Promise<boolean>,
    logout:         () => Promise<void>;
    createAccount:  (first: string, last: string, email: string, password: string) => Promise<Account | null>
}

const AuthenticationContext = React.createContext<AuthenticationState>(null!);

export function useAuthentication() {
   return React.useContext(AuthenticationContext);
}

const KEY       = 'authenticationProvider';

export const AuthenticationProvider: React.FC = ({children}: {children?: React.ReactNode}) => {
    const [error,   setError]       = React.useState<boolean>(false);
    const [account, setAccount]     = React.useState<Account | null>(null);
    const [loading, setLoading]     = React.useState<boolean>(true);
    const { authentication }        = useAPI();
    
    const checkLogin = async() => {
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
    }

    const initialCheck = async () => {
        await checkLogin();
        setLoading(false)
    }

    const killTimeout = () => {
        const handle = sessionStorage.getItem(KEY);
        if(handle) {
            clearTimeout(Number.parseInt(handle) as unknown as NodeJS.Timeout);
            sessionStorage.removeItem(KEY);
        }
    }

    const periodicCheck = async() => {
        const checker = async() => {
            killTimeout();

            await checkLogin();
            sessionStorage.setItem(KEY, setTimeout(checker, settings.authentication.session.keepAlive).toString());
        }

        killTimeout();
        sessionStorage.setItem(KEY, setTimeout(checker, settings.authentication.session.keepAlive).toString());

        return () => {
            killTimeout();
        }
    }

    const login = async (username: string, password: string): Promise<boolean> => {
        return authentication.createSession(username, password)
        .then(result => {
            if(result.status === 201) {
                setAccount(result.payload);
                return true;
            }
            return false;
        });
    }

    const logout = async(): Promise<void> => {
        await authentication.deleteSession();
        setAccount(null);
    }

    const createAccount = async(first: string, last: string, email: string, password: string): Promise<Account | null> => {
        return authentication.createAccount(first, last, email, password)
        .then(result => {
            if(result.status === 201) {
                setAccount(result.payload);
                return result.payload;
            }
            return null;
        });
    }

    killTimeout();
    if(loading)
        React.useEffect(() => { initialCheck(); }, []);
    else if(account)
        React.useEffect(() => { periodicCheck(); });
    else
        React.useEffect(() => undefined);

    return (
        loading
        ?   null
        :   <AuthenticationContext.Provider value={{ error, account, login, logout, createAccount }}>
                {children}
            </AuthenticationContext.Provider>
    )
}

export default useAuthentication;
