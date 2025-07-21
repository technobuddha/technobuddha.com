import React from 'react';
import {
  DialogActions as MuiDialogActions,
  type DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material';

export type DialogActionsProps = {
  readonly children?: MuiDialogActionsProps['children'];
};

export const DialogActions: React.FC<DialogActionsProps> = (props) => (
  <MuiDialogActions {...props} />
);
