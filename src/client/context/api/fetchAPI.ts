import fetcher             from '@technobuddha/library/fetcher';
import {replacer, reviver} from '@technobuddha/library/json';
import isArray             from 'lodash/isArray';
import every               from 'lodash/every';
import isNil               from 'lodash/isNil';
import range               from 'lodash/range';

import type {Options as FetcherOptions}    from '@technobuddha/library/fetcher';

const CONTENT_TYPE = 'Content-type';
const CONTENT_JSON = 'application/json;charset=utf-8';

export type API<T>          = {status: number, statusText: string, payload: T};
export type FetchAPIOptions = Omit<FetcherOptions, 'body'> & {validStatuses?: number[]};
export async function fetchAPI<T>(url: string, options: FetchAPIOptions, json?: Record<string, unknown>): Promise<API<T>> {
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
            if(every(Object.keys(headers), header => header.toLowerCase() !== CONTENT_TYPE.toLowerCase())) {
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
                // TODO TRANSLATE OUTSIDE OF CONTEXT
                throw Error(`Status code: ${response.status} ${response.statusText}`);
            }
        }
    ).catch(err => { 
        console.error(err);
        //enqueueSnackbar((<ServerError err={err}/>), {persist: true, variant: 'error'})
        throw err; 
    });
}

export default fetchAPI;
