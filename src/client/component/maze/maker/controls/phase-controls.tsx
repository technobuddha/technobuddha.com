import React from 'react';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { memoize } from 'lodash-es';

import { type Phase, phases } from '../../runner/phase.ts';
import { phasePlayModeDialog } from '../phase-play-mode-dialog.tsx';
import { type PlayMode, playModeIcons } from '../../runner/play-mode.tsx';
import { type Runner } from '../../runner/runner.ts';

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
              <Button className={css.button} onClick={handlePhasePlayModeChange(phase)}>
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
