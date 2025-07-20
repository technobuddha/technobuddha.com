import React from 'react';
import { Step, StepLabel, Stepper } from '@mui/material';
import { memoize } from 'lodash-es';

import { Button } from '#control';
import { type Phase, phases, type PlayMode, playModeIcons, type Runner } from '#maze/runner';

import { phasePlayModeDialog } from './phase-play-mode-dialog.tsx';

import css from './phase-controls.module.css';

export type PhaseControlsProps = {
  readonly runner?: Runner;

  readonly onPhasePlayModeChange?: (this: void, phase: Phase, value: PlayMode) => void;
  readonly children?: never;
};

export const PhaseControls: React.FC<PhaseControlsProps> = ({ runner, onPhasePlayModeChange }) => {
  const [phase, setPhase] = React.useState<Phase | undefined>(runner?.phase);

  const myPhases = React.useMemo(
    () => phases.filter((phase) => phase !== 'maze' && phase !== 'observe' && phase !== 'exit'),
    [],
  );

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
  const handlePhasePlayModeChange = React.useCallback(
    memoize((p: Phase) => (_event: React.MouseEvent<HTMLButtonElement>) => {
      const phase = p === 'final' ? 'observe' : p;

      phasePlayModeDialog({ phase, value: runner?.phasePlayMode?.[phase] })
        .then((result) => {
          onPhasePlayModeChange?.(phase, result);
        })
        .catch(() => undefined);
    }),
    [runner, onPhasePlayModeChange],
  );

  const activeStep = phases.indexOf(phase ?? 'final') - 1;

  return (
    <div className={css.phaseControls}>
      <Stepper className={css.stepper} activeStep={activeStep} alternativeLabel>
        {myPhases.map((phase) => (
          <Step className={css.step} key={phase} active={phase === runner?.phase}>
            <StepLabel className={css.label}>
              <Button
                variant="text"
                className={css.button}
                onClick={handlePhasePlayModeChange(phase)}
              >
                <div className={css.content}>
                  <div className={css.icon}>
                    {
                      playModeIcons[
                        runner?.phasePlayMode?.[phase === 'final' ? 'observe' : phase] ?? 'pause'
                      ]
                    }
                  </div>
                  <div className={css.caption}>{phase} </div>
                </div>
              </Button>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
