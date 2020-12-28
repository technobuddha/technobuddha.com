import React                                                    from 'react';
import i18n, { InitOptions }                                    from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation }    from 'react-i18next';
import XHR                                                      from 'i18next-xhr-backend';
import LanguageDetector                                         from 'i18next-browser-languagedetector';
import config                                                   from '#settings/i18next.config.json';

i18n
.use(LanguageDetector)
.use(XHR)
.use(initReactI18next)
.init(config as InitOptions);

export const I18nProvider: React.FC = ({children}: {children?: React.ReactNode}) => {
    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    )
}

export { useTranslation } from 'react-i18next';
export default useTranslation;
