import React from 'react';
import Button from '@mui/material/Button';
import { FaRegWindowClose } from 'react-icons/fa';

import { type SnackbarKey } from '#context/snackbar';

export type CloseButtonProps = {
  readonly snackbarKey: SnackbarKey;
  closeSnackbar(this: void, key: SnackbarKey): void;
  readonly children?: never;
};

export const CloseButton: React.FC<CloseButtonProps> = ({ snackbarKey, closeSnackbar }) => {
  const handleClick = React.useCallback(() => {
    closeSnackbar(snackbarKey);
  }, [closeSnackbar, snackbarKey]);

  return (
    <Button onClick={handleClick}>
      <FaRegWindowClose />
    </Button>
  );
};
