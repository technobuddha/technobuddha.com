import type { InitOptions } from 'i18next';

export default {
    fallbackLng:      false,
    whitelist:        [ 'en', 'chef' ],
    ns:               ['translation'],
    defaultNS:        'translation',
    debug:            false,
    keySeparator:     false,
    nsSeparator:      false,
    saveMissing:      true,
    interpolation: {
        escapeValue:      false,
        formatSeparator:  ','
    },
    react: {
        wait:             true
    },
    backend: {
        loadPath:     '/locales/{{lng}}/{{ns}}.json',
        addPath:      '/locales/{{lng}}/{{ns}}.json'
    }
} as InitOptions;