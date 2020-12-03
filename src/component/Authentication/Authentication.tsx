import React             from 'react';
import Login             from './Login';
import ForgotPassword    from './ForgotPassword';
import SignUp            from './SignUp';
import settings          from '$settings';
import useTranslation    from '#context/i18n';
import {makeStyles}      from '#context/mui';
import { Switch, Route } from '#context/router';
import Link              from '#control/Link';
import Watermark         from '#control/Watermark';
import Box               from '@material-ui/core/Box';
import Paper             from '@material-ui/core/Paper';
import Typography        from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    main: {

    },
    outer: {
        margin: `${theme.spacing(12)}px auto 0 auto`,
        maxWidth: '480px',
    },
    inner: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(4),
    },
    jump: {
        marginTop: theme.spacing(2),
    }
}))

export const Authentication: React.FC = () => {
    const css   = useStyles();
    const { t } = useTranslation();

    return (
        <Watermark>
            <Box className={css.outer}>
                <Paper>
                    <Box className={css.inner}>
                        <Switch>
                            <Route path='/login'            component={Login} />
                            {
                                settings.authentication.signUp &&
                                <Route path='/sign-up' component={SignUp} />
                            }
                            {
                                settings.authentication.forgotPassword &&
                                <Route path='/forgot-password' component={ForgotPassword} />
                            }
                        </Switch>
                        <Box className={css.jump}>
                            <Switch>
                                {
                                    settings.authentication.signUp &&
                                    <Route path={['/login', '/forgot-password']} >
                                        <Box>
                                            <Typography variant="caption">
                                                {t("Don't have an account?")} <Link to="/sign-up" replace>{t('Sign up')}</Link>
                                            </Typography>
                                        </Box>
                                    </Route>
                                }
                                <Route path={['/sign-up', '/forgot-password']}>
                                    <Box>
                                        <Typography variant="caption">
                                        {t("Already have an account?")} <Link to="/login" replace>{t('Login')}</Link>
                                        </Typography>
                                    </Box>                            
                                </Route>
                            </Switch>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Watermark>
    );
};

export default Authentication;
