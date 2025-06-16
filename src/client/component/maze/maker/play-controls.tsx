import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  IoFootsteps,
  IoPause,
  IoPlay,
  IoPlayForward,
  IoPlaySkipForward,
  IoRefresh,
} from 'react-icons/io5';

import css from './play-controls.module.css';

type Handler = (this: void) => void;

export type PlayControlsProps = {
  readonly value: string;
  readonly onPause?: Handler;
  readonly onStep?: Handler;
  readonly onPlay?: Handler;
  readonly onFast?: Handler;
  readonly onInstant?: Handler;
  readonly onRefresh?: Handler;
  readonly children?: never;
};

export const PlayControls: React.FC<PlayControlsProps> = ({
  value,
  onPause,
  onStep,
  onPlay,
  onFast,
  onInstant,
  onRefresh,
}) => {
  const handlePause = React.useCallback(() => {
    onPause?.();
  }, [onPause]);

  const handleStep = React.useCallback(() => {
    onStep?.();
  }, [onStep]);

  const handlePlay = React.useCallback(() => {
    onPlay?.();
  }, [onPlay]);

  const handleFast = React.useCallback(() => {
    onFast?.();
  }, [onFast]);

  const handleInstant = React.useCallback(() => {
    onInstant?.();
  }, [onInstant]);

  const handleRefresh = React.useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  return (
    <ToggleButtonGroup
      className={css.playControls}
      // color="primary"
      value={value}
      exclusive
    >
      <ToggleButton value="pause" onClick={handlePause}>
        <IoPause size={14} />
      </ToggleButton>
      <ToggleButton value="step" onClick={handleStep}>
        <IoFootsteps size={14} />
      </ToggleButton>
      <ToggleButton value="play" onClick={handlePlay}>
        <IoPlay size={14} />
      </ToggleButton>
      <ToggleButton value="fast" onClick={handleFast}>
        <IoPlayForward size={14} />
      </ToggleButton>
      <ToggleButton value="instant" onClick={handleInstant}>
        <IoPlaySkipForward size={14} />
      </ToggleButton>
      <ToggleButton value="refresh" onClick={handleRefresh}>
        <IoRefresh size={14} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
