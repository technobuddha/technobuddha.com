import React                 from 'react';
import fetcher               from '@technobuddha/library/fetcher';
import { replacer, reviver } from '@technobuddha/library/json';
import isArray               from 'lodash/isArray';
import every                 from 'lodash/every';
import isNil                 from 'lodash/isNil';
import range                 from 'lodash/range';
import Button                from '@material-ui/core/Button';
import { FaRegWindowClose }  from '%icons/fa/FaRegWindowClose';
import { useSnackbar }       from '#context/snackbar';
import FetchStatusError      from './FetchStatusError';
import ServerSnackbar        from './ServerSnackbar';
import authentication        from './serverCall/authentication';
import music                 from './serverCall/music';

import type { Options as FetcherOptions } from '@technobuddha/library/fetcher';

type APIState   = {
    authentication:         ReturnType<typeof authentication>;
    music:                  ReturnType<typeof music>;
};

const APIContext = React.createContext<APIState>(null!);
export function useAPI(): APIState {
    return React.useContext(APIContext);
}

const CONTENT_TYPE = 'Content-type';
const CONTENT_JSON = 'application/json;charset=utf-8';

export type API<T>                           = { status: number; statusText: string; payload: T };
export type APIValue<T extends API<unknown>> = T['payload'];
export type FetchAPIOptions                  = Omit<FetcherOptions, 'body'> & { validStatuses?: number[] };
export type FetchAPI                         = <T>(url: string, options: FetchAPIOptions, json?: unknown) => Promise<API<T>>;

export const APIProvider: React.FC = (props: { children?: React.ReactNode }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    async function fetchAPI<T>(url: string, options: FetchAPIOptions, json?: unknown): Promise<API<T>> {
        const validStatuses   = options.validStatuses ?? range(200, 300);
        let { headers }       = options;

        if(json) {
            if(isNil(headers)) {
                headers = { [CONTENT_TYPE]: CONTENT_JSON };
            } else if(headers instanceof Headers) {
                if(!headers.has(CONTENT_TYPE)) {
                    try {
                        headers.set(CONTENT_TYPE, CONTENT_JSON);
                        // eslint-disable-next-line no-empty
                    } catch{}
                }
            } else if(isArray(headers)) {
                if(every(headers, header => header[0].toLowerCase() !== CONTENT_TYPE.toLowerCase()))
                    headers.push([ CONTENT_TYPE, CONTENT_JSON ]);
            } else if(every(Object.keys(headers), header => header.toLowerCase() !== CONTENT_TYPE.toLowerCase())) {
                headers[CONTENT_TYPE] = CONTENT_JSON;
            }
        }

        const body = json ? JSON.stringify(json, replacer) : undefined;

        return fetcher(url, { ...options, headers, body })
        .then(
            response => {
                if(validStatuses.includes(response.status)) {
                    return (
                        // eslint-disable-next-line promise/no-nesting
                        response.text()
                        .then(str => {
                            return {
                                status:     response.status,
                                statusText: response.statusText,
                                payload:    JSON.parse(str, reviver),
                            };
                        })
                    );
                }

                throw new FetchStatusError(`${response.status} ${response.statusText}`, response.status, response.statusText);
            }
        )
        .catch(err => {
            const action = (key: string) => (
                <Button onClick={() => { closeSnackbar(key); }}><FaRegWindowClose /></Button>
            );

            enqueueSnackbar(
                (<ServerSnackbar err={err} />),
                {
                    persist: false,
                    variant: 'error',
                    action:  action,
                }
            );
            throw err;
        });
    }

    return (
        <APIContext.Provider
            value={{
                authentication:         authentication(fetchAPI),
                music:                  music(fetchAPI),
            }}
        >
            {props.children}
        </APIContext.Provider>
    );
};

export default useAPI;
