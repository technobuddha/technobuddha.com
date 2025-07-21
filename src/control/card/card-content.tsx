import React from 'react';
import {
  CardContent as MuiCardContent,
  type CardContentProps as MuiCardContentProps,
} from '@mui/material';

export type CardContentProps = {
  readonly className?: MuiCardContentProps['className'];
  readonly children?: MuiCardContentProps['children'];
};

export const CardContent: React.FC<CardContentProps> = ({ children, ...props }) => (
  <MuiCardContent {...props}>{children}</MuiCardContent>
);
