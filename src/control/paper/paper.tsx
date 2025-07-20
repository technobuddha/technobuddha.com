import React from 'react';
import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from '@mui/material';

export type PaperProps = {
  readonly children?: MuiPaperProps['children'];
};

export const Paper: React.FC<PaperProps> = ({ children, ...props }) => (
  <MuiPaper {...props}>{children}</MuiPaper>
);
