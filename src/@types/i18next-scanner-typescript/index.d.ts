declare module 'i18next-scanner-typescript'
{
    import File from 'vinyl';

    function typescriptTransform(options: { tsOptions?: { target: string }, extensions: string[] }): (file: File, enc: string, done: () => void) => void;

    export = typescriptTransform;
}