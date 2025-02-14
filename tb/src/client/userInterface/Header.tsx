import React                    from 'react';
import settings                 from '#settings/authentication';
import useAuthentication        from '#context/authentication';
import { useHistory }           from '#context/router';
import { useTranslation }       from '#context/i18n';
import AppBar                   from '@material-ui/core/AppBar';
import Box                      from '@material-ui/core/Box';
import Typography               from '@material-ui/core/Typography';
import IconButton               from '@material-ui/core/IconButton';
import AccountCircle            from '@material-ui/icons/AccountCircle';
import css                      from './Header.css';

type HeaderProps = { children?: never };

export const Header: React.FC<HeaderProps> = () => {
    const history     = useHistory();
    const { account } = useAuthentication();
    const { t }       = useTranslation();

    const handleUserClick = () => history.push('/login');

    return (
        <AppBar className={css.header} position="static" elevation={1} component="header">
            <Box className={css.display}>
                <Typography variant="h1" className={css.site}>
                    {t('Technobuddha')}
                </Typography>
            </Box>
            {
                settings.login &&
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
            }
        </AppBar>
    );
};

export default Header;
