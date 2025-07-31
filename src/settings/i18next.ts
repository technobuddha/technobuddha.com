import { type InitOptions } from 'i18next';

const isDevelopment = true;
// import.meta.env.NODE_ENV !== 'production';
// TODO

export default {
  fallbackLng: false,
  supportedLngs: ['en', 'chef'],
  nonExplicitSupportedLngs: false,
  ns: ['translation'],
  defaultNS: 'translation',
  debug: false,
  keySeparator: false,
  nsSeparator: false,
  pluralSeparator: '_',
  contextSeparator: '_',
  saveMissing: isDevelopment,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  react: {
    useSuspense: true,
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/{{lng}}/{{ns}}.json',
  },
} as InitOptions;
