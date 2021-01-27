declare module 'i18next-scanner' {
    import type File from 'vinyl';

    export type I18NextScannerOptions = {
        debug?:                 boolean;
        removeUnusedKeys?:      boolean;
        sort?:                  boolean;
        attr?:                  false | {
            list?:              string[];
            extensions?:        string[];
        };
        func?:                  false | {
            list?:              string[];
            extensions?:        string[];
        };
        trans?:                 false | {
            component?:         string;
            i18nKey?:           string;
            defaultsKey?:       string;
            extensions?:        string[];
            fallbackKey?:       false | ((ns: string, value: string) => string);
        };
        lngs?:                  string[];
        ns?:                    string | string[];
        defaultLng?:            string;
        defaultNs?:             string;
        defaultValue?:          string | null | ((lng: string, ns: string, key: string) => string | null);
        resource?: {
            loadPath?:          string | ((lng: string, ns: string) => string);
            savePath?:          string | ((lng: string, ns: string) => string);
            jsonIndent?:        number;
            lineEnding?:        string;
        };
        keySeparator?:          false | string;
        nsSeparator?:           false | string;
        context?:               boolean | ((lng: string, ns: string, key: string, options: I18NextScannerOptions) => boolean);
        contextFallback?:       boolean;
        contextSeparator?:      string;
        contextDefaultValues?:  string[];
        plural?:                boolean | ((lng: string, ns: string, key: string, options: I18NextScannerOptions) => boolean);
        pluralFallback?:        boolean;
        pluralSeparator?:       string;
        interpolation?: {
            prefix?:        string;
            suffix?:        string;
        };
    };

    export type I18NextScannerConfig = {
        input:      string[];
        output:     string;
        options:    I18NextScannerOptions;
        transform?: (file: File, enc: string, done: () => void) => void;
        flush?:     (done: () => void) => void;
    };

    export class Parser {
        options:    I18NextScannerOptions;
        resStore:   { [key: string]: string };
        resScan:    { [key: string]: string };

        constructor(options: I18NextScannerOptions);

        log(...args: any[]): void;
        formatResourceLoadPath(lng: string, ns: string): string;
        formatResourceSavePath(lng: string, ns: string): string;

        parseFuncFromString(content: string, customHandler?: (key: string) => void): Parser;
        parseFuncFromString(content: string, opts: I18NextScannerOptions, customHandler?: (key: string) => void): Parser;

        parseTransFromString(content: string, customHandler?: (key: string) => void): Parser;
        parseTransFromString(content: string, opts: I18NextScannerOptions, customHandler?: (key: string) => void): Parser;

        parseAttrFromString(content: string, customHandler?: (key: string) => void): Parser;
        parseAttrFromString(content: string, opts: I18NextScannerOptions, customHandler?: (key: string) => void): Parser;

        get(opts?: I18NextScannerOptions): { [language: string]: { [ ns: string]: { [key: string]: string } } };
        get(key: string, opts?: I18NextScannerOptions): string;

        set(key: string, options?: I18NextScannerOptions): void;

        toJSON(options?: I18NextScannerOptions): string;
    }

    export function createStream(
        options: I18NextScannerOptions,
        customTransform?: I18NextScannerConfig['transform'],
        customFlush?: I18NextScannerConfig['flush']
    ): NodeJS.ReadWriteStream;

    export default createStream;
}
