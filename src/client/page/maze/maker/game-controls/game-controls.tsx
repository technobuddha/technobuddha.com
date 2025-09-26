import React from 'react';
import { memoize } from 'lodash-es';
import { GiExitDoor } from 'react-icons/gi';
import { RiArrowTurnBackLine, RiArrowUpLine, RiRestartLine } from 'react-icons/ri';

import { Button, Tooltip } from '#control';
import { type Phase, type Runner } from '#maze/runner';
import { type Human } from '#maze/solver';

import { playModeIcons } from '../play-mode-icons.tsx';
import { Section } from '../section/index.ts';

import { GameControlsHelp } from './game-controls.help';

import css from './game-controls.module.css';

type GameControlsProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

export const GameControls: React.FC<GameControlsProps> = ({ runner }) => {
  const [phase, setPhase] = React.useState<Phase | undefined>(runner?.phase);

  React.useEffect(() => {
    if (runner) {
      const onPhaseChange = (event: Event): void => {
        setPhase((event as CustomEvent).detail as Phase);
      };
      runner.addEventListener('phase', onPhaseChange);
      setPhase(runner.phase);

      return () => runner.removeEventListener('phase', onPhaseChange);
    }

    return undefined;
  }, [runner]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCommand = React.useCallback(
    memoize((key: string) => (_event: React.MouseEvent<HTMLButtonElement>) => {
      const human = runner?.solver as Human;
      human?.sendKey(key);
    }),
    [runner],
  );

  const handleRefresh = React.useCallback(() => {
    if (runner) {
      runner.observationTime = 0;
    }

    const human = runner?.solver as Human;
    human?.sendKey('x');
  }, [runner]);

  return (
    <Section title="Game Controls" className={css.gameControls} info={<GameControlsHelp />}>
      {phase === 'solve' && (
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
      )}
    </Section>
  );
};
