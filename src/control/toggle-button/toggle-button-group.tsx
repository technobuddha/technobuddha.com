import React from 'react';
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  type ToggleButtonGroupProps as MuiToggleButtonGroupProps,
} from '@mui/material';

export type ToggleButtonGroupProps = {
  readonly className?: MuiToggleButtonGroupProps['className'];
  readonly color?: MuiToggleButtonGroupProps['color'];
  readonly exclusive?: MuiToggleButtonGroupProps['exclusive'];
  readonly value: MuiToggleButtonGroupProps['value'];

  readonly onChange?: MuiToggleButtonGroupProps['onChange'];

  readonly children?: MuiToggleButtonGroupProps['children'];
};

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ children, ...props }) => (
  <MuiToggleButtonGroup {...props}>{children}</MuiToggleButtonGroup>
);
