import camelcaseKeys from 'camelcase-keys';

import { AuthenticationAPI } from '#api/authentication';

import { FetchStatusError } from '../fetch-status-error.tsx';
import { type Account, type PasswordStrength } from '../schema.ts';

const api = new AuthenticationAPI({ host: 'http://localhost:3000' });

export async function readSession(): Promise<Account | null> {
  return api.readSession().then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload);
      }

      case 401: {
        return null;
      }

      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function createSession(email: string, password: string): Promise<Account | null> {
  return api.createSession({ body: { email, password } }).then((response) => {
    switch (response.status) {
      case 201: {
        return camelcaseKeys(response.payload);
      }

      case 401: {
        return null;
      }

      case 400:
      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function deleteSession(): Promise<void> {
  return api.deleteSession().then((response) => {
    switch (response.status) {
      case 204: {
        return undefined;
      }

      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function checkPasswordStrength(
  password: string,
  userInputs: string[] = [],
): Promise<PasswordStrength> {
  return api.checkPasswordStrength({ body: { password, userInputs } }).then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload);
      }

      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function createAccount(
  first: string,
  last: string,
  email: string,
  password: string,
): Promise<Account | null> {
  return api.createAccount({ body: { first, last, email, password } }).then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload);
      }

      case 401: {
        return null;
      }

      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}
