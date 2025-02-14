type ExternalPackage = {
    development:    string;
    production:     string;
    localPath?:     string;
    global?:        string;
    alias?:         string;
};

export const externalPackages: Record<string, ExternalPackage> = {
    // 'es5-shim': {
    //     development:    'es5-shim.js',
    //     production:     'es5-shim.min.js',
    // },
    // 'es6-shim': {
    //     development:    'es6-shim.js',
    //     production:     'es6-shim.min.js',
    // },
    // 'es7-shim': {
    //     development:    'es7-shim.js',
    //     production:     'es7-shim.min.js',
    //     localPath:      'dist',
    // },
    // 'lodash':
    // {
    //     'development':  'lodash.js',
    //     'production':   'lodash.min.js',
    //     'global':
    //     {
    //         'commonjs':     'lodash',
    //         'amd':          'lodash',
    //         'root':         '_'
    //     }
    // },
    // 'history':
    // {
    //     development:    'history.js',
    //     production:     'history.min.js',
    //     localPath:      'umd',
    //     global:         'History',
    // },
    // 'i18next':
    // {
    //     development:    'i18next.js',
    //     production:     'i18next.min.js',
    //     global:         'i18next',
    // },
    // 'i18next-browser-languagedetector':
    // {
    //     development:    'i18nextBrowserLanguageDetector.js',
    //     production:     'i18nextBrowserLanguageDetector.min.js',
    //     global:         'i18nextBrowserLanguageDetector',
    // },
    // 'react':
    // {
    //     development:    'umd/react.development.js',
    //     production:     'umd/react.production.min.js',
    //     global:         'React',
    // },
    // 'react-dom':
    // {
    //     development:    'umd/react-dom.development.js',
    //     production:     'umd/react-dom.production.min.js',
    //     global:         'ReactDOM',
    // },
    // 'redux':
    // {
    //     development:    'redux.js',
    //     production:     'redux.min.js',
    //     localPath:      'dist',
    //     global:         'Redux',
    // },
    // 'redux-thunk':
    // {
    //     development:    'redux-thunk.js',
    //     production:     'redux-thunk.min.js',
    //     localPath:      'dist',
    //     global:         'ReduxThunk',
    // },
    // 'react-redux':
    // {
    //     development:    'react-redux.js',
    //     production:     'react-redux.min.js',
    //     localPath:      'dist',
    //     global:         'ReactRedux',
    // },
    // 'react-router':
    // {
    //     development:    'react-router.js',
    //     production:     'react-router.min.js',
    //     localPath:      'umd',
    //     global:         'ReactRouter',
    // },
};

export default externalPackages;
