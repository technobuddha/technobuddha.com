import React from 'react';
import { List as MuiList, type ListProps as MuiListProps } from '@mui/material';

export type ListProps = {
  readonly className?: MuiListProps['className'];
  readonly children?: MuiListProps['children'];
  readonly style?: MuiListProps['style'];
};

export const List: React.FC<ListProps> = ({ children, ...props }) => (
  <MuiList {...props}>{children}</MuiList>
);
