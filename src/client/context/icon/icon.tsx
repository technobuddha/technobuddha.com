import React           from 'react';
import { IconContext } from '%icons';

type IconProviderProps = {
    children: React.ReactNode;
}

export const IconProvider: React.FC<IconProviderProps> = ({children}: IconProviderProps) => {
    return (
        <IconContext.Provider value={{ size: '1.5em', color: 'white' }}>
            {children}
        </IconContext.Provider>
    );
}

export default IconProvider;
