import React from 'react';
import {
  FormControlLabel,
  type FormControlLabelProps,
  Radio as MuiRadio,
  type RadioProps as MuiRadioProps,
} from '@mui/material';

export type RadioProps = {
  readonly value: string;
  readonly label: FormControlLabelProps['label'];
  readonly checked?: MuiRadioProps['checked'];
  readonly onChange?: (checked: boolean, value: string) => void;

  readonly children?: never;
};

export const Radio: React.FC<RadioProps> = ({ value, checked, label, onChange }) => {
  const handleChange = React.useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onChange?.(checked, value);
    },
    [onChange, value],
  );

  return (
    <FormControlLabel
      value={value}
      label={label}
      control={<MuiRadio checked={checked} onChange={handleChange} />}
    />
  );
};
