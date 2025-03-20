import React from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';

type TextFieldProps = {
  className?: string;
  id?: string;
  label?: string;
  helperText?: string;
  autoFocus?: boolean;
  value?: string | null;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  validation?: RegExp;
  required?: boolean;
  type?: 'text' | 'password';
  onChange?: (text: string) => void;
  onValidation?: (valid: boolean) => void;
};

export const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  const [text, setText] = React.useState<string>(props.value ?? '');
  const [valid, setValid] = React.useState<boolean>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    let isValid = true;

    if (props.required && newText.trim().length === 0) isValid = false;
    else if (props.validation) isValid = props.validation.test(newText);

    setValid(isValid);
    props.onValidation?.(isValid);

    setText(newText);
    props.onChange?.(newText);
  };

  return (
    <MuiTextField
      className={props.className}
      id={props.id}
      onChange={handleChange}
      variant="outlined"
      type={props.type ?? 'text'}
      label={props.label}
      value={text}
      autoFocus={props.autoFocus}
      name={props.name}
      disabled={props.disabled}
      error={props.error || !valid || (props.required && text.trim() === '')}
      fullWidth={true}
      helperText={props.helperText}
      required={props.required}
      margin="dense"
      color="primary"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {props.startAdornment ?? <Box width={52} height={52} />}
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {props.endAdornment ?? <Box width={52} height={52} />}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default TextField;
