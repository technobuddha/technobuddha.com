import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import css from './server-snackbar.module.css';

type ServerSnackbarProps = {
  err: Error;
  children?: never;
};

export const ServerSnackbar: React.FC<ServerSnackbarProps> = ({ err }) => {
  return (
    <Box className={css.serverError}>
      <Typography className={css.message}>{err.message}</Typography>
    </Box>
  );
};
