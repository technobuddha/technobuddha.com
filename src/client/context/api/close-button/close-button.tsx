import React from 'react';
import { FaRegWindowClose } from 'react-icons/fa';

import { type SnackbarKey } from '#context/snackbar';
import { Button, IconButton } from '#control';

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
    <IconButton onClick={handleClick}>
      <FaRegWindowClose />
    </IconButton>
  );
};
