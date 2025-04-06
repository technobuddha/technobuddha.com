/* eslint-env: node */

declare module 'i18next-scanner' {
  import type File from 'vinyl';

  export type I18NextScannerOptions = {
    debug?: boolean;
    removeUnusedKeys?: boolean;
    sort?: boolean;
    attr?:
      | false
      | {
          list?: string[];
          extensions?: string[];
        };
    func?:
      | false
      | {
          list?: string[];
          extensions?: string[];
        };
    trans?:
      | false
      | {
          component?: string;
          i18nKey?: string;
          defaultsKey?: string;
          extensions?: string[];
          fallbackKey?: false | ((ns: string, value: string) => string);
        };
    lngs?: readonly string[];
    ns?: string | readonly string[];
    defaultLng?: string;
    defaultNs?: string | readonly string[] | false;
    defaultValue?: string | null | ((lng: string, ns: string, key: string) => string | null);
    resource?: {
      loadPath?: string | ((lng: string, ns: string) => string);
      savePath?: string | ((lng: string, ns: string) => string);
      jsonIndent?: number;
      lineEnding?: string;
    };
    keySeparator?: false | string;
    nsSeparator?: false | string;
    context?:
      | boolean
      | ((lng: string, ns: string, key: string, options: I18NextScannerOptions) => boolean);
    contextFallback?: boolean;
    contextSeparator?: string;
    contextDefaultValues?: string[];
    plural?:
      | boolean
      | ((lng: string, ns: string, key: string, options: I18NextScannerOptions) => boolean);
    pluralFallback?: boolean;
    pluralSeparator?: string;
    interpolation?: {
      prefix?: string;
      suffix?: string;
    };
  };

  export type I18NextScannerConfig = {
    input: string[];
    output: string;
    options: I18NextScannerOptions;
    transform?(this: void, file: File, enc: string, done: () => void): void;
    flush?(this: void, done: () => void): void;
  };

  export class Parser {
    public options: I18NextScannerOptions;
    public resStore: { [key: string]: string };
    public resScan: { [key: string]: string };

    public constructor(options: I18NextScannerOptions);

    public log(...args: unknown[]): void;
    public formatResourceLoadPath(lng: string, ns: string): string;
    public formatResourceSavePath(lng: string, ns: string): string;

    public parseFuncFromString(content: string, customHandler?: (key: string) => void): Parser;
    public parseFuncFromString(
      content: string,
      opts: I18NextScannerOptions,
      customHandler?: (key: string) => void,
    ): Parser;

    public parseTransFromString(content: string, customHandler?: (key: string) => void): Parser;
    public parseTransFromString(
      content: string,
      opts: I18NextScannerOptions,
      customHandler?: (key: string) => void,
    ): Parser;

    public parseAttrFromString(content: string, customHandler?: (key: string) => void): Parser;
    public parseAttrFromString(
      content: string,
      opts: I18NextScannerOptions,
      customHandler?: (key: string) => void,
    ): Parser;

    public get(opts?: I18NextScannerOptions): {
      [language: string]: { [ns: string]: { [key: string]: string } };
    };
    public get(key: string, opts?: I18NextScannerOptions): string;

    public set(key: string, options?: I18NextScannerOptions): void;

    public toJSON(options?: I18NextScannerOptions): string;
  }

  export function createStream(
    options: I18NextScannerOptions,
    customTransform?: I18NextScannerConfig['transform'],
    customFlush?: I18NextScannerConfig['flush'],
  ): NodeJS.ReadWriteStream;

  export default createStream;
}
