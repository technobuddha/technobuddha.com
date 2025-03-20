import React from 'react';
import { shallowEquals } from '@technobuddha/library';

import { useAPI } from '#context/api';
import { type Account } from '#schema';
import { authenticationSettings } from '#settings/authentication';

import { AuthenticationContext } from './context.ts';

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

const killTimeout = (): void => {
  const handle = sessionStorage.getItem(KEY);
  if (handle) {
    clearTimeout(Number.parseInt(handle));
    sessionStorage.removeItem(KEY);
  }
};

type AuthenticationProviderProps = {
  readonly children?: React.ReactNode;
};

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({ children }) => {
  const [error, setError] = React.useState<boolean>(false);
  const [account, setAccount] = React.useState<Account | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { authentication } = useAPI();

  const checkLogin = React.useCallback(async (): Promise<void> => {
    if (authenticationSettings.login) {
      return authentication
        .readSession()
        .then((api) => {
          if (api.status === 200) {
            if (!shallowEquals(api.payload, account)) {
              setAccount(api.payload);
            }
          } else if (api.status === 401) {
            setAccount(null);
          }
          return undefined;
        })
        .catch(() => {
          setAccount(null);
          setError(true);
        });
    }

    setAccount(GENERIC_USER);
  }, [account, authentication]);

  const initialCheck = React.useCallback(async (): Promise<void> => {
    await checkLogin();
    setLoading(false);
  }, [checkLogin]);

  const periodicCheck = React.useCallback((): (() => void) | undefined => {
    if (authenticationSettings.login) {
      const checker = (): void => {
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

      return (): void => {
        killTimeout();
      };
    }

    return undefined;
  }, [checkLogin]);

  const login = React.useCallback(
    async (username: string, password: string): Promise<boolean> =>
      authentication.createSession(username, password).then((result) => {
        if (result.status === 201) {
          setAccount(result.payload);
          return true;
        }
        return false;
      }),
    [authentication],
  );

  const logout = React.useCallback(async (): Promise<void> => {
    await authentication.deleteSession();
    setAccount(null);
  }, [authentication]);

  const createAccount = React.useCallback(
    async (first: string, last: string, email: string, password: string): Promise<Account | null> =>
      authentication.createAccount(first, last, email, password).then((result) => {
        if (result.status === 201) {
          setAccount(result.payload);
          return result.payload;
        }
        return null;
      }),
    [authentication],
  );

  killTimeout();

  React.useEffect(() => {
    if (loading) {
      void initialCheck();
    }
    if (account) {
      void periodicCheck();
    }
  }, [account, initialCheck, loading, periodicCheck]);

  const value = React.useMemo(
    () => ({ error, account, login, logout, createAccount }),
    [error, account, login, logout, createAccount],
  );

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
};
