import React                    from 'react';
import useTranslation           from '$client/context/i18n';
import {email as emailRegExp}   from '$library/regexp';
import Typography               from '@material-ui/core/Typography';
import Button                   from '@material-ui/core/Button';
import TextField                from '$client/control/TextField';
import Email                    from '@material-ui/icons/Email';


export type LoginMode  = 'login' | 'forgotPassword' | 'signUp';
export type LoginState = { mode: LoginMode };

export const ForgotPassword: React.FC = () => {
    const { t }                                 = useTranslation();
    const [ email, setEmail ]                   = React.useState<string>('');

    const handleEmailChange         = (text: string) => { setEmail(text); };
    const isDisabled                = () => !email;

    const handleExecute             = async (e: React.FormEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();

        //if(!await authentication.login(username!, password!))
        //    setErrorMessage(t('Please enter a correct username and password.'))
    }

    return (
        <>
            <Typography variant="h5">
                {t('Reset Your Password')}
            </Typography>

            <TextField
                onChange={handleEmailChange}
                // onValidation={setValidEmail}
                label={t('Email address')}
                value={email}
                startAdornment={<Email/>}
                name="username"
                validation={emailRegExp}
                required
            />

            <Button
                onClick={handleExecute}
                variant="contained"
                type="submit"
                color="primary"
                disabled={isDisabled()}
                fullWidth={true}
            >
                {t('Reset Password')}
            </Button>
        </>
    );
};

export default ForgotPassword;
