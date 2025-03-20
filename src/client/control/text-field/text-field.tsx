import React from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';

type TextFieldProps = {
  readonly className?: string;
  readonly id?: string;
  readonly label?: string;
  readonly helperText?: string;
  readonly autoFocus?: boolean;
  readonly value?: string | null;
  readonly startAdornment?: React.ReactNode;
  readonly endAdornment?: React.ReactNode;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly validation?: RegExp;
  readonly required?: boolean;
  readonly type?: 'text' | 'password';
  onChange?(this: void, text: string): void;
  onValidation?(this: void, valid: boolean): void;
};

export const TextField: React.FC<TextFieldProps> = ({
  className,
  id,
  label,
  helperText,
  autoFocus,
  value,
  startAdornment,
  endAdornment,
  name,
  disabled,
  error,
  validation,
  required,
  type,
  onChange,
  onValidation,
}) => {
  const [text, setText] = React.useState<string>(value ?? '');
  const [valid, setValid] = React.useState<boolean>(true);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newText = event.target.value;
      let isValid = true;

      if (required && newText.trim().length === 0) {
        isValid = false;
      } else if (validation) {
        isValid = validation.test(newText);
      }

      setValid(isValid);
      onValidation?.(isValid);

      setText(newText);
      onChange?.(newText);
    },
    [onChange, onValidation, required, validation],
  );

  const slotProps = {
    input: {
      startAdornment: (
        <InputAdornment position="start">
          {startAdornment ?? <Box width={52} height={52} />}
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          {endAdornment ?? <Box width={52} height={52} />}
        </InputAdornment>
      ),
    },
  };

  return (
    <MuiTextField
      className={className}
      id={id}
      onChange={handleChange}
      variant="outlined"
      type={type ?? 'text'}
      label={label}
      value={text}
      autoFocus={autoFocus}
      name={name}
      disabled={disabled}
      error={(error ?? !valid) || (required && text.trim() === '')}
      fullWidth
      helperText={helperText}
      required={required}
      margin="dense"
      color="primary"
      slotProps={slotProps}
    />
  );
};
