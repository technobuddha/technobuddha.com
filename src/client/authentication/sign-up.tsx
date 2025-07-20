import React from 'react';
import { Box } from '@mui/material';
import { email as emailRegExp, empty } from '@technobuddha/library';
import { MdEmail, MdPerson } from 'react-icons/md';

import { useAuthentication } from '#context/authentication';
import { useTranslation } from '#context/i18n';
import { useNavigate } from '#context/router';
import { Alert, Button, Checkbox, Link, PasswordValidation, TextField, Typography } from '#control';
import { authenticationSettings } from '#settings/authentication';

export const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const authentication = useAuthentication();
  const navigate = useNavigate();
  const [first, setFirst] = React.useState<string>(empty);
  const [last, setLast] = React.useState<string>(empty);
  const [email, setEmail] = React.useState<string>(empty);
  const [password, setPassword] = React.useState<string>(empty);
  const [validFirst, setValidFirst] = React.useState<boolean>(false);
  const [validLast, setValidLast] = React.useState<boolean>(false);
  const [validEmail, setValidEmail] = React.useState<boolean>(false);
  const [validPassword, setValidPassword] = React.useState<boolean>(false);
  const [tosAccepted, setTosAccepted] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>(empty);

  const handleFirstChange = React.useCallback((text: string): void => {
    setFirst(text);
    setErrorMessage(empty);
  }, []);

  const handleFirstValidate = React.useCallback((valid: boolean): void => {
    setValidFirst(valid);
  }, []);

  const handleLastChange = React.useCallback((text: string): void => {
    setLast(text);
    setErrorMessage(empty);
  }, []);

  const handleLastValidate = React.useCallback((valid: boolean): void => {
    setValidLast(valid);
  }, []);

  const handleEmailChange = React.useCallback((text: string): void => {
    setEmail(text);
    setErrorMessage(empty);
  }, []);

  const handleEmailValidate = React.useCallback((valid: boolean): void => {
    setValidEmail(valid);
  }, []);

  const handlePasswordChange = React.useCallback((text: string, valid: boolean): void => {
    setPassword(text);
    setValidPassword(valid);
    setErrorMessage(empty);
  }, []);

  const handleTosAcceptedChange = React.useCallback((checked: boolean): void => {
    setTosAccepted(checked);
    setErrorMessage(empty);
  }, []);

  const isEnabled = React.useCallback(
    (): boolean =>
      validFirst &&
      validLast &&
      validEmail &&
      validPassword &&
      (tosAccepted || authenticationSettings.tos === false),
    [tosAccepted, validFirst, validLast, validEmail, validPassword],
  );

  const handleSignup = React.useCallback((): void => {
    authentication
      .createAccount(first, last, email, password)
      .then(async () => {
        await authentication.login(email, password);
        void navigate('/');
      })
      .catch(() => {
        setErrorMessage(`${t('Email address already in use')}.`);
      });
  }, [authentication, email, first, last, password, navigate, t]);

  const handleExecute = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      handleSignup();
    },
    [handleSignup],
  );

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>): void => {
      if (isEnabled() && event.key === 'Enter') {
        event.preventDefault();
        handleSignup();
      }
    },
    [handleSignup, isEnabled],
  );

  return (
    <Box onKeyUp={handleKeyPress}>
      <Typography variant="h1">{t('Sign Up')}</Typography>
      <TextField
        onChange={handleFirstChange}
        onValidation={handleFirstValidate}
        autoFocus
        label={t('First Name')}
        value={first}
        startAdornment={<MdPerson />}
        name="first"
        required
      />
      <TextField
        onChange={handleLastChange}
        onValidation={handleLastValidate}
        label={t('Last Name')}
        value={last}
        startAdornment={<MdPerson />}
        name="last"
        required
      />
      <TextField
        onChange={handleEmailChange}
        onValidation={handleEmailValidate}
        label={t('Email address')}
        value={email}
        startAdornment={<MdEmail />}
        name="username"
        validation={emailRegExp}
        required
      />
      <PasswordValidation
        userInputs={[first, last, email]}
        onChange={handlePasswordChange}
        minLength={authenticationSettings.password.minLength}
        maxLength={authenticationSettings.password.maxLength}
        strength={authenticationSettings.password.strength}
        uppercase={authenticationSettings.password.uppercase}
        lowercase={authenticationSettings.password.lowercase}
        digit={authenticationSettings.password.digit}
        special={authenticationSettings.password.special}
        categories={authenticationSettings.password.categories}
      />

      {authenticationSettings.tos !== false && (
        <Checkbox
          label={
            <Typography variant="caption">
              {t("I've read and accepted the")}{' '}
              <Link to={authenticationSettings.tos}>{t('Terms of Service')}</Link>
            </Typography>
          }
          checked={tosAccepted}
          onChange={handleTosAcceptedChange}
        />
      )}

      <Box marginTop={1}>
        <Button
          onClick={handleExecute}
          variant="contained"
          type="submit"
          color="primary"
          disabled={!isEnabled()}
          fullWidth
        >
          {t('Create Account')}
        </Button>
      </Box>

      {Boolean(errorMessage) && (
        <Box marginY={1}>
          <Alert severity="error">{t(errorMessage)}</Alert>
        </Box>
      )}
    </Box>
  );
};
