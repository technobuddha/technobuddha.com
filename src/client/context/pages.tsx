import React                        from 'react';
import {useTranslation}             from '#context/i18n';
import pages                        from '#settings/pages';
import type { Page }                from '#settings/pages';

export type { Page } from '#settings/pages';

const PagesContext = React.createContext<Page[]>(null!);

export function usePages() {
   return React.useContext(PagesContext);
}

type PagesProviderProps = {
    children?: React.ReactNode;
}

export const PagesProvider: React.FC = ({children}: PagesProviderProps = {}) => {
    const { t, i18n } = useTranslation();
    const control     = React.useMemo<Page[]>(() => 
        pages(t),
        [i18n.language]
    );

    return (
        <PagesContext.Provider value={control}>
            {children}
        </PagesContext.Provider>
    )
}

export default usePages;
