import React from 'react';
import {
  ToggleButton as MuiToggleButton,
  type ToggleButtonProps as MuiToggleButtonProps,
} from '@mui/material';

export type ToggleButtonProps = {
  readonly value: MuiToggleButtonProps['value'];
  readonly fullWidth?: MuiToggleButtonProps['fullWidth'];
  readonly disabled?: MuiToggleButtonProps['disabled'];

  readonly children?: MuiToggleButtonProps['children'];
};

// const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>((props, ref) => <MuiToggleButton ref={ref} {...props} />);

export const ToggleButton: React.FC<ToggleButtonProps> = ({ children, ...props }) => (
  <MuiToggleButton {...props}>{children}</MuiToggleButton>
);
