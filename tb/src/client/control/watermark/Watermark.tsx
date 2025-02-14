import React                from 'react';
import Box                  from '@material-ui/core/Box';
import css                  from './Watermark.css';

export const Watermark: React.FC = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Box className={css.watermark} flexGrow={1} component="main">
            <Box className={css.logo} />
            {children}
        </Box>
    );
};

export default Watermark;
