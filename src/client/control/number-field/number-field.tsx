import React from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

export type NumberFieldProps = TextFieldProps & {
  readonly id?: string;
  readonly name?: string;
  readonly min?: number;
  readonly max?: number;
};

export const NumberField: React.FC<NumberFieldProps> = (props: NumberFieldProps) => {
  const { id, name, min, max, children, ...rest } = props;
  return (
    <TextField {...rest} slotProps={{ htmlInput: { id, name, min, max } }}>
      {children}
    </TextField>
  );
};
