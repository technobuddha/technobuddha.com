import React from 'react';

import { type Account } from '#schema';

export type AuthenticationState = {
  error: boolean;
  account: Account | null;
  login(username: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
  createAccount(
    first: string,
    last: string,
    email: string,
    password: string,
  ): Promise<Account | null>;
};

export const AuthenticationContext = React.createContext<AuthenticationState>(null!);

export function useAuthentication(): AuthenticationState {
  return React.useContext(AuthenticationContext);
}
