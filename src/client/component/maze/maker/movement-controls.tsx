import React from 'react';
import { memoize } from 'lodash-es';
import { GiExitDoor } from 'react-icons/gi';
import { RiArrowTurnBackLine, RiArrowUpLine, RiRestartLine } from 'react-icons/ri';

import { Button, Tooltip } from '#control';
import { playModeIcons, type Runner } from '#maze/runner';
import { type Human } from '#maze/solver';

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

  const handleRefresh = React.useCallback(() => {
    if (runner) {
      runner.observationTime = 0;
    }

    const human = runner?.solver as Human;
    if (human) {
      human.dispatchEvent(new CustomEvent('keydown', { detail: 'x' }));
    }
  }, [runner]);

  return (
    <div className={css.movementControls}>
      <div className={css.human}>
        <div className={css.col}>
          <Tooltip title="Change Direction">
            <Button onClick={handleCommand('ArrowLeft')}>
              <RiRestartLine />
            </Button>
          </Tooltip>
        </div>
        <div className={css.col}>
          <Tooltip title="Move Forward">
            <Button onClick={handleCommand('ArrowUp')}>
              <RiArrowUpLine />
            </Button>
          </Tooltip>
          <Tooltip title="Move Backward">
            <Button onClick={handleCommand('ArrowDown')}>
              <RiArrowTurnBackLine />
            </Button>
          </Tooltip>
        </div>
        <div className={css.col}>
          <Tooltip title="Exit Maze">
            <Button onClick={handleCommand('Escape')}>
              <GiExitDoor />
            </Button>
          </Tooltip>
        </div>
        <div className={css.col}>
          <Button onClick={handleRefresh}>{playModeIcons.refresh}</Button>
        </div>
      </div>
    </div>
  );
};
