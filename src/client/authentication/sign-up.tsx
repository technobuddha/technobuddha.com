import React from 'react';
import { useTranslation } from '#context/i18n';
import { authenticationSettings } from '#settings/authentication';
import { useNavigate } from '#context/router';
import { useAuthentication } from '#context/authentication';
import { email as emailRegExp } from '@technobuddha/library/regexp';
import { empty } from '@technobuddha/library/constants';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/lab/Alert';
import { TextField } from '#control/text-field';
import { PasswordValidation } from '#control/password-validation';
import { Checkbox } from '#control/checkbox';
import { Link } from '#control/link';
import Typography from '@mui/material/Typography';
import { MdPerson } from 'react-icons/md';
import { MdEmail } from 'react-icons/md';

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

  const handleFirstChange = (text: string) => {
    setFirst(text);
    setErrorMessage(empty);
  };
  const handleLastChange = (text: string) => {
    setLast(text);
    setErrorMessage(empty);
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setErrorMessage(empty);
  };
  const handlePasswordChange = (text: string, valid: boolean) => {
    setPassword(text);
    setValidPassword(valid);
    setErrorMessage(empty);
  };
  const handleTosAcceptedChange = (checked: boolean) => {
    setTosAccepted(checked);
    setErrorMessage(empty);
  };

  const isEnabled = () =>
    validFirst &&
    validLast &&
    validEmail &&
    validPassword &&
    (tosAccepted || authenticationSettings.tos === false);

  const handleExecute = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSignup();
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isEnabled() && event.key === 'Enter') {
      event.preventDefault();
      handleSignup();
    }
  };
  const handleSignup = () => {
    authentication
      .createAccount(first, last, email, password)
      .then(async () => {
        await authentication.login(email, password);
        navigate('/');
      })
      .catch(() => {
        setErrorMessage(`${t('Email address already in use')}.`);
      });
  };

  return (
    <Box onKeyPress={handleKeyPress}>
      <Typography variant="h1">{t('Sign Up')}</Typography>
      <TextField
        onChange={handleFirstChange}
        onValidation={setValidFirst}
        autoFocus={true}
        label={t('First Name')}
        value={first}
        startAdornment={<MdPerson />}
        name="first"
        required={true}
      />
      <TextField
        onChange={handleLastChange}
        onValidation={setValidLast}
        label={t('Last Name')}
        value={last}
        startAdornment={<MdPerson />}
        name="last"
        required={true}
      />
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

      {authenticationSettings.tos && (
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
          fullWidth={true}
        >
          {t('Create Account')}
        </Button>
      </Box>

      {errorMessage && (
        <Box marginY={1}>
          <Alert severity="error">{t(errorMessage)}</Alert>
        </Box>
      )}
    </Box>
  );
};
