import React from 'react';
import fetcher from '@technobuddha/library/fetcher';
import { replacer, reviver } from '@technobuddha/library/json';
import { isArray, every, isNil, range } from 'lodash-es';
import Button from '@mui/material/Button';
import { FaRegWindowClose } from 'react-icons/fa';
import { useSnackbar, type SnackbarKey } from '#context/snackbar';
import { FetchStatusError } from './fetch-status-error';
import { ServerSnackbar } from './server-snackbar';
import { authentication } from './serverCall/authentication.js';
import { music } from './serverCall/music.js';

import type { Options as FetcherOptions } from '@technobuddha/library/fetcher';

type APIState = {
  authentication: ReturnType<typeof authentication>;
  music: ReturnType<typeof music>;
};

const APIContext = React.createContext<APIState>(null!);
export function useAPI(): APIState {
  return React.useContext(APIContext);
}

const CONTENT_TYPE = 'Content-type';
const CONTENT_JSON = 'application/json;charset=utf-8';

export type API<T> = { status: number; statusText: string; payload: T };
export type APIValue<T extends API<unknown>> = T['payload'];
export type FetchAPIOptions = Omit<FetcherOptions, 'body'> & { validStatuses?: number[] };
export type FetchAPI = <T>(
  url: string,
  options: FetchAPIOptions,
  json?: unknown,
) => Promise<API<T>>;

type APIProviderProps = {
  children?: React.ReactNode;
};

export const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  async function fetchAPI<T>(
    url: string,
    options: FetchAPIOptions,
    json?: unknown,
  ): Promise<API<T>> {
    const validStatuses = options.validStatuses ?? range(200, 300);
    let { headers } = options;

    if (json) {
      if (isNil(headers)) {
        headers = { [CONTENT_TYPE]: CONTENT_JSON };
      } else if (headers instanceof Headers) {
        if (!headers.has(CONTENT_TYPE)) {
          try {
            headers.set(CONTENT_TYPE, CONTENT_JSON);
            // eslint-disable-next-line no-empty
          } catch {}
        }
      } else if (isArray(headers)) {
        if (every(headers, (header) => header[0].toLowerCase() !== CONTENT_TYPE.toLowerCase()))
          headers.push([CONTENT_TYPE, CONTENT_JSON]);
      } else if (
        every(Object.keys(headers), (header) => header.toLowerCase() !== CONTENT_TYPE.toLowerCase())
      ) {
        headers[CONTENT_TYPE] = CONTENT_JSON;
      }
    }

    const body = json ? JSON.stringify(json, replacer) : undefined;

    return fetcher(url, { ...options, headers, body })
      .then((response) => {
        if (validStatuses.includes(response.status)) {
          return (
            // eslint-disable-next-line promise/no-nesting
            response.text().then((str) => {
              return {
                status: response.status,
                statusText: response.statusText,
                payload: JSON.parse(str, reviver),
              };
            })
          );
        }

        throw new FetchStatusError(
          `${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      })
      .catch((err) => {
        const action = (key: SnackbarKey) => (
          <Button
            onClick={() => {
              closeSnackbar(key);
            }}
          >
            <FaRegWindowClose />
          </Button>
        );

        enqueueSnackbar(<ServerSnackbar err={err} />, {
          persist: false,
          variant: 'error',
          action: action,
        });
        throw err;
      });
  }

  return (
    <APIContext.Provider
      value={{
        authentication: authentication(fetchAPI),
        music: music(fetchAPI),
      }}
    >
      {children}
    </APIContext.Provider>
  );
};
