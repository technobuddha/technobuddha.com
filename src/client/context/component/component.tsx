import React from 'react';

import { useTranslation } from '#context/i18n';
import { type Component, components } from '#settings/components.js';

const PagesContext = React.createContext<Component[]>(null!);

export function useComponents(): Component[] {
  return React.useContext(PagesContext);
}

type ComponentsProviderProps = {
  readonly children?: React.ReactNode;
};

export const ComponentsProvider: React.FC<ComponentsProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const control = React.useMemo<Component[]>(() => components(t), [t]);

  return <PagesContext.Provider value={control}>{children}</PagesContext.Provider>;
};
