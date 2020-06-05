import React                    from 'react';
import useTranslation           from '$client/context/i18n';
import useAuthentication        from '$client/context/authentication';
import useHistory               from '$client/context/router';
import Button                   from '$client/control/Button';
import Box                      from '$client/control/Box';
import Alert                    from '$client/control/Alert';
import Email                    from '@material-ui/icons/Email';
import PasswordField            from '$client/control/PasswordField';
import TextField                from '$client/control/TextField';
import Typography               from '$client/control/Typography';

export const Login: React.FC = () => {
    const {t}                                   = useTranslation();
    const authentication                        = useAuthentication();
    const history                               = useHistory();
    const [username, setUsername]               = React.useState<string>('');
    const [password, setPassword]               = React.useState<string>('');
    const [errorMessage, setErrorMessage]       = React.useState<string | null>(null);

    const handleUsernameChange      = (text: string) =>     { setUsername(text);    setErrorMessage(null); };
    const handlePasswordChange      = (text: string) =>     { setPassword(text);    setErrorMessage(null); };
    const isEnabled                 = () => Boolean(username && password);
    const handleExecute             = (event: React.MouseEvent<HTMLButtonElement>) => { event.preventDefault(); handleLogin(); }
    const handleKeyPress            = (event: React.KeyboardEvent<HTMLElement>)    => { 
        if(isEnabled() && event.key == 'Enter') {
            event.preventDefault();
            handleLogin();
        }
    }
    const handleLogin               = () => {
        authentication.login(username!, password!).then(response => {
            if(response) {
                //TODO history state should be typed...
                if(history.location.state?.referrer) {
                    history.push(history.location.state.referrer);
                } else {
                    history.push('/');
                }
            } else {
                setErrorMessage(t('Please enter a correct username and password.'));
            }
        });
    }

    return (
        <Box display="flex" flexDirection="column" onKeyPress={handleKeyPress}>
            <Typography variant="h5">
                {t('Log In')}
            </Typography>
            <Box marginY={1}>
                <TextField
                    onChange={handleUsernameChange}
                    autoFocus
                    label={t('Email address')}
                    value={username}
                    name="username"
                    startAdornment={<Email/>}
                />
            </Box>
            <Box marginY={1}>
            <PasswordField
                label={t('Password')}
                helperText={t('Password is case-sensitive.')}
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
                {t('Login')}
            </Button>

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

export default Login;
