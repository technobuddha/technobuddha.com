import React from 'react';
import {
  ListItemIcon as MuiListItemIcon,
  type ListItemIconProps as MuiListItemIconProps,
} from '@mui/material';

export type ListItemIconProps = {
  readonly className?: MuiListItemIconProps['className'];
  readonly style?: MuiListItemIconProps['style'];
  readonly children?: MuiListItemIconProps['children'];
};

export const ListItemIcon: React.FC<ListItemIconProps> = ({ children, ...props }) => (
  <MuiListItemIcon {...props}>{children}</MuiListItemIcon>
);
