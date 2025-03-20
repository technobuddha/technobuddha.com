import React from 'react';
import { useTranslation } from '#context/i18n';
import { useAuthentication } from '#context/authentication';
import { useNavigate, useLocation } from '#context/router';
import { PasswordField } from '#control/password-field';
import { TextField } from '#control/text-field';
import { MdEmail } from 'react-icons/md';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/lab/Alert';
import css from './login.module.css';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const authentication = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setErrorMessage(null);
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(null);
  };
  const isEnabled = () => Boolean(username && password);
  const handleExecute = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleLogin();
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isEnabled() && event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  };
  const handleLogin = () => {
    authentication.login(username, password).then((response) => {
      if (response) {
        if (location.state?.referrer) navigate(location.state.referrer);
        else navigate('/');
      } else {
        setErrorMessage(`${t('Please enter a correct username and password')}.`);
      }
    });
  };

  return (
    <Box className={css.login} onKeyPress={handleKeyPress}>
      <Typography variant="h5">{t('Log In')}</Typography>
      <Box className={css.input}>
        <TextField
          onChange={handleUsernameChange}
          autoFocus={true}
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
        fullWidth={true}
      >
        {t('Log In')}
      </Button>

      {errorMessage && (
        <Box className={css.message}>
          <Alert severity="error">{t(errorMessage)}</Alert>
        </Box>
      )}
    </Box>
  );
};
