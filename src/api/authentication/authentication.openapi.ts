// 🚨 THIS FILE IS GENERATED, CHANGES TO THIS FILE WILL BE OVERRIDDEN
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export type paths = {
  readonly '/api/authentication/session': {
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
     * Get login session
     * @description Get login session
     */
    readonly get: operations['readSession'];
    /**
     * Create login session
     * @description Create login session
     */
    readonly put: operations['createSession'];
    readonly post?: never;
    /**
     * Delete login session
     * @description Delete login session
     */
    readonly delete: operations['deleteSession'];
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/api/authentication/check-password-strength': {
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
    readonly get?: never;
    readonly put?: never;
    /**
     * Check Password Strength
     * @description Check Password Strength
     */
    readonly post: operations['checkPasswordStrength'];
    readonly delete?: never;
    readonly options?: never;
    readonly head?: never;
    readonly patch?: never;
    readonly trace?: never;
  };
  readonly '/api/authentication/account': {
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
    readonly get?: never;
    /**
     * Create Account
     * @description Create Account
     */
    readonly put: operations['createAccount'];
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
    readonly Account: {
      readonly id: number;
      readonly email: string;
      readonly first: string;
      readonly last: string;
      readonly admin: boolean;
      readonly disabled: boolean;
      readonly confirmed: string | null;
      readonly failed_logins: number;
      readonly locked: string | null;
      /** Format: date-time */
      readonly created: string;
      readonly updated: string | null;
      readonly policy_accepted: string | null;
    };
    readonly AccountCreate: {
      readonly email: string;
      readonly first: string;
      readonly last: string;
      readonly admin?: boolean;
      readonly disabled?: boolean;
      readonly confirmed?: string | null;
      readonly failed_logins?: number;
      readonly locked?: string | null;
      /** Format: date-time */
      readonly created?: string;
      readonly updated?: string | null;
      readonly policy_accepted?: string | null;
      readonly password: string;
    };
    readonly AccountLogin: {
      readonly email: string;
      readonly password: string;
    };
    readonly CheckPasswordStrength: {
      readonly password: string;
      readonly userInputs?: readonly string[];
    };
    readonly PasswordStrength: {
      readonly score: number;
      readonly warning: string;
      readonly suggestions: readonly string[];
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
    readonly Exception401: string;
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
    /** @description Account information */
    readonly Account: {
      headers: {
        readonly 'content-type': components['headers']['ContentType'];
        readonly 'cache-control': components['headers']['CacheControl'];
        readonly 'set-cookie': components['headers']['Set-Cookie'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': components['schemas']['Account'];
      };
    };
    /** @description Password strength information */
    readonly PasswordStrength: {
      headers: {
        readonly 'content-type': components['headers']['ContentType'];
        readonly 'cache-control': components['headers']['CacheControl'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': components['schemas']['PasswordStrength'];
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
    /** @description UNAUTHORIZED */
    readonly Unauthorized: {
      headers: {
        readonly 'set-cookie': components['headers']['Set-Cookie'];
        readonly [name: string]: unknown;
      };
      content: {
        readonly 'application/json': components['schemas']['Exception401'];
      };
    };
    /** @description NO CONTENT */
    readonly NoContent: {
      headers: {
        readonly 'set-cookie': components['headers']['Set-Cookie'];
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
    /** @description Session cookie */
    readonly 'session': string;
  };
  requestBodies: {
    readonly CheckPasswordStrength: {
      readonly content: {
        readonly 'application/json': components['schemas']['CheckPasswordStrength'];
      };
    };
    readonly AccountCreate: {
      readonly content: {
        readonly 'application/json': components['schemas']['AccountCreate'];
      };
    };
    readonly AccountLogin: {
      readonly content: {
        readonly 'application/json': components['schemas']['AccountLogin'];
      };
    };
  };
  headers: {
    /** @description The MIME type of the body of the response. */
    readonly 'ContentType': string;
    /**
     * @description Header used to direct caching done by browsers. Must be set to 'no-store'
     * @example no-store
     */
    readonly 'CacheControl': string;
    /** @description The Set-Cookie header used to set the session cookie. */
    readonly 'Set-Cookie': string;
  };
  pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
  readonly readSession: {
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
      readonly cookie?: {
        /** @description Session cookie */
        readonly session?: components['parameters']['session'];
      };
    };
    readonly requestBody?: never;
    readonly responses: {
      readonly 200: components['responses']['Account'];
      readonly 401: components['responses']['Unauthorized'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly createSession: {
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
      readonly cookie?: {
        /** @description Session cookie */
        readonly session?: components['parameters']['session'];
      };
    };
    readonly requestBody?: components['requestBodies']['AccountLogin'];
    readonly responses: {
      readonly 201: components['responses']['Account'];
      readonly 400: components['responses']['BadRequest'];
      readonly 401: components['responses']['Unauthorized'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly deleteSession: {
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
      readonly cookie?: {
        /** @description Session cookie */
        readonly session?: components['parameters']['session'];
      };
    };
    readonly requestBody?: never;
    readonly responses: {
      readonly 204: components['responses']['NoContent'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly checkPasswordStrength: {
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
    readonly requestBody?: components['requestBodies']['CheckPasswordStrength'];
    readonly responses: {
      readonly 200: components['responses']['PasswordStrength'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
  readonly createAccount: {
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
    readonly requestBody?: components['requestBodies']['AccountCreate'];
    readonly responses: {
      readonly 200: components['responses']['Account'];
      readonly 401: components['responses']['Unauthorized'];
      readonly 500: components['responses']['InternalServerError'];
    };
  };
}
