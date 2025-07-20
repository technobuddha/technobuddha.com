import React from 'react';
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonProps = {
  // classes
  readonly className?: MuiButtonProps['className'];
  readonly color?: MuiButtonProps['color'];
  // component
  readonly disabled?: MuiButtonProps['disabled'];
  // disableElevation
  // disableFocusRipple
  // disableRipple
  readonly endIcon?: MuiButtonProps['endIcon'];
  readonly fullWidth?: MuiButtonProps['fullWidth'];
  // href
  readonly loading?: MuiButtonProps['loading'];
  readonly loadingPosition?: MuiButtonProps['loadingPosition'];
  readonly size?: MuiButtonProps['size'];
  readonly startIcon?: MuiButtonProps['startIcon'];
  // sx
  readonly variant?: MuiButtonProps['variant'];
  readonly type?: MuiButtonProps['type'];

  readonly onClick?: MuiButtonProps['onClick'];

  readonly children?: MuiButtonProps['children'];
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'outlined',
  color = 'primary',
  children,
  ...props
}) => (
  <MuiButton variant={variant} color={color} {...props}>
    {children}
  </MuiButton>
);
