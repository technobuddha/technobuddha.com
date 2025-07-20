import React from 'react';

import { Box, Typography } from '#control';

import css from './service-notification.module.css';

type ServerErrorProps = {
  readonly err: Error;
  readonly children?: never;
};

export const ServiceNotification: React.FC<ServerErrorProps> = ({ err }) => (
  <Box className={css.serverError}>
    <Typography className={css.message}>{err.message}</Typography>
  </Box>
);
