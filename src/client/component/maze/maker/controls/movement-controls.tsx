import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { memoize } from 'lodash-es';
import { GiExitDoor } from 'react-icons/gi';
import { RiArrowTurnBackLine, RiArrowUpLine, RiRestartLine } from 'react-icons/ri';

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
            <Button variant="outlined" color="primary" onClick={handleCommand('ArrowLeft')}>
              <RiRestartLine size="1em" />
            </Button>
          </Tooltip>
        </div>
        <div className={css.col}>
          <Tooltip title="Move Forward">
            <Button variant="outlined" color="primary" onClick={handleCommand('ArrowUp')}>
              <RiArrowUpLine size="1em" />
            </Button>
          </Tooltip>
          <Tooltip title="Move Backward">
            <Button variant="outlined" color="primary" onClick={handleCommand('ArrowDown')}>
              <RiArrowTurnBackLine size="1em" />
            </Button>
          </Tooltip>
        </div>
        <div className={css.col}>
          <Tooltip title="Exit Maze">
            <Button variant="outlined" color="primary" onClick={handleCommand('Escape')}>
              <GiExitDoor size="1em" />
            </Button>
          </Tooltip>
        </div>
        <div className={css.col}>
          <Button variant="outlined" color="primary" onClick={handleRefresh}>
            {playModeIcons.refresh}
          </Button>
        </div>
      </div>
    </div>
  );
};
