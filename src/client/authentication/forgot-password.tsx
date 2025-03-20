import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { email as emailRegExp, empty } from '@technobuddha/library';
import { MdEmail } from 'react-icons/md';

import { useTranslation } from '#context/i18n';
import { TextField } from '#control';

export type LoginMode = 'login' | 'forgotPassword' | 'signUp';
export type LoginState = { mode: LoginMode };

export const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState(empty);
  const [validEmail, setValidEmail] = React.useState(false);

  const handleEmailChange = React.useCallback((text: string): void => {
    setEmail(text);
  }, []);

  const handleValidation = React.useCallback((valid: boolean): void => {
    setValidEmail(valid);
  }, []);

  const isEnabled = (): boolean => validEmail;

  const handleExecute = React.useCallback((e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    //if(!await authentication.login(username!, password!))
    //    setErrorMessage(`${t('Please enter a correct username and password')}.`)
  }, []);

  return (
    <>
      <Typography variant="h5">{t('Reset Your Password')}</Typography>

      <TextField
        onChange={handleEmailChange}
        onValidation={handleValidation}
        label={t('Email address')}
        value={email}
        startAdornment={<MdEmail />}
        name="username"
        validation={emailRegExp}
        required
      />

      <Button
        onClick={handleExecute}
        variant="contained"
        type="submit"
        color="primary"
        disabled={!isEnabled()}
        fullWidth
      >
        {t('Reset Password')}
      </Button>
    </>
  );
};
