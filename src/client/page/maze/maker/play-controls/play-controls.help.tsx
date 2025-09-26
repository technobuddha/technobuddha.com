/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { Box, Typography } from '#control';

import { playModeIcons } from '../play-mode-icons.tsx';

export const PlayControlsHelp: React.FC = () => (
  <Box>
    <table>
      <thead>
        <tr>
          <th>
            <Typography variant="h4">Play Mode</Typography>
          </th>
          <th>
            <Typography variant="h4">Description</Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{playModeIcons.pause}</td>
          <td>
            <Typography variant="body1">
              The maze is paused just before the phase begins.
            </Typography>
          </td>
        </tr>
        <tr>
          <td>{playModeIcons.play}</td>
          <td>
            <Typography variant="body1">The maze will begin the phase in play mode.</Typography>
          </td>
        </tr>
        <tr>
          <td>{playModeIcons.fast}</td>
          <td>
            <Typography variant="body1">The maze will begin the phase in fast mode.</Typography>
          </td>
        </tr>
        <tr>
          <td>{playModeIcons.instant}</td>
          <td>
            <Typography variant="body1">The maze will begin the phase in instant mode.</Typography>
          </td>
        </tr>
        <tr>
          <td>{playModeIcons.refresh}</td>
        </tr>
      </tbody>
    </table>
  </Box>
);
