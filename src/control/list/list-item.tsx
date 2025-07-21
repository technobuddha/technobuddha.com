import React from 'react';
import { ListItem as MuiListItem, type ListItemProps as MuiListItemProps } from '@mui/material';

export type ListItemProps = {
  readonly className?: MuiListItemProps['className'];
  readonly style?: MuiListItemProps['style'];
  readonly onClick?: MuiListItemProps['onClick'];

  readonly children?: MuiListItemProps['children'];
};

export const ListItem: React.FC<ListItemProps> = ({ children, ...props }) => (
  <MuiListItem {...props}>{children}</MuiListItem>
);
