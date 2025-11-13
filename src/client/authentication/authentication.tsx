import React from 'react';

import { useTranslation } from '#context/i18n';
import { useLocation } from '#context/router';
import { Box, Link, Paper, Typography, Watermark } from '#control';
import { authenticationSettings } from '#settings/authentication';

import { ForgotPassword } from './forgot-password.tsx';
import { Login } from './login.tsx';
import { SignUp } from './sign-up.tsx';

import css from './authentication.module.css' with { type: 'css' };

export const Authentication: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Watermark>
      <Box className={css.outer}>
        <Paper>
          <Box className={css.inner}>
            {pathname === '/login' && <Login />}
            {pathname === '/sign-up' && authenticationSettings.signUp ?
              <SignUp />
            : null}
            {pathname === '/forgot-password' && authenticationSettings.forgotPassword ?
              <ForgotPassword />
            : null}
            <Box className={css.jump}>
              {(
                (pathname === '/login' || pathname === '/forgot-password') &&
                authenticationSettings.signUp
              ) ?
                <Box>
                  <Typography variant="caption">
                    {t("Don't have an account?")}{' '}
                    <Link to="/sign-up" replace>
                      {t('Sign Up')}
                    </Link>
                  </Typography>
                </Box>
              : null}
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
              {(
                (pathname === '/login' || pathname === '/sign-up') &&
                authenticationSettings.forgotPassword
              ) ?
                <Box>
                  <Typography variant="caption">
                    {t('Forgot your password?')}{' '}
                    <Link to="/forgot-password" replace>
                      {t('Reset your password')}
                    </Link>
                  </Typography>
                </Box>
              : null}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Watermark>
  );
};
