import React                        from 'react';
import TextField                    from '~src/client/control/textField/TextField';
import IconButton                   from '@material-ui/core/IconButton';
import Lock                         from '@material-ui/icons/Lock';
import Visibility                   from '@material-ui/icons/Visibility';
import VisibilityOff                from '@material-ui/icons/VisibilityOff';

type PasswordFieldProps =
    {
        className?:     string;
        label?:         string;
        helperText?:    string;
        error?:         boolean;
        value?:         string;
        required?:      boolean;
        validation?:    RegExp;
        onChange?:      (text: string) => void;
        onValidation?:  (valid: boolean) => void;
    };

export const PasswordField: React.FC<PasswordFieldProps> = (props: PasswordFieldProps) => {
    const [ password, setPassword ]             = React.useState<string>(props.value ?? '');
    const [ showPassword, setShowPassword ]     = React.useState<boolean>(false);

    const handleChange           = (text: string) =>
    {
        setPassword(text);
        props.onChange?.(text);
    }

    const handleVisibility        = () => setShowPassword(!showPassword);

    return (
        <TextField
            className={props.className}
            onChange={handleChange}
            onValidation={props.onValidation}
            type={showPassword ? 'text' : 'password'}
            label={props.label}
            value={password}
            helperText={props.helperText}
            error={props.error}
            startAdornment={<Lock/>}
            required={props.required}
            validation={props.validation}
            endAdornment={
                <IconButton onClick={handleVisibility} tabIndex={-1}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            }
        />
    );
}

export default PasswordField;
