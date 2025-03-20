import { toError } from '@technobuddha/library';

export class TimeoutError extends Error {
  public constructor() {
    super('Request Timeout');
    this.name = 'TimeoutError';
  }
}

export type Options = RequestInit & {
  /** The number of milliseconds before timeout */
  timeout?: number;
};

/**
 * Fetch a remote resource
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
 * @param url - The url of a resource that you wish to fetch
 * @param __namedParameters - see {@link Options}
 *
 * @throws TimeoutError when timeout occurs
 */
export async function fetcher(
  url: string,
  {
    body,
    cache = 'no-store',
    credentials = 'same-origin',
    keepalive = false,
    method = 'GET',
    mode = 'same-origin',
    headers = {},
    integrity,
    redirect = 'follow',
    referrer = 'client',
    referrerPolicy = 'no-referrer',
    signal,
    timeout = 600000,
    window,
  }: Options = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  if (signal) {
    signal.addEventListener('abort', () => {
      controller.abort();
    });
  }

  return fetch(encodeURI(url), {
    method,
    headers,
    body,
    cache,
    mode,
    credentials,
    redirect,
    referrer,
    referrerPolicy,
    integrity,
    keepalive,
    window,
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timer);
      return response;
    })
    .catch((error) => {
      clearTimeout(timer);
      if (!signal && error.name === 'AbortError') {
        throw new TimeoutError();
      }

      throw toError(error);
    });
}
