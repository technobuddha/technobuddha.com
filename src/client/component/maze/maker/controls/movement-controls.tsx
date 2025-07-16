import React from 'react';
import { Button } from '@mui/material';
import { memoize } from 'lodash-es';
import {
  IoCaretBackCircleOutline,
  IoCaretDownCircleOutline,
  IoCaretForwardCircleOutline,
  IoCaretUpCircleOutline,
} from 'react-icons/io5';

import { type Human } from '../../solver/index.ts';

import { playModeIcons } from '../play-mode.tsx';
import { type Runner } from '../runner.ts';

import css from './movement-controls.module.css';

type MovementControlsProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

export const MovementControls: React.FC<MovementControlsProps> = ({ runner }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCommand = React.useCallback(
    memoize((key: string) => (_event: React.MouseEvent<HTMLButtonElement>) => {
      const human = runner?.solver as Human;
      if (human) {
        human.dispatchEvent(new CustomEvent('keydown', { detail: key }));
      }
    }),
    [runner],
  );

  const handleChange = React.useCallback(() => {
    runner?.setMode('refresh');

    const human = runner?.solver as Human;
    if (human) {
      human.dispatchEvent(new CustomEvent('keydown', { detail: 'Escape' }));
    }
  }, [runner]);

  return (
    <div className={css.movementControls}>
      <div className={css.human}>
        <div className={css.row}>
          <Button variant="outlined" color="primary" onClick={handleCommand('ArrowUp')}>
            <IoCaretUpCircleOutline size="1em" />
          </Button>
        </div>
        <div className={css.row}>
          <Button variant="outlined" color="primary" onClick={handleCommand('ArrowLeft')}>
            <IoCaretBackCircleOutline size="1em" />
          </Button>
          <Button variant="outlined" color="primary" onClick={handleCommand('ArrowDown')}>
            <IoCaretDownCircleOutline size="1em" />
          </Button>
          <Button variant="outlined" color="primary" onClick={handleCommand('ArrowRight')}>
            <IoCaretForwardCircleOutline size="1em" />
          </Button>
        </div>
      </div>
      <div className={css.maze}>
        <Button variant="outlined" color="primary" onClick={handleChange}>
          {playModeIcons.refresh}
        </Button>
      </div>
    </div>
  );
};
