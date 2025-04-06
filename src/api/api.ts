import { Ajv, type ErrorObject } from 'ajv';
import { type OpenAPIV3_1 as OpenAPI } from 'openapi-types';
import { type JsonValue } from 'type-fest';

function errmsg(e: ErrorObject): string {
  if (e.instancePath.trim()) {
    return `${e.instancePath} ${e.message}`;
  }
  return e.message ?? 'unknown validation error';
}

export type RequestValidator = {
  name: string;
  in: string;
  required: boolean;
  schema: OpenAPI.SchemaObject | undefined;
}[];

export type ResponseValidator = Record<
  number,
  {
    headers?: Record<string, OpenAPI.SchemaObject>;
    content?: Record<string, OpenAPI.SchemaObject>;
  }
>;

export type SendRequestParameters = {
  path: string;
  urlParams?: URLSearchParams;
  method: Request['method'];
  headers: [string, string][];
  body?: unknown;
};

export type APIResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  headers?: Headers;
  contentType?: string;
  payload?: unknown;
};

export type APIOptions = {
  host: string;
  validate?(this: void, message: string): void;
};

export abstract class API {
  private readonly ajv: Ajv;
  protected readonly host: string;
  protected readonly validate: ((this: void, message: string) => void) | undefined;

  public constructor({ host, validate }: APIOptions) {
    this.host = host;
    this.validate = validate;

    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
    });
  }

  protected async httpRequest<T extends APIResponse>(
    { path, urlParams, method, headers, body }: SendRequestParameters,
    operationId: string,
    params: Record<string, unknown> | undefined,
    requestValidator?: RequestValidator,
    responseValidator?: ResponseValidator,
  ): Promise<T> {
    const url = new URL(`${this.host.endsWith('/') ? this.host.slice(0, -1) : this.host}${path}`);
    if (urlParams) {
      url.search = urlParams.toString();
    }
    const payload = body ? JSON.stringify(body) : null;

    headers.push(
      ['accept-encoding', '*'],
      ['accept', 'application/json; text/*'],
      ['host', url.host],
    );

    if (payload) {
      headers.push(
        ['content-type', 'application/json'],
        ['content-length', payload.length.toString()],
      );
    }

    const req = new Request(url, { method, headers, body: payload });

    if (params && this.validate && requestValidator) {
      for (const param of requestValidator) {
        const value = params[param.name];

        if (value === undefined) {
          if (param.required) {
            this.validate(`${operationId}: Request Parameter '${param.name}' is required.`);
          }
        } else if (param.schema) {
          if (!this.ajv.validate(param.schema, value)) {
            const message = this.ajv
              .errors!.map((e) => `${e.instancePath} ${e.message}`)
              .join('; ');
            this.validate(
              `${operationId}: Request Parameter '${param.name}' does not match schema: ${message}`,
            );
          }
        }
      }
    }

    return fetch(req).then(async (response) => {
      const h = new Headers(response.headers);
      let contentType = h.get('content-type');
      let responsePayload: JsonValue | undefined = undefined;

      if (contentType) {
        [contentType] = contentType.split(';');
        const [type, subtype] = contentType.trim().split('/');

        switch (type) {
          case 'application': {
            switch (subtype) {
              case 'json': {
                try {
                  responsePayload = (await response.json()) as JsonValue;
                } catch {
                  this.validate?.(
                    `${operationId}: Response Content-type is "application/json", however body is not valid JSON.`,
                  );
                }
                break;
              }

              default: {
                this.validate?.(
                  `${operationId}: Response Content-type is "${contentType.trim()}", which is not supported.`,
                );
              }
            }
            break;
          }

          case 'text': {
            responsePayload = await response.text();
            break;
          }

          default: {
            this.validate?.(
              `${operationId}: Response Content-type is "${contentType.trim()}", which is not supported.`,
            );
          }
        }
      }

      if (this.validate && responseValidator) {
        if (response.status in responseValidator) {
          const v1 = responseValidator[response.status];
          if (v1) {
            if (v1.headers) {
              for (const [header, schema] of Object.entries(v1.headers)) {
                const value = h.get(header);

                if (!this.ajv.validate(schema, value)) {
                  const message = this.ajv.errors!.map((e) => errmsg(e)).join('; ');
                  this.validate(
                    `${operationId}: Response Header '${header}' does not match schema: ${message}`,
                  );
                }
              }
            }

            if (contentType) {
              if (v1.content) {
                if (contentType in v1.content) {
                  const v2 = v1.content[contentType];
                  if (!this.ajv.validate(v2, responsePayload)) {
                    const message = this.ajv.errors!.map((e) => errmsg(e)).join('; ');
                    this.validate(
                      `${operationId}: Response Body does not match schema: ${message}`,
                    );
                  }
                } else {
                  this.validate(
                    `${operationId}: Response Unknown content-type '${contentType}' for status code ${response.status}`,
                  );
                }
              } else {
                this.validate(
                  `${operationId}: Response No content expected for status code ${response.status}`,
                );
              }
            } else if (v1.content) {
              this.validate(
                `${operationId}: Response Content expected for status code ${response.status}`,
              );
            }
          }
        } else {
          this.validate(
            `${operationId}: Response Status code ${response.status} is not in the specification.`,
          );
        }
      }

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: h,
        contentType,
        payload: responsePayload,
      } as T;
    });
  }
}
