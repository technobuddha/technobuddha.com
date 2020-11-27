export type Configuration = {
    isBrowser:        boolean;
};

export const config: Configuration = {
    isBrowser:      typeof window !== 'undefined' && typeof window.document !== 'undefined',
};

export default config;
