import React from 'react';
import { TextField } from '#control/text-field';
import { IconButton } from '@mui/material';
import { MdLock } from 'react-icons/md';
import { MdVisibility } from 'react-icons/md';
import { MdVisibilityOff } from 'react-icons/md';

type PasswordFieldProps = {
  className?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  value?: string;
  required?: boolean;
  validation?: RegExp;
  onChange?: (text: string) => void;
  onValidation?: (valid: boolean) => void;
};

export const PasswordField: React.FC<PasswordFieldProps> = (props: PasswordFieldProps) => {
  const [password, setPassword] = React.useState<string>(props.value ?? '');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleChange = (text: string) => {
    setPassword(text);
    props.onChange?.(text);
  };

  const handleVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      startAdornment={<MdLock />}
      required={props.required}
      validation={props.validation}
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
