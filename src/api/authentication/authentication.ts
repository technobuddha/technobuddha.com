// 🚨 THIS FILE IS GENERATED, CHANGES TO THIS FILE WILL BE OVERRIDDEN
import { API, type APIOptions, type RequestValidator, type ResponseValidator } from '../api.ts';

import { type components, type paths } from './authentication.openapi.ts';

/**
 * title: Technobuddha Authentication API
 * version: 0.1.0
 *
 * @remarks
 *
 * Technobuddha authorization
 */
export class AuthenticationAPI extends API {
  /**
   *
   * Get login session
   *
   * @remarks
   *
   * Get login session
   */
  public async readSession(
    params: AuthenticationAPI.ReadSessionParameters = {},
  ): Promise<AuthenticationAPI.ReadSessionResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<AuthenticationAPI.ReadSessionResponse>(
      { path: `/api/authentication/session`, method: 'GET', headers },
      'readSession',
      params,
      readSessionRequestValidator,
      readSessionResponseValidator,
    );
  }
  /**
   *
   * Create login session
   *
   * @remarks
   *
   * Create login session
   */
  public async createSession(
    params: AuthenticationAPI.CreateSessionParameters = {},
  ): Promise<AuthenticationAPI.CreateSessionResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<AuthenticationAPI.CreateSessionResponse>(
      { path: `/api/authentication/session`, method: 'PUT', headers, body: params.body },
      'createSession',
      params,
      createSessionRequestValidator,
      createSessionResponseValidator,
    );
  }
  /**
   *
   * Delete login session
   *
   * @remarks
   *
   * Delete login session
   */
  public async deleteSession(
    params: AuthenticationAPI.DeleteSessionParameters = {},
  ): Promise<AuthenticationAPI.DeleteSessionResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<AuthenticationAPI.DeleteSessionResponse>(
      { path: `/api/authentication/session`, method: 'DELETE', headers },
      'deleteSession',
      params,
      deleteSessionRequestValidator,
      deleteSessionResponseValidator,
    );
  }
  /**
   *
   * Check Password Strength
   *
   * @remarks
   *
   * Check Password Strength
   */
  public async checkPasswordStrength(
    params: AuthenticationAPI.CheckPasswordStrengthParameters = {},
  ): Promise<AuthenticationAPI.CheckPasswordStrengthResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<AuthenticationAPI.CheckPasswordStrengthResponse>(
      {
        path: `/api/authentication/check-password-strength`,
        method: 'POST',
        headers,
        body: params.body,
      },
      'checkPasswordStrength',
      params,
      checkPasswordStrengthRequestValidator,
      checkPasswordStrengthResponseValidator,
    );
  }
  /**
   *
   * Create Account
   *
   * @remarks
   *
   * Create Account
   */
  public async createAccount(
    params: AuthenticationAPI.CreateAccountParameters = {},
  ): Promise<AuthenticationAPI.CreateAccountResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<AuthenticationAPI.CreateAccountResponse>(
      { path: `/api/authentication/account`, method: 'PUT', headers, body: params.body },
      'createAccount',
      params,
      createAccountRequestValidator,
      createAccountResponseValidator,
    );
  }

  public constructor(options: APIOptions) {
    super(options);
  }
}
export namespace AuthenticationAPI {
  export type ReadSessionParameters = {
    /**
     *
     */
    session?:
      | NonNullable<paths['/api/authentication/session']['get']['parameters']['cookie']>['session']
      | undefined;
  };
  export type ReadSessionResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['get']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 401;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['get']['responses']['401']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['get']['responses']['500']['content']['application/json'];
      };

  export type CreateSessionRequest = NonNullable<
    paths['/api/authentication/session']['put']['requestBody']
  >['content']['application/json'];
  export type CreateSessionParameters = {
    /**
     *
     */
    body?: CreateSessionRequest | undefined;
    /**
     *
     */
    session?:
      | NonNullable<paths['/api/authentication/session']['put']['parameters']['cookie']>['session']
      | undefined;
  };
  export type CreateSessionResponse =
    | {
        ok: true;
        status: 201;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['put']['responses']['201']['content']['application/json'];
      }
    | {
        ok: false;
        status: 400;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['put']['responses']['400']['content']['application/json'];
      }
    | {
        ok: false;
        status: 401;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['put']['responses']['401']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['put']['responses']['500']['content']['application/json'];
      };

  export type DeleteSessionParameters = {
    /**
     *
     */
    session?:
      | NonNullable<
          paths['/api/authentication/session']['delete']['parameters']['cookie']
        >['session']
      | undefined;
  };
  export type DeleteSessionResponse =
    | { ok: true; status: 204; statusText: string }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/session']['delete']['responses']['500']['content']['application/json'];
      };

  export type CheckPasswordStrengthRequest = NonNullable<
    paths['/api/authentication/check-password-strength']['post']['requestBody']
  >['content']['application/json'];
  export type CheckPasswordStrengthParameters = {
    /**
     *
     */
    body?: CheckPasswordStrengthRequest | undefined;
  };
  export type CheckPasswordStrengthResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/check-password-strength']['post']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/check-password-strength']['post']['responses']['500']['content']['application/json'];
      };

  export type CreateAccountRequest = NonNullable<
    paths['/api/authentication/account']['put']['requestBody']
  >['content']['application/json'];
  export type CreateAccountParameters = {
    /**
     *
     */
    body?: CreateAccountRequest | undefined;
  };
  export type CreateAccountResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/account']['put']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 401;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/account']['put']['responses']['401']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/authentication/account']['put']['responses']['500']['content']['application/json'];
      };

  export type Account = components['schemas']['Account'];
  export type AccountCreate = components['schemas']['AccountCreate'];
  export type AccountLogin = components['schemas']['AccountLogin'];
  export type CheckPasswordStrength = components['schemas']['CheckPasswordStrength'];
  export type PasswordStrength = components['schemas']['PasswordStrength'];
  export type Exception400 = components['schemas']['Exception400'];
  export type Exception401 = components['schemas']['Exception401'];
  export type Exception500 = components['schemas']['Exception500'];
}

