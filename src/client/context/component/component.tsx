import React            from 'react';
import { useTranslation } from '#context/i18n';
import components       from '#settings/components';

import type { Component } from '#settings/components';

export type { Component } from '#settings/components';

const PagesContext = React.createContext<Component[]>(null!);

export function useComponents() {
    return React.useContext(PagesContext);
}

type ComponentsProviderProps = {
    children?: React.ReactNode;
};

export const ComponentsProvider: React.FC = ({ children }: ComponentsProviderProps = {}) => {
    const { t, i18n } = useTranslation();
    const control     = React.useMemo<Component[]>(
        () => components(t),
        [ i18n.language ]
    );

    return (
        <PagesContext.Provider value={control}>
            {children}
        </PagesContext.Provider>
    );
};

export default useComponents;
