import React from 'react';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { IoPause, IoPlay, IoPlayForward, IoPlaySkipForward } from 'react-icons/io5';

import { type PlayMode } from './runner.ts';

import css from './play-mode-toggle.module.css';

type PlayModeToggleProps = {
  readonly value: PlayMode;
  readonly title?: string;
  onChange?(this: void, value: PlayMode): void;
  readonly children?: never;
};

export const PlayModeToggle: React.FC<PlayModeToggleProps> = ({
  value,
  title = 'Play Mode',
  onChange,
}) => {
  const handleChange = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: PlayMode) => {
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <fieldset className={css.playModeToggle}>
      <legend>
        <Typography className={css.title}>{title}</Typography>
      </legend>
      <ToggleButtonGroup
        color="primary"
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="Mode"
      >
        <ToggleButton value="pause" fullWidth>
          <IoPause size={10} />
        </ToggleButton>
        <ToggleButton value="play" fullWidth>
          <IoPlay size={10} />
        </ToggleButton>
        <ToggleButton value="fast" fullWidth>
          <IoPlayForward size={10} />
        </ToggleButton>
        <ToggleButton value="instant" fullWidth>
          <IoPlaySkipForward size={10} />
        </ToggleButton>
      </ToggleButtonGroup>
    </fieldset>
  );
};
