import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslation } from '#context/i18n';
import { Route, Routes } from '#context/router';
import { Link } from '#control/link';
import { Watermark } from '#control/watermark';
import { authenticationSettings } from '#settings/authentication';

import { ForgotPassword } from './forgot-password.jsx';
import { Login } from './login.jsx';
import { SignUp } from './sign-up.jsx';

import css from './authentication.module.css';

export const Authentication: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Watermark>
      <Box className={css.outer}>
        <Paper>
          <Box className={css.inner}>
            <Routes>
              <Route path="/login" Component={Login} />
              {Boolean(authenticationSettings.signUp) && (
                <Route path="/sign-up" Component={SignUp} />
              )}
              {Boolean(authenticationSettings.forgotPassword) && (
                <Route path="/forgot-password" Component={ForgotPassword} />
              )}
            </Routes>
            <Box className={css.jump}>
              <Routes>
                {Boolean(authenticationSettings.signUp) &&
                  ['/login', '/forgot-password'].map((path) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <Box>
                          <Typography variant="caption">
                            {t("Don't have an account?")}{' '}
                            <Link to="/sign-up" replace>
                              {t('Sign Up')}
                            </Link>
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                {['/login', '/forgot-password'].map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <Box>
                        <Typography variant="caption">
                          {t('Already have an account?')}{' '}
                          <Link to="/login" replace>
                            {t('Log In')}
                          </Link>
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </Routes>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Watermark>
  );
};
