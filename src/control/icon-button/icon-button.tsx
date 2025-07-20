import React from 'react';
import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from '@mui/material';

export type IconButtonProps = {
  readonly className?: MuiIconButtonProps['className'];
  readonly color?: MuiIconButtonProps['color'];
  readonly disabled?: MuiIconButtonProps['disabled'];
  readonly loading?: MuiIconButtonProps['loading'];
  readonly size?: MuiIconButtonProps['size'];
  readonly type?: MuiIconButtonProps['type'];
  readonly onClick?: MuiIconButtonProps['onClick'];
  readonly children?: MuiIconButtonProps['children'];
};

export const IconButton: React.FC<IconButtonProps> = ({
  color = 'primary',
  children,
  ...props
}) => (
  <MuiIconButton color={color} {...props}>
    {children}
  </MuiIconButton>
);
