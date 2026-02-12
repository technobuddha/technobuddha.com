/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { type MazeRunner, type Phase, type PlayMode } from '@technobuddha/maze';

import { PhaseControls } from '../phase-controls/index.ts';
import { PlayControls } from '../play-controls/index.ts';

import css from './custom-controls.module.css' with { type: 'css' };

export type CustomControlsProps = {
  readonly runner?: MazeRunner;

  readonly onPhasePlayModeChange?: (this: void, phase: Phase, value: PlayMode) => void;
  readonly children?: never;
};

export const CustomControls: React.FC<CustomControlsProps> = ({
  runner,
  onPhasePlayModeChange,
}) => (
  <div className={css.customControls}>
    <PhaseControls runner={runner} onPhasePlayModeChange={onPhasePlayModeChange} />
    <PlayControls runner={runner} />
  </div>
);
