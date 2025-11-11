import React from 'react';
import {
  Box,
  InputAdornment,
  TextField as MuiTextField,
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';

import css from './text-field.module.css' with { type: 'css' };

export type TextFieldProps = {
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
  const [empty, setEmpty] = React.useState<boolean>(false);

  const validate = React.useCallback(
    (value: string): void => {
      let isValid = true;
      let isEmpty = false;

      if (required && value.trim().length === 0) {
        isValid = false;
        isEmpty = true;
      } else if (validation) {
        isValid = validation.test(value);
        isEmpty = false;
      }

      setValid(isValid);
      setEmpty(isEmpty);
      onValidation?.(isValid);

      setText(value);
      onChange?.(value);
    },
    [onChange, onValidation, required, validation],
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      validate(event.target.value);
    },
    [validate],
  );

  const slotProps = React.useMemo(
    () => ({
      input: {
        startAdornment: (
          <InputAdornment className={css.adornment} position="start">
            {startAdornment ?? <Box width={52} height={52} />}
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment className={css.adornment} position="end">
            {endAdornment ?? <Box width={52} height={52} />}
          </InputAdornment>
        ),
      },
    }),
    [endAdornment, startAdornment],
  );

  React.useEffect(() => {
    validate(value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation, required, validate]);

  return (
    <MuiTextField
      classes={{ root: className }}
      id={id}
      onChange={handleChange}
      variant="outlined"
      type={type ?? 'text'}
      label={label}
      value={text}
      autoFocus={autoFocus}
      name={name}
      disabled={disabled}
      error={error ?? (!valid || (required && empty))}
      fullWidth
      helperText={valid || empty ? helperText : `${label} is invalid`}
      required={required}
      color="primary"
      slotProps={slotProps as MuiTextFieldProps['slotProps']}
    />
  );
};
