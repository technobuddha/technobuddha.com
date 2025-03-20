import React from 'react';
import { CircularProgress, Fade } from '@mui/material';

import css from './delayed-loading.module.css';

export const DelayedLoading: React.FC = () => (
  <div className={css.delayedLoading}>
    <div className={css.placeholder}>
      <Fade in style={{ transitionDelay: '800ms' }} unmountOnExit>
        <CircularProgress />
      </Fade>
    </div>
  </div>
);
