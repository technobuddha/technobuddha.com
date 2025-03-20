import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

import { useTranslation } from '#context/i18n';
import { useLocation } from '#context/router';
import { Link, Watermark } from '#control';
import { authenticationSettings } from '#settings/authentication';

import { ForgotPassword } from './forgot-password.tsx';
import { Login } from './login.tsx';
import { SignUp } from './sign-up.tsx';

import css from './authentication.module.css';

export const Authentication: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Watermark>
      <Box className={css.outer}>
        <Paper>
          <Box className={css.inner}>
            {pathname === '/login' && <Login />}
            {pathname === '/sign-up' && authenticationSettings.signUp === true && <SignUp />}
            {pathname === '/forgot-password' && authenticationSettings.forgotPassword === true && (
              <ForgotPassword />
            )}
            <Box className={css.jump}>
              {(pathname === '/login' || pathname === '/forgot-password') &&
                authenticationSettings.signUp === true && (
                  <Box>
                    <Typography variant="caption">
                      {t("Don't have an account?")}{' '}
                      <Link to="/sign-up" replace>
                        {t('Sign Up')}
                      </Link>
                    </Typography>
                  </Box>
                )}
              {(pathname === '/sign-up' || pathname === '/forgot-password') && (
                <Box>
                  <Typography variant="caption">
                    {t('Already have an account?')}{' '}
                    <Link to="/login" replace>
                      {t('Log In')}
                    </Link>
                  </Typography>
                </Box>
              )}
              {(pathname === '/login' || pathname === '/sign-up') &&
                authenticationSettings.forgotPassword === true && (
                  <Box>
                    <Typography variant="caption">
                      {t('Forgot your password?')}{' '}
                      <Link to="/forgot-password" replace>
                        {t('Reset your password')}
                      </Link>
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Watermark>
  );
};
