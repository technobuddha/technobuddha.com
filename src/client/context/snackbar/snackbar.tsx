import React from 'react';
import { SnackbarProvider as NotiSnack } from 'notistack';

export type SnackbarProviderProps = {
  children?: React.ReactNode;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  return (
    <NotiSnack maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      {children}
    </NotiSnack>
  );
};
