import React from 'react';
import { Alert as MuiAlert, type AlertProps as MuiAlertProps } from '@mui/material';

export type AlertProps = Omit<MuiAlertProps, 'children'> & {
  readonly children?: React.ReactNode;
};

export const Alert: React.FC<AlertProps> = ({ children, ...props }) => (
  <MuiAlert {...props}>{children}</MuiAlert>
);
