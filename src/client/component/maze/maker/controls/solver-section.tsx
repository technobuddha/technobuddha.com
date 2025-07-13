import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { MenuItem, Select } from '#control';

import { type MazeSolverProperties } from '../../solver/index.ts';

import { type SolverProducer } from '../maze-maker.tsx';
import { solvers } from '../selection.ts';

import { Section } from './section.tsx';
import { fixUndefined, restoreUndefined, UNDEFINED } from './undefined.ts';

type SolverSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: SolverProducer) => void;
  readonly children?: never;
};

type Selection = (typeof solvers)[number];
type Variation = Selection['variations'][number];

export const SolverSection: React.FC<SolverSectionProps> = ({ className, onChange }) => {
  const [solver, setSolver] = React.useState<Selection>();
  const [variation, setVariation] = React.useState<Variation>();

  const handleSolverChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    const g = solvers.find((g) => g.title === title);

    setSolver(g);

    if (g && g.variations.length === 1) {
      setVariation(g.variations[0]);
    } else {
      setVariation(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback(
    (value: string) => {
      const title = restoreUndefined(value);
      const v = solver?.variations.find((v) => v.title === title);

      setVariation(v);
    },
    [solver],
  );

  React.useEffect(() => {
    if (solver) {
      if (variation) {
        onChange?.(() => ({
          maker: (props: MazeSolverProperties) => variation.maker(props),
          title: variation.title,
        }));
      } else {
        onChange?.(() => {
          const v = randomWeightedPick(solver.variations)!;
          return {
            maker: (props: MazeSolverProperties) => v.maker(props),
            title: v.title,
          };
        });
      }
    } else {
      onChange?.(() => {
        const g = randomWeightedPick(solvers)!;
        const v = randomWeightedPick(g.variations)!;

        return {
          maker: (props: MazeSolverProperties) => v.maker(props),
          title: v.title,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solver, variation]);

  return (
    <Section className={className} title="Solver">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select label="Algorithm" value={fixUndefined(solver?.title)} onChange={handleSolverChange}>
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {solvers
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Variation"
          disabled={!solver}
          value={fixUndefined(variation?.title)}
          onChange={handleVariationChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {solver?.variations
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
      </div>
    </Section>
  );
};
