import React from 'react';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import config from '#settings/i18next.js';

void i18next.use(LanguageDetector).use(HttpApi).use(initReactI18next).init(config);

type I18nProviderProps = {
  readonly children?: React.ReactNode;
};

export const I18nProvider: React.FC = ({ children }: I18nProviderProps) => (
  <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
);

export const { t } = i18next;

export type { TFunction } from 'i18next';
export { useTranslation } from 'react-i18next';
