import React from 'react';

import { Box, Typography } from '#control';

import css from './phase-controls.help.module.css';

export const PhaseControlsHelp: React.FC = () => (
  <Box>
    <Typography className={css.h4}>
      Displays the currently active phase of maze generation and solution.
    </Typography>
    <Typography className={css.body1}>Click on a phase to change its play mode.</Typography>
    <Typography className={css.body1}>
      When each phase begins, the play mode is set to the indicated speed. This allows you to
      control which aspects of the maze creation and solution you want to pay the most attention to.
      If you want to see the solution only, you can set the play mode to pause, which will allow you
      to view the generated maze and then control the solution.
    </Typography>
  </Box>
);
