import React from 'react';
import Popover from '@mui/material/Popover';
import { clsx } from 'clsx';
import { HiMiniInformationCircle } from 'react-icons/hi2';

import { Box, IconButton } from '#control';

import css from './help.module.css';

export type HelpProps = {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
};

export const Help: React.FC<HelpProps> = ({ className, style, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box className={clsx(css.help, className)} style={style}>
      <IconButton aria-describedby={id} size="small" onClick={handleClick}>
        <HiMiniInformationCircle className={css.icon} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {children}
      </Popover>
    </Box>
  );
};
