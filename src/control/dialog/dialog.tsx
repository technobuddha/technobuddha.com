import React from 'react';
import { Dialog as MuiDialog, type DialogProps as MuiDialogProps } from '@mui/material';

export type DialogProps = {
  readonly open: MuiDialogProps['open'];

  readonly onClose?: MuiDialogProps['onClose'];

  readonly children?: MuiDialogProps['children'];
};

export const Dialog: React.FC<DialogProps> = (props) => <MuiDialog {...props} />;
