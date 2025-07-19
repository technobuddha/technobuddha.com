import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { MenuItem, Select } from '#control';
import { type MazeGeneratorProperties } from '#maze/generator';

import { type GeneratorProducer } from './maze-maker.tsx';
import { braids, generators } from './selection.ts';

import { Section } from './section.tsx';
import { fixUndefined, restoreUndefined, UNDEFINED } from './undefined.ts';

type GeneratorSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: GeneratorProducer) => void;
  readonly children?: never;
};

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({ className, onChange }) => {
  const [generator, setGenerator] = React.useState<string>();
  const [variation, setVariation] = React.useState<string>();
  const [braid, setBraid] = React.useState<string>();
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

  const handleGeneratorChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    setGenerator(title);

    const g = generators.find((g) => g.title === title);
    if (g && g.variations.length === 1) {
      setVariation(g.variations[0].title);
    } else {
      setVariation(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback((value: string) => {
    setVariation(restoreUndefined(value));
  }, []);

  const handleBraidChange = React.useCallback((value: string) => {
    setBraid(restoreUndefined(value));
  }, []);

  React.useEffect(() => {
    onChange?.(() => {
      const currGenerator =
        generators.find((g) => g.title === generator) ?? randomWeightedPick(generators)!;
      const currVariation =
        currGenerator.variations.find((v) => v.title === variation) ??
        randomWeightedPick(currGenerator.variations)!;
      const currBraid = braids.find((b) => b.title === braid) ?? randomWeightedPick(braids)!;
      const { braiding } = currBraid;

      const titles: string[] = [currGenerator.title];
      if (currVariation.title !== currGenerator.title) {
        titles.push(currVariation.title);
      }

      if (currBraid.title !== 'None') {
        titles.push(`[${currBraid.title}]`);
      }

      const title = titles.join(' ');

      return {
        maker: (props: MazeGeneratorProperties) => currVariation.maker({ braiding, ...props }),
        title,
      };
    });
  }, [generator, variation, braid, onChange, hmr]);

  return (
    <Section className={className} title="Generator">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select label="Algorithm" value={fixUndefined(generator)} onChange={handleGeneratorChange}>
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {generators
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Variation"
          disabled={!generator}
          value={fixUndefined(variation)}
          onChange={handleVariationChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {generators
            .find((g) => g.title === generator)
            ?.variations.sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
      </div>
      <Select label="Braid" value={fixUndefined(braid)} onChange={handleBraidChange}>
        <MenuItem key={UNDEFINED} value={UNDEFINED}>
          (random)
        </MenuItem>
        {braids.map((m) => (
          <MenuItem key={m.title} value={m.title}>
            {m.title}
          </MenuItem>
        ))}
      </Select>
    </Section>
  );
};
