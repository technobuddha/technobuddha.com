import React from 'react';
import { type Phase, type Runner } from '@technobuddha/maze';

import { Section } from '../section/index.ts';

import css from './demo-mode.module.css' with { type: 'css' };

export type DemoModeProps = {
  readonly runner: Runner | undefined;
  readonly children?: never;
};

export const DemoMode: React.FC<DemoModeProps> = ({ runner }) => {
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
    <Section title="Demonstration Mode" className={css.demoMode}>
      {phase}
    </Section>
  );
};
