/* eslint-disable react/jsx-handler-names */
import React from 'react';

import { type Phase } from '../phase.ts';
import { type PlayMode } from '../play-mode.tsx';
import { type Runner } from '../runner.ts';

import { PhaseControls } from './phase-controls.tsx';
import { PlayControls } from './play-controls.tsx';

import css from './custom-controls.module.css';

export type CustomControlsProps = {
  readonly runner?: Runner;

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
