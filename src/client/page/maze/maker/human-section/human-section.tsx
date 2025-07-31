import React from 'react';

import { Checkbox } from '#control';
import { type Runner } from '#maze/runner';
import { Human, type MazeSolverProperties } from '#maze/solver';

import { type SolverProducer } from '../maze-maker.tsx';
import { Section } from '../section/index.ts';

type HumanSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: SolverProducer) => void;
  readonly runner?: Runner;
  readonly children?: never;
};

export const HumanSection: React.FC<HumanSectionProps> = ({ className, onChange, runner }) => {
  const [finalDestination, setFinalDestination] = React.useState(true);
  const [markVisited, setMarkVisited] = React.useState(false);
  const [markDeadEnds, setMarkDeadEnds] = React.useState(true);
  const [hideReverse, setHideReverse] = React.useState(false);
  const [hmr, setHMR] = React.useState(0);

  React.useEffect(() => {
    const handleHMR = (): void => {
      setHMR((prev) => prev + 1);
    };

    import.meta.hot?.on('vite:beforeUpdate', handleHMR);

    return () => {
      import.meta.hot?.off('vite:beforeUpdate', handleHMR);
    };
  }, []);

  const handleFinalDestinationChange = React.useCallback((checked: boolean) => {
    setFinalDestination(checked);
  }, []);

  const handleMarkVisitedChange = React.useCallback((checked: boolean) => {
    setMarkVisited(checked);
  }, []);

  const handleMarkDeadEndsChange = React.useCallback((checked: boolean) => {
    setMarkDeadEnds(checked);
  }, []);

  const handleHideReverseChange = React.useCallback((checked: boolean) => {
    setHideReverse(checked);
  }, []);

  React.useEffect(() => {
    if (runner?.solver instanceof Human) {
      const human = runner.solver;

      human.options.finalDestination = finalDestination;
      human.options.markVisited = markVisited;
      human.options.markDeadEnds = markDeadEnds;
      human.options.hideReverse = hideReverse;
    }

    onChange?.(() => ({
      maker: (props: MazeSolverProperties) =>
        new Human({
          ...props,
          options: {
            finalDestination,
            markVisited,
            markDeadEnds,
            hideReverse,
          },
        }),
      title: 'Human',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalDestination, markVisited, markDeadEnds, hideReverse, onChange, hmr]);

  return (
    <Section className={className} title="human">
      <Checkbox
        label="Final Destination"
        checked={finalDestination}
        onChange={handleFinalDestinationChange}
      />
      <Checkbox label="Mark Visited" checked={markVisited} onChange={handleMarkVisitedChange} />
      <Checkbox label="Mark Dead Ends" checked={markDeadEnds} onChange={handleMarkDeadEndsChange} />
      <Checkbox label="Hide Reverse" checked={hideReverse} onChange={handleHideReverseChange} />
    </Section>
  );
};
