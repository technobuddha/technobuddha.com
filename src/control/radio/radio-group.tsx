/* eslint-disable react/jsx-handler-names */
import React from 'react';
import {
  FormControl,
  FormLabel,
  type FormLabelProps,
  RadioGroup as MuiRadioGroup,
  type RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material';

export type RadioGroupProps = {
  readonly row?: MuiRadioGroupProps['row'];
  readonly value: MuiRadioGroupProps['value'];
  readonly onChange?: MuiRadioGroupProps['onChange'];
  readonly label: FormLabelProps['children'];

  readonly children: React.ReactNode;
};
export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  label,
  row,
  onChange,
  children,
}) => {
  const id = React.useId();

  return (
    <FormControl>
      <FormLabel id={id}>{label}</FormLabel>
      <MuiRadioGroup aria-labelledby={id} row={row} value={value} onChange={onChange}>
        {children}
      </MuiRadioGroup>
    </FormControl>
  );
};
