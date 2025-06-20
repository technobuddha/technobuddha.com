import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { type PlayMode, playModeIcons, playModes } from '../play-mode.tsx';
import { type Runner } from '../runner.ts';

import css from './play-controls.module.css';

export type PlayControlsProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

export const PlayControls: React.FC<PlayControlsProps> = ({ runner }) => {
  const [mode, setMode] = React.useState<PlayMode | undefined>(runner?.mode);

  React.useEffect(() => {
    if (runner) {
      const onModeChange = (event: Event): void => {
        setMode((event as CustomEvent).detail as PlayMode);
      };
      runner.addEventListener('mode', onModeChange);

      return () => runner.removeEventListener('mode', onModeChange);
    }

    return undefined;
  }, [runner]);

  const handleChange = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: PlayMode) => {
      if (newValue) {
        runner?.setMode(newValue);
        setMode(newValue);
      } else {
        runner?.setMode(runner.mode);
      }
    },
    [runner],
  );

  return (
    <ToggleButtonGroup
      className={css.playControls}
      color="primary"
      value={mode}
      exclusive
      onChange={handleChange}
    >
      {playModes.map((pm) => (
        <ToggleButton
          key={pm}
          value={pm}
          disabled={
            (runner?.phase === 'final' || runner?.phase === 'observe') &&
            pm !== 'pause' &&
            pm !== 'refresh'
          }
        >
          {playModeIcons[pm]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
