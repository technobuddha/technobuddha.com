import React from 'react';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckBox from '@mui/material/Checkbox';

import type { FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel';
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';

type CheckboxProps = {
  checked?: MuiFormControlLabelProps['checked'];
  icon?: {
    checked?: MuiCheckboxProps['checkedIcon'];
    unchecked?: MuiCheckboxProps['icon'];
  };
  color?: MuiCheckboxProps['color'];
  disabled?: MuiFormControlLabelProps['disabled'];
  label: MuiFormControlLabelProps['label'];
  labelPlacement?: MuiFormControlLabelProps['labelPlacement'];
  size?: MuiCheckboxProps['size'];
  onChange?: (checked: boolean) => void;
};

export const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const handleChange = (_event: React.ChangeEvent<Record<string, unknown>>, checked: boolean) =>
    props.onChange?.(checked);

  return (
    <MuiFormControlLabel
      checked={props.checked}
      disabled={props.disabled}
      label={props.label}
      labelPlacement={props.labelPlacement}
      onChange={handleChange}
      control={
        <MuiCheckBox
          icon={props.icon?.unchecked}
          checkedIcon={props.icon?.checked}
          color={props.color}
          size={props.size}
        />
      }
    />
  );
};
