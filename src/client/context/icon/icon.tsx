import React from 'react';
import { IconContext } from 'react-icons';

type IconProviderProps = {
  children: React.ReactNode;
};

export const IconProvider: React.FC<IconProviderProps> = ({ children }: IconProviderProps) => {
  return <IconContext.Provider value={{ size: '1.5rem' }}>{children}</IconContext.Provider>;
};

export default IconProvider;
