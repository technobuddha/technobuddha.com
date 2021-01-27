import React                    from 'react';
import useAuthentication        from '#context/authentication';
import { makeStyles }           from '#context/mui';
import { useHistory }           from '#context/router';
import { useTranslation }       from '#context/i18n';
import AppBar                   from '@material-ui/core/AppBar';
import Box                      from '@material-ui/core/Box';
import Typography               from '@material-ui/core/Typography';
import IconButton               from '@material-ui/core/IconButton';
import AccountCircle            from '@material-ui/icons/AccountCircle';
import packageJson              from '~package.json';

const useHeaderStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        height: '40px',
        width: '100%',
    },
    display: {
        display: 'flex',
        alignItems: 'flex-end',
        height: '100%',
        width: '50%',
    },
    site: {

    },
    version: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(0.25),
    },
    controls: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        width: '50%',
    },
    login: {

    },
    authorization: {
        color: theme.palette.common.white,
    },
}));

type HeaderProps = { children?: never };

export const Header: React.FC<HeaderProps> = () => {
    const css         = useHeaderStyles();
    const history     = useHistory();
    const { account } = useAuthentication();
    const { t }       = useTranslation();

    const handleUserClick = () => history.push('/login');

    return (
        <AppBar position="static" elevation={1} component="header">
            <Box className={css.root}>
                <Box className={css.display}>
                    <Typography variant="h5" className={css.site}>
                        Technobuddha
                    </Typography>
                    <Typography variant="body2" className={css.version}>
                        {t('Version')} {packageJson.version}
                    </Typography>
                </Box>
                <Box className={css.controls}>
                    <Box className={css.login}>
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
};

export default Header;
