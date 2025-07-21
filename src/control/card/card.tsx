import React from 'react';
import { Card as MuiCard, type CardProps as MuiCardProps } from '@mui/material';

export type CardProps = {
  readonly className?: MuiCardProps['className'];
  readonly variant?: MuiCardProps['variant'];

  readonly children?: MuiCardProps['children'];
};

export const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <MuiCard {...props}>{children}</MuiCard>
);
