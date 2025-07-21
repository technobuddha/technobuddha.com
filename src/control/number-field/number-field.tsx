import React from 'react';
import { TextField } from '@mui/material';

import css from './number-field.module.css';

export type NumberFieldProps = {
  readonly value: number;
  readonly label?: string;
  readonly id?: string;
  readonly name?: string;
  readonly min?: number;
  readonly max?: number;
  onChange?(this: void, value: number): void;
  readonly children?: never;
};

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  name,
  value,
  label,
  onChange,
  min,
  max,
}) => {
  const handleOnChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(event.target.value));
    },
    [onChange],
  );

  return (
    <TextField
      className={css.numberField}
      value={value}
      label={label}
      onChange={handleOnChange}
      slotProps={{ htmlInput: { id, name, min, max, value, type: 'number' } }}
    />
  );
};
