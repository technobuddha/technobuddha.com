import process              from 'process';
import type { InitOptions } from 'i18next';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default {
    fallbackLng:      false,
    whitelist:        [ 'en', 'chef' ],
    ns:               ['translation'],
    defaultNS:        'translation',
    debug:            false,
    keySeparator:     false,
    nsSeparator:      false,
    saveMissing:      isDevelopment,
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