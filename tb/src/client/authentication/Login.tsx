import React              from 'react';
import useTranslation     from '#context/i18n';
import useAuthentication  from '#context/authentication';
import useHistory         from '#context/router';
import PasswordField      from '#control/passwordField';
import TextField          from '#control/textField';
import Email              from '@material-ui/icons/Email';
import Box                from '@material-ui/core/Box';
import Button             from '@material-ui/core/Button';
import Typography         from '@material-ui/core/Typography';
import Alert              from '@material-ui/lab/Alert';
import css                from './Login.css';

export const Login: React.FC = () => {
    const { t }                                 = useTranslation();
    const authentication                        = useAuthentication();
    const history                               = useHistory();
    const [ username, setUsername ]               = React.useState<string>('');
    const [ password, setPassword ]               = React.useState<string>('');
    const [ errorMessage, setErrorMessage ]       = React.useState<string | null>(null);

    const handleUsernameChange      = (text: string) => { setUsername(text); setErrorMessage(null); };
    const handlePasswordChange      = (text: string) => { setPassword(text); setErrorMessage(null); };
    const isEnabled                 = () => Boolean(username && password);
    const handleExecute             = (event: React.MouseEvent<HTMLButtonElement>) => { event.preventDefault(); handleLogin(); };
    const handleKeyPress            = (event: React.KeyboardEvent<HTMLElement>)    => {
        if(isEnabled() && event.key === 'Enter') {
            event.preventDefault();
            handleLogin();
        }
    };
    const handleLogin               = () => {
        authentication.login(username, password).then(response => {
            if(response) {
                if(history.location.state?.referrer)
                    history.push(history.location.state.referrer);
                else
                    history.push('/');
            } else {
                setErrorMessage(`${t('Please enter a correct username and password')}.`);
            }
        });
    };

    return (
        <Box className={css.login} onKeyPress={handleKeyPress}>
            <Typography variant="h5">
                {t('Log In')}
            </Typography>
            <Box className={css.input}>
                <TextField
                    onChange={handleUsernameChange}
                    autoFocus={true}
                    label={t('Email address')}
                    value={username}
                    name="username"
                    startAdornment={<Email />}
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

            {
                errorMessage &&
                <Box className={css.message}>
                    <Alert severity="error">
                        {t(errorMessage)}
                    </Alert>
                </Box>
            }
        </Box>
    );
};

export default Login;
