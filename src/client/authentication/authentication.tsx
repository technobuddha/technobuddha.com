import React from 'react';
import { Login } from './login.jsx';
import { ForgotPassword } from './forgot-password';
import { SignUp } from './sign-up';
import { authenticationSettings } from '#settings/authentication';
import { useTranslation } from '#context/i18n';
import { Routes, Route } from '#context/router';
import { Link } from '#control/link';
import { Watermark } from '#control/watermark';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import css from './authentication.module.css';

export const Authentication: React.FC = () => {
  const { t } = useTranslation();

  const Box1 = () => (
    <Box>
      <Typography variant="caption">
        {t("Don't have an account?")}{' '}
        <Link to="/sign-up" replace={true}>
          {t('Sign Up')}
        </Link>
      </Typography>
    </Box>
  );

  const Box2 = () => (
    <Box>
      <Typography variant="caption">
        {t('Already have an account?')}{' '}
        <Link to="/login" replace={true}>
          {t('Log In')}
        </Link>
      </Typography>
    </Box>
  );

  return (
    <Watermark>
      <Box className={css.outer}>
        <Paper>
          <Box className={css.inner}>
            <Routes>
              <Route path="/login" Component={Login} />
              {authenticationSettings.signUp && <Route path="/sign-up" Component={SignUp} />}
              {authenticationSettings.forgotPassword && (
                <Route path="/forgot-password" Component={ForgotPassword} />
              )}
            </Routes>
            <Box className={css.jump}>
              <Routes>
                {authenticationSettings.signUp && (
                  <>
                    <Route path="/login">
                      <Box1 />
                    </Route>
                    <Route path="/forgot-password">
                      <Box1 />
                    </Route>
                  </>
                )}
                <>
                  <Route path="/sign-up">
                    <Box2 />
                  </Route>
                  <Route path="/forgot-password">
                    <Box2 />
                  </Route>
                </>
              </Routes>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Watermark>
  );
};
