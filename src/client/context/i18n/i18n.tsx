import React                                                    from 'react';
import i18next                                                  from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation}     from 'react-i18next';
import HttpApi                                                  from 'i18next-http-backend';
import LanguageDetector                                         from 'i18next-browser-languagedetector';
import config                                                   from '#settings/i18next';

i18next
.use(LanguageDetector)
.use(HttpApi)
.use(initReactI18next)
.init(config);

type I18nProviderProps = {
    children?: React.ReactNode;
};

export const I18nProvider: React.FC = ({ children }: I18nProviderProps) => {
    return (
        <I18nextProvider i18n={i18next}>
            {children}
        </I18nextProvider>
    );
};

export const t = i18next.t;

export { useTranslation } from 'react-i18next';
export type { TFunction } from 'react-i18next';
export default useTranslation;
