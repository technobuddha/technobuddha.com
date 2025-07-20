import React from 'react';
import { IconButton } from '@mui/material';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { TextField } from '#control';

export type PasswordFieldProps = {
  readonly className?: string;
  readonly label?: string;
  readonly helperText?: string;
  readonly error?: boolean;
  readonly value?: string;
  readonly required?: boolean;
  readonly validation?: RegExp;
  onChange?(this: void, text: string): void;
  onValidation?(this: void, valid: boolean): void;
};

export const PasswordField: React.FC<PasswordFieldProps> = ({
  className,
  label,
  helperText,
  error,
  value,
  required,
  validation,
  onChange,
  onValidation,
}) => {
  const [password, setPassword] = React.useState<string>(value ?? '');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleChange = React.useCallback(
    (text: string): void => {
      setPassword(text);
      onChange?.(text);
    },
    [onChange],
  );

  const handleValidation = React.useCallback(
    (valid: boolean): void => {
      onValidation?.(valid);
    },
    [onValidation],
  );

  const handleVisibility = React.useCallback((): void => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <TextField
      className={className}
      onChange={handleChange}
      onValidation={handleValidation}
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={password}
      helperText={helperText}
      error={error}
      startAdornment={<MdLock />}
      required={required}
      validation={validation}
      endAdornment={
        <IconButton onClick={handleVisibility} tabIndex={-1}>
          {showPassword ?
            <MdVisibilityOff />
          : <MdVisibility />}
        </IconButton>
      }
    />
  );
};
