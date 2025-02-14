import React             from 'react';
import Login             from './Login';
import ForgotPassword    from './ForgotPassword';
import SignUp            from './SignUp';
import settings          from '#settings/authentication';
import useTranslation    from '#context/i18n';
import { Switch, Route } from '#context/router';
import Link              from '#control/link';
import Watermark         from '#control/watermark';
import Box               from '@material-ui/core/Box';
import Paper             from '@material-ui/core/Paper';
import Typography        from '@material-ui/core/Typography';
import css               from './Authentication.css';

export const Authentication: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Watermark>
            <Box className={css.outer}>
                <Paper>
                    <Box className={css.inner}>
                        <Switch>
                            <Route path="/login" component={Login} />
                            {
                                settings.signUp &&
                                <Route path="/sign-up" component={SignUp} />
                            }
                            {
                                settings.forgotPassword &&
                                <Route path="/forgot-password" component={ForgotPassword} />
                            }
                        </Switch>
                        <Box className={css.jump}>
                            <Switch>
                                {
                                    settings.signUp &&
                                    <Route path={[ '/login', '/forgot-password' ]}>
                                        <Box>
                                            <Typography variant="caption">
                                                {t("Don't have an account?")} <Link to="/sign-up" replace={true}>{t('Sign Up')}</Link>
                                            </Typography>
                                        </Box>
                                    </Route>
                                }
                                <Route path={[ '/sign-up', '/forgot-password' ]}>
                                    <Box>
                                        <Typography variant="caption">
                                            {t('Already have an account?')} <Link to="/login" replace={true}>{t('Log In')}</Link>
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
