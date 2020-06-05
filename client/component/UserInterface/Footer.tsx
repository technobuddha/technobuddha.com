import React                                        from 'react';
import AppBar                                       from '$client/control/AppBar';

export const Footer: React.FC = () => {

    return (
        <AppBar position="static" elevation={0} component="footer">
        </AppBar>
    );
}

export default Footer;
