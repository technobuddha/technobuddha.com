import React        from 'react';
import AppBar       from '@material-ui/core/AppBar';
import Box          from '@material-ui/core/Box';
import Typography   from '@material-ui/core/Typography';
import packageJson  from '~package.json';
import css          from './Footer.css';

export const Footer: React.FC = () => {
    return (
        <AppBar position="static" elevation={0} component="footer">
            <Box className={css.footer}>
                <Box className={css.display}>
                    <Typography variant="body2">
                        version {packageJson.version}
                    </Typography>
                </Box>
            </Box>
        </AppBar>
    );
};

export default Footer;
