import React from 'react';
import { type CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import MuiCheckBox from '@mui/material/Checkbox';
import { type FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel';
import MuiFormControlLabel from '@mui/material/FormControlLabel';

type CheckboxProps = {
  readonly checked?: MuiFormControlLabelProps['checked'];
  readonly icon?: {
    checked?: MuiCheckboxProps['checkedIcon'];
    unchecked?: MuiCheckboxProps['icon'];
  };
  readonly color?: MuiCheckboxProps['color'];
  readonly disabled?: MuiFormControlLabelProps['disabled'];
  readonly label: MuiFormControlLabelProps['label'];
  readonly labelPlacement?: MuiFormControlLabelProps['labelPlacement'];
  readonly size?: MuiCheckboxProps['size'];
  onChange?(this: void, checked: boolean): void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  icon,
  color,
  disabled,
  label,
  labelPlacement,
  size,
  onChange,
}) => {
  const handleChange = React.useCallback(
    (_: React.SyntheticEvent, isChecked: boolean): void => onChange?.(isChecked),
    [onChange],
  );

  return (
    <MuiFormControlLabel
      checked={checked}
      disabled={disabled}
      label={label}
      labelPlacement={labelPlacement}
      onChange={handleChange}
      control={
        <MuiCheckBox icon={icon?.unchecked} checkedIcon={icon?.checked} color={color} size={size} />
      }
    />
  );
};
