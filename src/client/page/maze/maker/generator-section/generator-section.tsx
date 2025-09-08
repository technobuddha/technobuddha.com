import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { MenuItem, Select } from '#control';
import { type MazeGeneratorProperties } from '#maze/generator';
import { useHMR } from '#maze/library';

import { type GeneratorProducer } from '../maze-maker.tsx';
import { Section } from '../section/index.ts';
import { braids, generators } from '../selection.ts';

import { GeneratorSectionHelp } from './generator-section.help.tsx';

type GeneratorSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: GeneratorProducer) => void;
  readonly children?: never;
};

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({ className, onChange }) => {
  const [generator, setGenerator] = React.useState<string>();
  const [variation, setVariation] = React.useState<string>();
  const [braid, setBraid] = React.useState<string>();
  const hmr = useHMR();

  const handleGeneratorChange = React.useCallback((value: string) => {
    setGenerator(value);

    const g = generators.find((g) => g.title === value);
    if (g && g.variations.length === 1) {
      setVariation(g.variations[0].title);
    } else {
      setVariation(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback((value: string) => {
    setVariation(value);
  }, []);

  const handleBraidChange = React.useCallback((value: string) => {
    setBraid(value);
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
    <Section className={className} title="Generator" info={<GeneratorSectionHelp />}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select
          label="Algorithm"
          allowUndefined="(random)"
          value={generator}
          onChange={handleGeneratorChange}
        >
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
          allowUndefined="(random)"
          value={variation}
          onChange={handleVariationChange}
        >
          {generators
            .find((g) => g.title === generator)
            ?.variations.sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
        <Select label="Braid" value={braid} allowUndefined="(random)" onChange={handleBraidChange}>
          {braids.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Section>
  );
};
