import React from 'react';
import { MdEmail } from 'react-icons/md';

import { useAuthentication } from '#context/authentication';
import { useTranslation } from '#context/i18n';
import { useLocation, useNavigate } from '#context/router';
import { Alert, Box, Button, PasswordField, TextField, Typography } from '#control';

import css from './login.module.css';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const authentication = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleUsernameChange = React.useCallback((text: string): void => {
    setUsername(text);
    setErrorMessage(null);
  }, []);

  const handlePasswordChange = React.useCallback((text: string): void => {
    setPassword(text);
    setErrorMessage(null);
  }, []);

  const isEnabled = React.useCallback(
    (): boolean => Boolean(username && password),
    [username, password],
  );

  const handleLogin = React.useCallback((): void => {
    void authentication.login(username, password).then((response) => {
      if (response) {
        if (location.state?.referrer) {
          void navigate(location.state.referrer);
        } else {
          void navigate('/');
        }
      } else {
        setErrorMessage(`${t('Please enter a correct username and password')}.`);
      }
    });
  }, [authentication, location.state?.referrer, navigate, password, t, username]);

  const handleExecute = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      handleLogin();
    },
    [handleLogin],
  );

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>): void => {
      if (isEnabled() && event.key === 'Enter') {
        event.preventDefault();
        handleLogin();
      }
    },
    [handleLogin, isEnabled],
  );

  return (
    <Box className={css.login} onKeyUp={handleKeyPress}>
      <Typography variant="h5">{t('Log In')}</Typography>
      <Box className={css.input}>
        <TextField
          onChange={handleUsernameChange}
          autoFocus
          label={t('Email address')}
          value={username}
          name="username"
          startAdornment={<MdEmail />}
        />
      </Box>
      <Box className={css.input}>
        <PasswordField
          label={t('Password')}
          helperText={`${t('Password is case-sensitive')}.`}
          onChange={handlePasswordChange}
        />
      </Box>
      <Button
        onClick={handleExecute}
        variant="contained"
        type="submit"
        disabled={!isEnabled()}
        fullWidth
      >
        {t('Log In')}
      </Button>

      {errorMessage != null && (
        <Box className={css.message}>
          <Alert severity="error">{t(errorMessage)}</Alert>
        </Box>
      )}
    </Box>
  );
};
