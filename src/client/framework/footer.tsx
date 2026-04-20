import React from 'react';
import { AppBar, Box, Typography } from '@technobuddha/controls';

import { useUserInterface } from '#context/user-interface';

import packageJson from '../../../package.json' with { type: 'json' };

import css from './footer.module.css' with { type: 'css' };

export const Footer: React.FC = () => {
  const { footer } = useUserInterface();

  return (
    <AppBar position="static" elevation={0} component="footer">
      <Box className={css.footer}>
        <Box className={css.display}>
          <Typography variant="body2">version {packageJson?.version}</Typography>
        </Box>
        <Box className={css.message}>{footer}</Box>
      </Box>
    </AppBar>
  );
};
