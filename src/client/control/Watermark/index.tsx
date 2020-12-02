import React                from 'react';
import Box                  from '$client/control/Box';
import css                  from './Watermark.module.pcss';

export const Watermark: React.FC = ({children}: {children?: React.ReactNode}) => {
    return (
        <Box className={css.watermark} flexGrow={1} component="main">
            {children}
        </Box>
    );
}

export default Watermark;
