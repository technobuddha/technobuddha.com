type ExternalPackage = {
    development:    string;
    production:     string;
    localPath?:     string;
    global?:        string;
    alias?:         string;
};

export const externalPackages: Record<string, ExternalPackage> = {
    'es5-shim': {
        development:    'es5-shim.js',
        production:     'es5-shim.min.js',
    },
    'es6-shim': {
        development:    'es6-shim.js',
        production:     'es6-shim.min.js',
    },
    'es7-shim': {
        development:    'es7-shim.js',
        production:     'es7-shim.min.js',
        localPath:      'dist',
    },
};

export default externalPackages;
