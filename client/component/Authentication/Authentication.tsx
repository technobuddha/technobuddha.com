import React                    from 'react';
import useTranslation           from '$client/context/i18n';

import Login                    from './Login';
import ForgotPassword           from './ForgotPassword';
import SignUp                   from './SignUp';
import settings                 from '$settings';
import { Switch, Route }        from '$client/context/router';
import Typography               from '$client/control/Typography';
import Link                     from '$client/control/Link';
import Paper                    from '$client/control/Paper';
import Box                      from '$client/control/Box';
import Watermark                from '$client/control/Watermark';

export const Authentication: React.FC = () => {
    const { t }                     = useTranslation();

    return (
        <Watermark>
        <Box marginX="auto" marginTop={4} maxWidth="480px">
            <Paper>
                <Box display="flex" flexDirection="column" padding={4}>
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
                    <Box marginTop={2}>
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
