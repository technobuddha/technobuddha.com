// 🚨 THIS FILE IS GENERATED, CHANGES TO THIS FILE WILL BE OVERRIDDEN
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export type paths = {
  readonly '/api/music/tracks': {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    /**
     * Get all music tracks
     * @description Get all music tracks
     */
    readonly get: operations['getTracks'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/api/music/new-albums': {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    /**
     * Get new albums
     * @description Get new albums
     */
    readonly get: operations['getNewAlbums'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/api/music/artists': {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    /**
     * Get artists
     * @description Get artists
     */
    readonly get: operations['getArtists'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/api/music/genres': {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    /**
     * Get genres
     * @description Get genres
     */
    readonly get: operations['getGenres'];
    readonly put?: never;
    readonly post?: never;
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
};
export type webhooks = Record<string, never>;
export type components = {
  schemas: {
    readonly Album: {
      readonly artist: readonly string[];
      readonly album: string;
      readonly year: number;
      readonly genre: readonly string[];
      readonly subgenre: readonly string[];
      readonly title: readonly string[];
    };
    readonly Artist: {
      readonly artist: string;
      readonly album: string;
      readonly genre: readonly string[];
      readonly subgenre: readonly string[];
      readonly year: number;
    };
    readonly Genre: {
      readonly genre: readonly string[];
      readonly subgenre: readonly string[];
      readonly album: string;
      readonly year: number;
    };
    readonly Track: {
      /** Format: uuid */
      readonly content_id?: string;
      readonly artist: readonly string[];
      readonly album: string;
      readonly disc_number: string;
      readonly track_number: string;
      readonly title: string;
      readonly genre: readonly string[];
    };
    readonly Exception400: {
      /** @example BadRequestException */
      readonly exception?: string;
      readonly message?: readonly string[];
      /** @example 400 */
      readonly statusCode?: number;
      /**
       * Format: date-time
       * @example 2024-09-16T15:51:29.832Z
       */
      readonly timestamp?: string;
      /** @example POST */
      readonly method?: string;
      /** @example /households/1234567890 */
      readonly path?: string;
    };
    readonly Exception500: {
      /** @example InternalServerError */
      readonly exception?: string;
      readonly message?: readonly string[];
      /** @example 500 */
      readonly statusCode?: number;
      /**
       * Format: date-time
       * @example 2024-09-16T15:51:29.832Z
       */
      readonly timestamp?: string;
      /** @example POST */
      readonly method?: string;
      /** @example /households/1234567890 */
      readonly path?: string;
    };
  };
  responses: {
    /** @description A list of albums */
    readonly Albums: {
      headers: {
        readonly 'content-type': components['headers']['ContentType'];
        readonly 'cache-control': components['headers']['CacheControl'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': readonly components['schemas']['Album'][];
      };
    };
    /** @description A list of artists */
    readonly Artists: {
      headers: {
        readonly 'content-type': components['headers']['ContentType'];
        readonly 'cache-control': components['headers']['CacheControl'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': readonly components['schemas']['Artist'][];
      };
    };
    /** @description A list of artists */
    readonly Genres: {
      headers: {
        readonly 'content-type': components['headers']['ContentType'];
        readonly 'cache-control': components['headers']['CacheControl'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': readonly components['schemas']['Genre'][];
      };
    };
    /** @description A list of tracks */
    readonly Tracks: {
      headers: {
        readonly 'content-type': components['headers']['ContentType'];
        readonly 'cache-control': components['headers']['CacheControl'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': readonly components['schemas']['Track'][];
      };
    };
    /** @description BAD REQUEST */
    readonly BadRequest: {
      headers: {
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': components['schemas']['Exception400'];
      };
    };
    /** @description NO CONTENT */
    readonly NoContent: {
      headers: {
        readonly [name: string]: unknown;
      };
      content?: never;
    };
    /** @description Internal Server Error */
    readonly InternalServerError: {
      headers: {
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': components['schemas']['Exception500'];
      };
    };
  };
  parameters: {
    /**
     * @description Acceptable content-types
     * @example application/json
     */
    readonly 'accept': string;
    /**
     * @description Acceptable content encodings
     * @example gzip, deflate
     */
    readonly 'accept-encoding': string;
  };
  requestBodies: never;
  headers: {
    /** @description The MIME type of the body of the response. */
    readonly ContentType: string;
    /**
     * @description Header used to direct caching done by browsers. Must be set to 'no-store'
     * @example no-store
     */
    readonly CacheControl: string;
  };
  pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
  readonly getTracks: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      readonly 200: components['responses']['Tracks'];
      readonly 400: components['responses']['BadRequest'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly getNewAlbums: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      readonly 200: components['responses']['Albums'];
      readonly 400: components['responses']['BadRequest'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly getArtists: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      readonly 200: components['responses']['Artists'];
      readonly 400: components['responses']['BadRequest'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly getGenres: {
    readonly parameters: {
      readonly query?: never;
      readonly header: {
        /**
         * @description Acceptable content-types
         * @example application/json
         */
        readonly 'accept': components['parameters']['accept'];
        /**
         * @description Acceptable content encodings
         * @example gzip, deflate
         */
        readonly 'accept-encoding'?: components['parameters']['accept-encoding'];
      };
      readonly path?: never;
      readonly cookie?: never;
    };
    readonly requestBody?: never;
    readonly responses: {
      readonly 200: components['responses']['Genres'];
      readonly 400: components['responses']['BadRequest'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
}
