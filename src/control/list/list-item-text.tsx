import React from 'react';
import {
  ListItemText as MuiListItemText,
  type ListItemTextProps as MuiListItemTextProps,
} from '@mui/material';

export type ListItemTextProps = {
  readonly className?: MuiListItemTextProps['className'];
  readonly classes?: MuiListItemTextProps['classes'];
  readonly style?: MuiListItemTextProps['style'];
  readonly primary?: MuiListItemTextProps['primary'];
  readonly secondary?: MuiListItemTextProps['secondary'];
};

export const ListItemText: React.FC<ListItemTextProps> = (props) => <MuiListItemText {...props} />;
