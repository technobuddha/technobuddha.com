import React from 'react';
import { IconContext } from 'react-icons';

type IconProviderProps = {
  readonly children: React.ReactNode;
};

export const IconProvider: React.FC<IconProviderProps> = ({ children }: IconProviderProps) => {
  const size = React.useMemo(() => ({ size: '1em' }), []);

  return <IconContext.Provider value={size}>{children}</IconContext.Provider>;
};
