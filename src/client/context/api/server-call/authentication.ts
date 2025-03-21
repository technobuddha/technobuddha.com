import { type Account } from '#schema';

import { type FetchAPI } from '../api-context.tsx';

type CPS = { score: number; warning: string; suggestions: string[] };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authentication = (fetchAPI: FetchAPI) => ({
  async readSession() {
    return fetchAPI<Account>('/api/authentication/session', {
      method: 'GET',
      validStatuses: [200, 401],
    });
  },

  async createSession(username: string, password: string) {
    return fetchAPI<Account>(
      '/api/authentication/session',
      { method: 'PUT', validStatuses: [201, 401] },
      { username, password },
    );
  },

  async deleteSession() {
    return fetchAPI<unknown>('/api/authentication/session', {
      method: 'DELETE',
      validStatuses: [200],
    });
  },

  async checkPasswordStrength(password: string, userInputs: string[] = []) {
    return fetchAPI<CPS>(
      '/api/authentication/check-password-strength',
      { method: 'POST' },
      { password, userInputs },
    );
  },

  async createAccount(first: string, last: string, email: string, password: string) {
    return fetchAPI<Account>(
      '/api/authentication/account',
      { method: 'PUT' },
      { first, last, email, password },
    );
  },
});
