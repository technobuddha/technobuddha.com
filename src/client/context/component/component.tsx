import React from 'react';
import { useTranslation } from '#context/i18n';
import { components, type Component } from '#settings/components.js';

const PagesContext = React.createContext<Component[]>(null!);

export function useComponents(): Component[] {
  return React.useContext(PagesContext);
}

type ComponentsProviderProps = {
  children?: React.ReactNode;
};

export const ComponentsProvider: React.FC<ComponentsProviderProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const control = React.useMemo<Component[]>(() => components(t), [i18n.language]);

  return <PagesContext.Provider value={control}>{children}</PagesContext.Provider>;
};
