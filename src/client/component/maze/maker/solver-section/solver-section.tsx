import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { MenuItem, Select } from '#control';
import { type MazeSolverProperties } from '#maze/solver';

import { type SolverProducer } from '../maze-maker.tsx';
import { Section } from '../section/index.ts';
import { solvers } from '../selection.ts';

type SolverSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: SolverProducer) => void;
  readonly children?: never;
};

export const SolverSection: React.FC<SolverSectionProps> = ({ className, onChange }) => {
  const [solver, setSolver] = React.useState<string>();
  const [variation, setVariation] = React.useState<string>();
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

  const handleSolverChange = React.useCallback((value: string) => {
    setSolver(value);

    const g = solvers.find((g) => g.title === value);

    if (g && g.variations.length === 1) {
      setVariation(g.variations[0].title);
    } else {
      setVariation(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback((value: string) => {
    setVariation(value);
  }, []);

  React.useEffect(() => {
    onChange?.(() => {
      const currSolver = solvers.find((g) => g.title === solver) ?? randomWeightedPick(solvers)!;
      const currVariation =
        currSolver.variations.find((v) => v.title === variation) ??
        randomWeightedPick(currSolver.variations)!;

      const titles: string[] = [currSolver.title];

      if (currVariation.title !== currSolver.title) {
        titles.push(currVariation.title);
      }

      const title = titles.join(' ');

      return {
        maker: (props: MazeSolverProperties) => currVariation.maker(props),
        title,
      };
    });
  }, [solver, variation, onChange, hmr]);

  return (
    <Section className={className} title="Solver">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select
          label="Algorithm"
          allowUndefined="(random)"
          value={solver}
          onChange={handleSolverChange}
        >
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
          allowUndefined="(random)"
          value={variation}
          onChange={handleVariationChange}
        >
          {solvers
            .find((s) => s.title === solver)
            ?.variations.sort((a, b) => a.title.localeCompare(b.title))
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
