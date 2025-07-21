import React from 'react';
import { FormControlLabel, type FormControlLabelProps, Radio as MuiRadio } from '@mui/material';

export type RadioProps = {
  readonly value: FormControlLabelProps['value'];
  readonly label: FormControlLabelProps['label'];

  readonly children?: never;
};

export const Radio: React.FC<RadioProps> = ({ value, label }) => (
  <FormControlLabel value={value} label={label} control={<MuiRadio />} />
);
