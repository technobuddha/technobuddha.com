import React from 'react';
import { memoize } from 'lodash-es';

import { Button, Step, StepLabel, Stepper } from '#control';
import { type Phase, phases, type PlayMode, playModeIcons, type Runner } from '#maze/runner';

import { Section } from '../section/index.ts';

import { PhaseControlsHelp } from './phase-controls.help.tsx';
import { phasePlayModeDialog } from './phase-play-mode-dialog.tsx';

import css from './phase-controls.module.css';

export type PhaseControlsProps = {
  readonly runner?: Runner;

  readonly onPhasePlayModeChange?: (this: void, phase: Phase, value: PlayMode) => void;
  readonly children?: never;
};

export const PhaseControls: React.FC<PhaseControlsProps> = ({ runner, onPhasePlayModeChange }) => {
  const [phase, setPhase] = React.useState<Phase | undefined>(runner?.phase);
  const help = React.useMemo(() => <PhaseControlsHelp />, []);

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
    memoize((p: Phase) => () => {
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
    <Section className={css.phaseControls} info={help} title="Phase">
      <Stepper className={css.stepper} activeStep={activeStep} alternativeLabel>
        {myPhases.map((phase) => (
          <Step
            key={phase}
            onClick={handlePhasePlayModeChange(phase)}
            className={css.step}
            active={phase === runner?.phase}
          >
            <StepLabel className={css.label}>
              <Button variant="text" className={css.button}>
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
    </Section>
  );
};
