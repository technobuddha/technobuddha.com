import React                    from 'react';
//import useAuthentication        from '$client/context/authentication';
import AppBar                   from '$client/control/AppBar';
import Box                      from '$client/control/Box';

export const Header: React.FC = () => {
    //const { account }                   = useAuthentication();

    return (
        <AppBar position="static" elevation={1} component="header">
            <Box display="flex" flexDirection="row" height={40} width="100%">
                {/* {
                    account &&
                    <div>{account.first} {account.last}</div>
                } */}
            </Box>
        </AppBar>
    );
}

export default Header;