export const readSessionRequestValidator: RequestValidator = [
  {
    name: 'session',
    in: 'cookie',
    required: false,
    schema: { type: 'string' },
  },
];

const readSessionResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
      'set-cookie': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'object',
        properties: {
          id: { type: 'number' },
          email: { type: 'string' },
          first: { type: 'string' },
          last: { type: 'string' },
          admin: { type: 'boolean' },
          disabled: { type: 'boolean' },
          confirmed: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          failed_logins: { type: 'number' },
          locked: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          created: { type: 'string', format: 'date-time' },
          updated: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          policy_accepted: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        },
        required: [
          'id',
          'email',
          'first',
          'last',
          'admin',
          'disabled',
          'confirmed',
          'failed_logins',
          'locked',
          'created',
          'updated',
          'policy_accepted',
        ],
        additionalProperties: false,
      },
    },
  },
  401: {
    headers: {
      'set-cookie': { type: 'string' },
    },
    content: {
      'application/json': { type: 'string' },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const createSessionRequestValidator: RequestValidator = [
  {
    name: 'body',
    in: 'body',
    required: false,
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
      required: ['email', 'password'],
      additionalProperties: false,
    },
  },
  {
    name: 'session',
    in: 'cookie',
    required: false,
    schema: { type: 'string' },
  },
];

const createSessionResponseValidator: ResponseValidator = {
  201: {
    headers: {
      'cache-control': { type: 'string' },
      'set-cookie': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'object',
        properties: {
          id: { type: 'number' },
          email: { type: 'string' },
          first: { type: 'string' },
          last: { type: 'string' },
          admin: { type: 'boolean' },
          disabled: { type: 'boolean' },
          confirmed: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          failed_logins: { type: 'number' },
          locked: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          created: { type: 'string', format: 'date-time' },
          updated: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          policy_accepted: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        },
        required: [
          'id',
          'email',
          'first',
          'last',
          'admin',
          'disabled',
          'confirmed',
          'failed_logins',
          'locked',
          'created',
          'updated',
          'policy_accepted',
        ],
        additionalProperties: false,
      },
    },
  },
  400: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
  401: {
    headers: {
      'set-cookie': { type: 'string' },
    },
    content: {
      'application/json': { type: 'string' },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const deleteSessionRequestValidator: RequestValidator = [
  {
    name: 'session',
    in: 'cookie',
    required: false,
    schema: { type: 'string' },
  },
];

const deleteSessionResponseValidator: ResponseValidator = {
  204: {
    headers: {
      'set-cookie': { type: 'string' },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const checkPasswordStrengthRequestValidator: RequestValidator = [
  {
    name: 'body',
    in: 'body',
    required: false,
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string' },
        userInputs: { type: 'array', items: { type: 'string' } },
      },
      required: ['password'],
      additionalProperties: false,
    },
  },
];

const checkPasswordStrengthResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'object',
        properties: {
          score: { type: 'number', minimum: 0, maximum: 4 },
          warning: { type: 'string' },
          suggestions: { type: 'array', items: { type: 'string' } },
        },
        required: ['score', 'warning', 'suggestions'],
        additionalProperties: false,
      },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const createAccountRequestValidator: RequestValidator = [
  {
    name: 'body',
    in: 'body',
    required: false,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        first: { type: 'string' },
        last: { type: 'string' },
        admin: { type: 'boolean' },
        disabled: { type: 'boolean' },
        confirmed: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        failed_logins: { type: 'number' },
        locked: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        created: { type: 'string', format: 'date-time' },
        updated: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        policy_accepted: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        password: { type: 'string' },
      },
      required: ['email', 'first', 'last', 'password'],
      additionalProperties: false,
    },
  },
];

const createAccountResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
      'set-cookie': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'object',
        properties: {
          id: { type: 'number' },
          email: { type: 'string' },
          first: { type: 'string' },
          last: { type: 'string' },
          admin: { type: 'boolean' },
          disabled: { type: 'boolean' },
          confirmed: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          failed_logins: { type: 'number' },
          locked: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          created: { type: 'string', format: 'date-time' },
          updated: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
          policy_accepted: { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
        },
        required: [
          'id',
          'email',
          'first',
          'last',
          'admin',
          'disabled',
          'confirmed',
          'failed_logins',
          'locked',
          'created',
          'updated',
          'policy_accepted',
        ],
        additionalProperties: false,
      },
    },
  },
  401: {
    headers: {
      'set-cookie': { type: 'string' },
    },
    content: {
      'application/json': { type: 'string' },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};
