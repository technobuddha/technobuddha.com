import React from 'react';
import { shallowEquals } from '@technobuddha/library';

import { type Account, useAPI } from '#context/api';
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
  failedLogins: 0,
  locked: null,
  created: new Date().toISOString(),
  updated: null,
  policyAccepted: null,
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
  const { authentication } = useAPI() ?? {}; // TODO [2025-10-01]: Why is this coming out undefined in HMR

  const checkLogin = React.useCallback(async (): Promise<void> => {
    if (authenticationSettings.login) {
      // TODO [2025-10-01]: Why is this coming out undefined in HMR
      return authentication
        ?.readSession()
        .then((session) => {
          if (session) {
            if (!shallowEquals(session, account)) {
              setAccount(session as unknown as Account);
            }
          } else {
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
    return undefined;
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
      authentication.createSession(username, password).then((session) => {
        if (session) {
          if (!shallowEquals(session, account)) {
            setAccount(session as unknown as Account);
          }
          return true;
        }
        return false;
      }),
    [account, authentication],
  );

  const logout = React.useCallback(async (): Promise<void> => {
    await authentication.deleteSession();
    setAccount(null);
  }, [authentication]);

  const createAccount = React.useCallback(
    async (first: string, last: string, email: string, password: string): Promise<Account | null> =>
      authentication.createAccount(first, last, email, password).then((session) => {
        if (session) {
          setAccount(session as unknown as Account);
          return session as unknown as Account;
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
