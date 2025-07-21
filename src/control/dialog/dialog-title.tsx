import React from 'react';
import {
  DialogTitle as MuiDialogTitle,
  type DialogTitleProps as MuiDialogTitleProps,
} from '@mui/material';

export type DialogTitleProps = {
  readonly children?: MuiDialogTitleProps['children'];
};

export const DialogTitle: React.FC<DialogTitleProps> = (props) => <MuiDialogTitle {...props} />;
