import { type InitOptions } from 'i18next';

const isDevelopment = import.meta?.env?.DEV ?? true;

export const i18nextInit = {
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
