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

  return (
    <div className={css.movementControls}>
      <div style={{ textAlign: 'center' }}>
        <Button variant="outlined" color="primary" onClick={handleCommand('ArrowUp')}>
          <IoCaretUpCircleOutline size={28} />
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button variant="outlined" color="primary" onClick={handleCommand('ArrowLeft')}>
          <IoCaretBackCircleOutline size={28} />
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCommand('ArrowDown')}>
          <IoCaretDownCircleOutline size={28} />
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCommand('ArrowRight')}>
          <IoCaretForwardCircleOutline size={28} />
        </Button>
      </div>
    </div>
  );
};
