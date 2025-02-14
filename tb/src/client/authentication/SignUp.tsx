import React                        from 'react';
import { useTranslation }           from '#context/i18n';
import settings                     from '#settings/authentication';
import useHistory                   from '#context/router';
import { useAuthentication }        from '#context/authentication';
import { email as emailRegExp }     from '@technobuddha/library/regexp';
import { empty  }                   from '@technobuddha/library/constants';
import Button                       from '@material-ui/core/Button';
import Box                          from '@material-ui/core/Box';
import Alert                        from '@material-ui/lab/Alert';
import TextField                    from '#control/textField';
import PasswordValidation           from '#control/password-validation';
import Checkbox                     from '#control/checkbox';
import Link                         from '#control/link';
import Typography                   from '@material-ui/core/Typography';
import { MdPerson }                 from '%icons/md/MdPerson';
import { MdEmail }                  from '%icons/md/MdEmail';

export const SignUp: React.FC = () => {
    const { t }                                                           = useTranslation();
    const authentication                                                  = useAuthentication();
    const history                                                         = useHistory();
    const [ first,                       setFirst ]                       = React.useState<string>(empty);
    const [ last,                        setLast ]                        = React.useState<string>(empty);
    const [ email,                       setEmail ]                       = React.useState<string>(empty);
    const [ password,                    setPassword ]                    = React.useState<string>(empty);
    const [ validFirst,                  setValidFirst ]                  = React.useState<boolean>(false);
    const [ validLast,                   setValidLast ]                   = React.useState<boolean>(false);
    const [ validEmail,                  setValidEmail ]                  = React.useState<boolean>(false);
    const [ validPassword,               setValidPassword ]               = React.useState<boolean>(false);
    const [ tosAccepted,                 setTosAccepted ]                 = React.useState<boolean>(false);
    const [ errorMessage,                setErrorMessage ]                = React.useState<string>(empty);

    const handleFirstChange         = (text: string)                 => { setFirst(text);                             setErrorMessage(empty); };
    const handleLastChange          = (text: string)                 => { setLast(text);                              setErrorMessage(empty); };
    const handleEmailChange         = (text: string)                 => { setEmail(text);                             setErrorMessage(empty); };
    const handlePasswordChange      = (text: string, valid: boolean) => { setPassword(text); setValidPassword(valid); setErrorMessage(empty); };
    const handleTosAcceptedChange   = (checked: boolean)             => { setTosAccepted(checked);                    setErrorMessage(empty); };

    const isEnabled = () => (
        validFirst &&
        validLast &&
        validEmail &&
        validPassword &&
        (tosAccepted || settings.tos === false)
    );

    const handleExecute                     = (event: React.MouseEvent<HTMLButtonElement>) => { event.preventDefault(); handleSignup(); };
    const handleKeyPress                    = (event: React.KeyboardEvent<HTMLElement>)    => {
        if(isEnabled() && event.key === 'Enter') {
            event.preventDefault();
            handleSignup();
        }
    };
    const handleSignup = () => {
        authentication.createAccount(first, last, email, password)
        .then(async () => {
            await authentication.login(email, password);
            history.push('/');
        })
        .catch(() => { setErrorMessage(`${t('Email address already in use')}.`); });
    };

    return (

        <Box onKeyPress={handleKeyPress}>
            <Typography variant="h1">
                {t('Sign Up')}
            </Typography>
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
                userInputs={[ first, last, email ]}
                onChange={handlePasswordChange}
                minLength={settings.password.minLength}
                maxLength={settings.password.maxLength}
                strength={settings.password.strength}
                uppercase={settings.password.uppercase}
                lowercase={settings.password.lowercase}
                digit={settings.password.digit}
                special={settings.password.special}
                categories={settings.password.categories}
            />

            {
                settings.tos &&
                <Checkbox
                    label={
                        <Typography variant="caption">
                            {t('I\'ve read and accepted the')} <Link to={settings.tos}>{t('Terms of Service')}</Link>
                        </Typography>
                    }
                    checked={tosAccepted}
                    onChange={handleTosAcceptedChange}
                />
            }

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

            {
                errorMessage &&
                <Box marginY={1}>
                    <Alert severity="error">
                        {t(errorMessage)}
                    </Alert>
                </Box>
            }
        </Box>
    );
};

export default SignUp;
