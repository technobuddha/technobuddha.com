import React from 'react';

import { Box, Typography } from '#control';

import { playModeIcons } from '../play-mode-icons.tsx';

export const PhaseControlsHelp: React.FC = () => (
  <Box>
    <Typography variant="h6">Click on a phase to change its play mode.</Typography>
    <Typography variant="body1">
      The maze will go through several phases during the process of generation and solution. Each
      phase has its own play mode, allowing you to focus on different aspects of the maze creation
      and solution. You can adjust the play mode for each phase to control the speed and behavior of
      the visualization.
    </Typography>
    <ul>
      <li>
        <Typography variant="h4">generate</Typography>
        <Typography variant="body2">
          This phase generates the maze structure. You can set the play mode to pause to view the
          generated maze before proceeding to the next phase.
        </Typography>
      </li>
      <li>
        <Typography variant="h4">braid</Typography>
        <Typography variant="body2">
          This phase adds additional paths to the maze to create a more complex structure. You can
          adjust the play mode to control the speed of the braiding process.
        </Typography>
      </li>
      <li>
        <Typography variant="h4">solve</Typography>
        <Typography variant="body2">
          This phase finds the solution to the maze. You can set the play mode to pause to view the
          generated maze before proceeding to the next phase.
        </Typography>
      </li>
      <li>
        <Typography variant="h4">final</Typography>
        <Typography variant="body2">
          This phase finalizes the maze and prepares it for display. You can set the play mode to
          pause to view the generated maze before proceeding to the next phase.
        </Typography>
      </li>
    </ul>

    <table>
      <thead>
        <th>Play Mode</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td>{playModeIcons.pause}</td>
          <td>The maze is paused just before the phase begins.</td>
        </tr>
        <tr>
          <td>{playModeIcons.play}</td>
          <td>The maze will begin the phase in play mode.</td>
        </tr>
        <tr>
          <td>{playModeIcons.fast}</td>
        </tr>
        <tr>
          <td>{playModeIcons.instant}</td>
        </tr>
        <tr>
          <td>{playModeIcons.refresh}</td>
        </tr>
      </tbody>
    </table>
  </Box>
);
