import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  type SelectChangeEvent,
  // type SelectProps as MuiSelectProps,
} from '@mui/material';

import css from './select.module.css';

export type SelectProps<T = string> = {
  readonly value: T;
  readonly label?: string;
  onChange?(this: void, value: T): void;
  readonly children?: React.ReactNode;
  // readonly className?: string;
  // readonly label?: string;
  // readonly helperText?: string;
  // onChange?(this: void, text: string): void;
};

export function Select<T = string>({
  value,
  label,
  onChange,
  children,
}: SelectProps<T>): React.ReactNode {
  const labelId = React.useId();
  const selectId = React.useId();

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<T>) => {
      onChange?.(event.target.value as T);
    },
    [onChange],
  );

  return (
    <FormControl margin="normal" size="small" classes={{ root: css.formControl }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect<T>
        id={selectId}
        labelId={labelId}
        label={label}
        value={value}
        onChange={handleChange}
        inputProps={{
          name: selectId,
          id: selectId,
        }}
        classes={{ root: css.select }}
      >
        {children}
      </MuiSelect>
    </FormControl>
  );
}
