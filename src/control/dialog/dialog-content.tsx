import React from 'react';
import {
  DialogContent as MuiDialogContent,
  type DialogContentProps as MuiDialogContentProps,
} from '@mui/material';

export type DialogContentProps = {
  readonly children?: MuiDialogContentProps['children'];
};

export const DialogContent: React.FC<DialogContentProps> = (props) => (
  <MuiDialogContent {...props} />
);
