
export class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TimeoutError';
    }
}

export type FetcherOptions      = RequestInit & {timeout?: number};

export async function fetcher(
    url:    string,
    {
        body,
        cache           = 'no-store',
        credentials     = 'same-origin',
        keepalive       = false,
        method          = 'GET',
        mode            = 'same-origin',
        headers         = {},
        integrity,
        redirect        = 'follow',
        referrer        = 'client',
        referrerPolicy  = 'no-referrer',
        signal,
        timeout         = 600000,
        window
    }:  FetcherOptions
){
    const controller    = new AbortController();
    const timer         = setTimeout(() => { controller.abort(); }, timeout);

    if(signal) {
        signal.addEventListener('abort', () => controller.abort());
    }

    return fetch(
        encodeURI(url),
        { method, headers, body, cache, mode, credentials, redirect, referrer, referrerPolicy, integrity, keepalive, window, signal: controller.signal }
    ).then(response => {
        clearTimeout(timer);
        return response;
    }).catch(error => {
        clearTimeout(timer);
        if(error instanceof DOMException && error.name === 'AbortError') {
            throw new TimeoutError(url);
        }

        throw error;
    });
}

export default fetcher;