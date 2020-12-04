var typescriptTransform = require('i18next-scanner-typescript');

module.exports = {
    input: [
        'src/**/*.{ts,tsx}',
        // Use ! to filter out files or directories
        '!app/**/*.spec.{ts,tsx}',
        '!app/i18n/**',
        '!**/node_modules/**',
    ],
    output: './',
    options: {
        debug: true,
        removeUnusedKeys: false,
        sort: false,
        attr: {
            list: ['data-i18n'],
            extensions: ['.html', '.htm']
        },
        func: {
            list: ['i18next.t', 'i18n.t', 't'],
            extensions: ['.js', '.jsx']
        },
        trans: {
            component: 'Trans',
            i18nKey: 'i18nKey',
            defaultsKey: 'defaults',
            extensions: ['.js', '.jsx'],
            fallbackKey: false
        },
        lngs: ['en'],
        ns: ['translation'],
        defaultLng: 'en',
        defaultNs: 'translation',
        defaultValue: '',
        resource: {
            loadPath: 'i18n/{{lng}}/{{ns}}.json',
            savePath: 'i18n/{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeparator: ':',
        keySeparator: '~',
        pluralSeparator: '_',
        contextSeparator: '_',
        contextDefaultValues: [],
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        },
    },
    transform: typescriptTransform({ extensions: [".ts", ".tsx"] })
}
