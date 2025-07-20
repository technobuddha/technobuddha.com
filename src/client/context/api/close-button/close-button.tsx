import React from 'react';
import { FaRegWindowClose } from 'react-icons/fa';

import { type SnackbarKey } from '#context/snackbar';
import { IconButton } from '#control';

import css from './close-button.module.css';

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
    <IconButton className={css.iconButton} onClick={handleClick}>
      <FaRegWindowClose className={css.icon} />
    </IconButton>
  );
};
