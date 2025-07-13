import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { MenuItem, Select } from '#control';

import { type MazeGeneratorProperties } from '../../generator/index.ts';

import { type GeneratorProducer } from '../maze-maker.tsx';
import { braids, generators } from '../selection.ts';

import { Section } from './section.tsx';
import { fixUndefined, restoreUndefined, UNDEFINED } from './undefined.ts';

type GeneratorSectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: GeneratorProducer) => void;
  readonly children?: never;
};

type Selection = (typeof generators)[number];
type Variation = Selection['variations'][number];
type Braiding = (typeof braids)[number];

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({ className, onChange }) => {
  const [generator, setGenerator] = React.useState<Selection>();
  const [variation, setVariation] = React.useState<Variation>();
  const [braid, setBraid] = React.useState<Braiding>();

  const handleGeneratorChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    const g = generators.find((g) => g.title === title);

    setGenerator(g);

    if (g && g.variations.length === 1) {
      setVariation(g.variations[0]);
    } else {
      setVariation(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback(
    (value: string) => {
      const title = restoreUndefined(value);
      const v = generator?.variations.find((v) => v.title === title);

      setVariation(v);
    },
    [generator],
  );

  const handleBraidChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    setBraid(braids.find((b) => b.title === title));
  }, []);

  React.useEffect(() => {
    const { braiding } = braid ?? randomWeightedPick(braids)!;

    if (generator) {
      if (variation) {
        onChange?.(() => ({
          maker: (props: MazeGeneratorProperties) => variation.maker({ braiding, ...props }),
          title: variation.title,
        }));
      } else {
        onChange?.(() => {
          const v = randomWeightedPick(generator.variations)!;
          return {
            maker: (props: MazeGeneratorProperties) => v.maker({ braiding, ...props }),
            title: v.title,
          };
        });
      }
    } else {
      onChange?.(() => {
        const g = randomWeightedPick(generators)!;
        const v = randomWeightedPick(g.variations)!;

        return {
          maker: (props: MazeGeneratorProperties) => v.maker({ braiding, ...props }),
          title: v.title,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generator, variation, braid]);

  return (
    <Section className={className} title="Generator">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select
          label="Algorithm"
          value={fixUndefined(generator?.title)}
          onChange={handleGeneratorChange}
        >
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
          value={fixUndefined(variation?.title)}
          onChange={handleVariationChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {generator?.variations
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
      </div>
      <Select label="Braid" value={fixUndefined(braid?.title)} onChange={handleBraidChange}>
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
