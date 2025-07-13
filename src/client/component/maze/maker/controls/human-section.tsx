import React from 'react';

import { Checkbox } from '#control';

import { Human, type MazeSolverProperties } from '../../solver/index.ts';

import { type SolverProducer } from '../maze-maker.tsx';

import { Section } from './section.tsx';

type HumanSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: SolverProducer) => void;
  readonly children?: never;
};

export const HumanSection: React.FC<HumanSectionProps> = ({ className, onChange }) => {
  const [finalDestination, setFinalDestination] = React.useState(true);
  const [markVisited, setMarkVisited] = React.useState(false);
  const [markDeadEnds, setMarkDeadEnds] = React.useState(true);
  const [hideReverse, setHideReverse] = React.useState(false);

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
      title: 'Human Options',
    }));
  }, [finalDestination, markVisited, markDeadEnds, hideReverse, onChange]);

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
