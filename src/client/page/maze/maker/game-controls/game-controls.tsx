import React from 'react';

import { type Phase, type Runner } from '#maze/runner';

import { MovementControls } from './movement-controls.tsx';

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

  return (
    <div className={css.gameControls}>
      {phase === 'solve' && <MovementControls runner={runner} />}
    </div>
  );
};
