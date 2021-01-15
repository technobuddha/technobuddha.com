import fetchAPI from '../fetchAPI';

import type { Account } from '~src/schema/account';

type CPS = {score: number, warning: string, suggestions: string[]};
export const authentication = {
    async readSession() {
        return fetchAPI<Account>('/api/authentication/session', {method: 'GET', validStatuses: [200, 401]});
    },

    async createSession(username: string, password: string) {
        return fetchAPI<Account>('/api/authentication/session', {method: 'PUT', validStatuses: [201, 401]}, {username, password});
    },

    async deleteSession() {
        return fetchAPI<void>('/api/authentication/session', {method: 'DELETE', validStatuses: [200]});
    },

    async checkPasswordStrength(password: string, userInputs: string[] = []) {
        return fetchAPI<CPS>('/api/authentication/check-password-strength', {method: 'POST'}, {password, userInputs});
    },

    async createAccount(first: string, last: string, email: string, password: string) {
        return fetchAPI<Account>('/api/authentication/account', {method: 'PUT'}, {first, last, email, password});
    }
}

export default authentication;