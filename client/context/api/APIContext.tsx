import React                        from 'react';
import {useTranslation}             from '$client/context/i18n';
import {useSnackbar}                from 'notistack';
import isArray                      from 'lodash/isArray';
import keys                         from 'lodash/keys';
import every                        from 'lodash/every';
import isNil                        from 'lodash/isNil';
import range                        from 'lodash/range';
import {replacer, reviver}          from '@technobuddha/library/json';
import fetcher, {Options as FetcherOptions}    from '@technobuddha/library/fetcher';
import Account                      from '$interface/Account';
import ServerError                  from './ServerError';

export type FetchAPIOptions     = Omit<FetcherOptions, 'body'> & {validStatuses?: number[]};
export type API<T>              = {status: number, statusText: string, payload: T};

type CPS        = {score: number, warning: string, suggestions: string[]};
type APIState   = {
    fetchAPI:                       <T>(url: string, options: FetchAPIOptions, json?: Record<string, unknown>) => Promise<API<T>>,
    authentication: {
        readSession:                () => Promise<API<Account>>,
        createSession:              (username: string, password: string) => Promise<API<Account>>,
        deleteSession:              () => Promise<API<unknown>>,
        checkPasswordStrength:      (password: string, userInputs?: string[]) => Promise<API<CPS>>,
        createAccount:              (first: string, last: string, email: string, password: string) => Promise<API<Account>>,
    },
    music: {
        readTracks:                 () => Promise<API<Record<string, unknown>[]>>;
        countTracks:                () => Promise<API<number>>;
    }
}

const APIContext = React.createContext<APIState>(null!);

export function useAPI() {
   return React.useContext(APIContext);
}

const CONTENT_TYPE = 'Content-type';
const CONTENT_JSON = 'application/json;charset=utf-8';

export const APIProvider: React.FC = (props: {children?: React.ReactNode}) => {
    const {t}               = useTranslation();
    const {enqueueSnackbar} = useSnackbar();

    async function fetchAPI<T>(url: string, options: FetchAPIOptions, json?: Record<string, unknown>): Promise<API<T>> {
        const validStatuses   = options.validStatuses ?? range(200, 300);
        let headers         = options.headers;

        if(json) {
            if(isNil(headers)) {
                headers = {[CONTENT_TYPE]: CONTENT_JSON}
            } else if(headers instanceof Headers) {
                if(!headers.has(CONTENT_TYPE)) {
                    try {
                        headers.set(CONTENT_TYPE, CONTENT_JSON)
                    // eslint-disable-next-line no-empty
                    } catch {}
                }
            } else if (isArray(headers)) {
                if(every(headers, header => header[0].toLowerCase() !== CONTENT_TYPE.toLowerCase())) {
                    headers.push([CONTENT_TYPE, CONTENT_JSON])
                }
            } else {
                if(every(keys(headers), header => header.toLowerCase() !== CONTENT_TYPE.toLowerCase())) {
                    headers[CONTENT_TYPE] = CONTENT_JSON;
                }
            }
        }

        const body          = json ? JSON.stringify(json, replacer) : undefined;

        return fetcher(url, { ...options, headers, body})
        .then (
            response => {
                if (validStatuses.includes(response.status)) {
                    return (
                        response.text()
                        .then(str => {
                            return {
                                status:     response.status,
                                statusText: response.statusText,
                                payload:    JSON.parse(str, reviver),
                            }
                        })
                    );
                } else {
                    throw Error(`${t('Status code:')} ${response.status} ${response.statusText}`);
                }
            }
        ).catch(err => { 
            enqueueSnackbar((<ServerError err={err}/>), {persist: true, variant: 'error'})
            throw err; 
        });
    }

    const authentication = {
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

    const music = {
        async readTracks() {
            return fetchAPI<Record<string, unknown>[]>('/api/music/tracks', {method: 'GET', validStatuses: [200]});
        },

        async countTracks() {
            return fetchAPI<number>('/api/music/tracks', {method: 'POST', validStatuses: [200]})
        }
    }

    return (
        <APIContext.Provider value={{fetchAPI, authentication, music}}>
            {props.children}
        </APIContext.Provider>
    )
}

export default useAPI;
