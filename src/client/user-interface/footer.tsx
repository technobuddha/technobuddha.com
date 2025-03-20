import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import packageJson from '~package.json';
import css from './footer.module.css';

export const Footer: React.FC = () => {
  return (
    <AppBar position="static" elevation={0} component="footer">
      <Box className={css.footer}>
        <Box className={css.display}>
          <Typography variant="body2">version {packageJson.version}</Typography>
        </Box>
      </Box>
    </AppBar>
  );
};
