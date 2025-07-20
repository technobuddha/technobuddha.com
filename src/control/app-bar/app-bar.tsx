import React from 'react';
import { AppBar as MuiAppBar, type AppBarProps as MuiAppBarProps } from '@mui/material';

export type AppBarProps = {
  readonly className?: MuiAppBarProps['className'];
  readonly position?: MuiAppBarProps['position'];
  readonly elevation?: MuiAppBarProps['elevation'];
  readonly component?: MuiAppBarProps['component'];

  readonly children?: MuiAppBarProps['children'];
};

export const AppBar: React.FC<AppBarProps> = ({ children, ...props }) => (
  <MuiAppBar {...props}>{children}</MuiAppBar>
);
