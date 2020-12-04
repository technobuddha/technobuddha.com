import React                    from 'react';
import useAuthentication        from '#context/authentication';
import { makeStyles }           from '#context/mui';
import { useHistory }           from '#context/router';
//import { useTranslation }       from '#context/i18n';
import AppBar                   from '@material-ui/core/AppBar';
import Box                      from '@material-ui/core/Box';
import Typography               from '@material-ui/core/Typography';
import IconButton               from '@material-ui/core/IconButton';
import AccountCircle            from '@material-ui/icons/AccountCircle';

const useHeaderStyles = makeStyles(theme => ({
    authorization: {
        color: theme.palette.common.white,
    }
}));

type HeaderProps = { children?: never };

export const Header: React.FC<HeaderProps> = () => {
    const css         = useHeaderStyles();
    const history     = useHistory();
    //const { t }       = useTranslation();  
    const { account } = useAuthentication();

    const handleUserClick = () => history.push('/login');

    return (
        <AppBar position="static" elevation={1} component="header">
            <Box display="flex" flexDirection="row" height={40} width="100%">
                <Box height="100%" width="50%">
                    <Typography variant="h4">
                        Technobuddha
                    </Typography>                   
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" height="100%" width="50%">
                    <Box>
                    {
                        account &&
                        <Typography>
                            {account.first} {account.last}
                        </Typography>
                    }
                    </Box>
                    <IconButton onClick={handleUserClick}>
                        <AccountCircle className={css.authorization} />
                    </IconButton> 
                </Box>                
            </Box>
        </AppBar>
    );
}

export default Header;