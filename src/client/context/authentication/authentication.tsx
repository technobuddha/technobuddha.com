import React from 'react';
import { useAPI } from '#context/api';
import shallowEquals from '@technobuddha/library/shallowEquals';
import { authenticationSettings } from '#settings/authentication';

import type { Account } from '#schema/account';

type AuthenticationState = {
  error: boolean;
  account: Account | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createAccount: (
    first: string,
    last: string,
    email: string,
    password: string,
  ) => Promise<Account | null>;
};

const AuthenticationContext = React.createContext<AuthenticationState>(null!);

export function useAuthentication(): AuthenticationState {
  return React.useContext(AuthenticationContext);
}

const KEY = 'authenticationProvider';

const GENERIC_USER: Account = {
  id: -1,
  email: 'generic@example.com',
  first: 'Generic',
  last: 'User',
  admin: false,
  disabled: false,
  confirmed: null,
  failed_logins: 0,
  locked: null,
  created: new Date(),
  updated: null,
  policy_accepted: null,
};

type AuthenticationProviderProps = {
  children?: React.ReactNode;
};

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({ children }) => {
  const [error, setError] = React.useState<boolean>(false);
  const [account, setAccount] = React.useState<Account | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { authentication } = useAPI();

  const checkLogin = async () => {
    if (authenticationSettings.login) {
      return authentication
        .readSession()
        .then((api) => {
          if (api.status === 200) {
            if (!shallowEquals(api.payload, account)) setAccount(api.payload);
          } else if (api.status === 401) {
            setAccount(null);
          }
        })
        .catch(() => {
          setAccount(null);
          setError(true);
        });
    }

    setAccount(GENERIC_USER);
    return Promise.resolve(GENERIC_USER);
  };

  const initialCheck = async () => {
    await checkLogin();
    setLoading(false);
  };

  const killTimeout = () => {
    const handle = sessionStorage.getItem(KEY);
    if (handle) {
      clearTimeout(Number.parseInt(handle, 10));
      sessionStorage.removeItem(KEY);
    }
  };

  const periodicCheck = async () => {
    if (authenticationSettings.login) {
      const checker = () => {
        killTimeout();

        void checkLogin().then(() =>
          sessionStorage.setItem(
            KEY,
            setTimeout(checker, authenticationSettings.session.keepAlive).toString(),
          ),
        );
      };

      killTimeout();
      sessionStorage.setItem(
        KEY,
        setTimeout(checker, authenticationSettings.session.keepAlive).toString(),
      );

      return () => {
        killTimeout();
      };
    }

    return Promise.resolve();
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    return authentication.createSession(username, password).then((result) => {
      if (result.status === 201) {
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

  const createAccount = async (
    first: string,
    last: string,
    email: string,
    password: string,
  ): Promise<Account | null> => {
    return authentication.createAccount(first, last, email, password).then((result) => {
      if (result.status === 201) {
        setAccount(result.payload);
        return result.payload;
      }
      return null;
    });
  };

  killTimeout();

  React.useEffect(() => {
    if (loading) void initialCheck();
    if (account) void periodicCheck();
  }, []);

  if (loading) return null;

  return (
    <AuthenticationContext.Provider value={{ error, account, login, logout, createAccount }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
