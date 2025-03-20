import React from 'react';
import { email as emailRegExp } from '@technobuddha/library/regexp';
import { empty } from '@technobuddha/library/constants';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '#control/text-field';
import { MdEmail } from 'react-icons/md';
import { useTranslation } from '#context/i18n';

export type LoginMode = 'login' | 'forgotPassword' | 'signUp';
export type LoginState = { mode: LoginMode };

export const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState(empty);
  const [validEmail, setValidEmail] = React.useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };
  const isEnabled = () => validEmail;

  const handleExecute = /*async*/ (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    //if(!await authentication.login(username!, password!))
    //    setErrorMessage(`${t('Please enter a correct username and password')}.`)
  };

  return (
    <>
      <Typography variant="h5">{t('Reset Your Password')}</Typography>

      <TextField
        onChange={handleEmailChange}
        onValidation={setValidEmail}
        label={t('Email address')}
        value={email}
        startAdornment={<MdEmail />}
        name="username"
        validation={emailRegExp}
        required={true}
      />

      <Button
        onClick={handleExecute}
        variant="contained"
        type="submit"
        color="primary"
        disabled={!isEnabled()}
        fullWidth={true}
      >
        {t('Reset Password')}
      </Button>
    </>
  );
};
