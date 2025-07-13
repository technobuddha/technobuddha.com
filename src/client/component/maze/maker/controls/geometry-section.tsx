import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { Checkbox, MenuItem, Select } from '#control';

import { type MazeProperties } from '../../geometry/index.ts';

import { type GeometryProducer } from '../maze-maker.tsx';
import { distances, geometries, wraparounds } from '../selection.ts';

import { Section } from './section.tsx';
import { fixUndefined, restoreUndefined, UNDEFINED } from './undefined.ts';

type GeometrySectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: GeometryProducer) => void;
  readonly children?: never;
};

type Selection = (typeof geometries)[number];
type Variation = Selection['variations'][number];
type Size = Selection['sizes'][number];
type Wraparound = (typeof wraparounds)[number];
type Distance = (typeof distances)[number];

export const GeometrySection: React.FC<GeometrySectionProps> = ({ className, onChange }) => {
  const [geometry, setGeometry] = React.useState<Selection>();
  const [variation, setVariation] = React.useState<Variation>();
  const [size, setSize] = React.useState<Size>();
  const [wraparound, setWraparound] = React.useState<Wraparound>();
  const [showCoordinates, setShowCoordinates] = React.useState(false);
  const [distance, setDistance] = React.useState<Distance>();

  const handleGeometryChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    const g = geometries.find((g) => g.title === title);

    setGeometry(g);

    if (g && g.variations.length === 1) {
      setVariation(g.variations[0]);
    } else {
      setVariation(undefined);
    }

    if (g && g.sizes.length === 1) {
      setSize(g.sizes[0]);
    } else {
      setSize(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback(
    (value: string) => {
      const title = restoreUndefined(value);
      const v = geometry?.variations.find((v) => v.title === title);

      setVariation(v);
    },
    [geometry],
  );

  const handleSizeChange = React.useCallback(
    (value: string) => {
      const title = restoreUndefined(value);
      const s = geometry?.sizes.find((s) => s.title === title);

      setSize(s);
    },
    [geometry],
  );

  const handleCoordinatesChange = React.useCallback((checked: boolean) => {
    setShowCoordinates(checked);
  }, []);

  const handleWraparoundChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    const w = wraparounds.find((w) => w.title === title);

    setWraparound(w);
  }, []);

  const handleDistanceChange = React.useCallback((value: string) => {
    const title = restoreUndefined(value);
    const d = distances.find((d) => d.title === title);

    setDistance(d);
  }, []);

  React.useEffect(() => {
    const { wrapHorizontal, wrapVertical } = wraparound ?? randomWeightedPick(wraparounds)!;
    const { showDistances } = distance ?? randomWeightedPick(distances)!;

    if (geometry) {
      const { cellSize, wallSize, voidSize } = size ?? randomWeightedPick(geometry.sizes)!;

      if (variation) {
        onChange?.(() => ({
          maker: (props: MazeProperties) =>
            variation.maker({
              cellSize,
              wallSize,
              voidSize,
              showCoordinates,
              wrapHorizontal,
              wrapVertical,
              showDistances,
              ...props,
            }),
          title: variation.title,
        }));
      } else {
        onChange?.(() => {
          const v = randomWeightedPick(geometry.variations)!;
          return {
            maker: (props: MazeProperties) =>
              v.maker({
                cellSize,
                wallSize,
                voidSize,
                showCoordinates,
                wrapHorizontal,
                wrapVertical,
                showDistances,
                ...props,
              }),
            title: v.title,
          };
        });
      }
    } else {
      onChange?.(() => {
        const g = randomWeightedPick(geometries)!;
        const v = randomWeightedPick(g.variations)!;
        const s = randomWeightedPick(g.sizes)!;

        return {
          maker: (props: MazeProperties) =>
            v.maker({
              cellSize: s.cellSize,
              wallSize: s.wallSize,
              voidSize: s.voidSize,
              showCoordinates,
              wrapHorizontal,
              wrapVertical,
              showDistances,
              ...props,
            }),
          title: v.title,
        };
      });
    }
  }, [onChange, geometry, variation, size, wraparound, showCoordinates, distance]);

  return (
    <Section className={className} title="Geometry">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select label="Shape" value={fixUndefined(geometry?.title)} onChange={handleGeometryChange}>
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {geometries
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Variation"
          disabled={!geometry}
          value={fixUndefined(variation?.title)}
          onChange={handleVariationChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {geometry?.variations
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Size"
          disabled={!geometry}
          value={fixUndefined(size?.title)}
          onChange={handleSizeChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {geometry?.sizes.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select
          label="Wraparound"
          value={fixUndefined(wraparound?.title)}
          onChange={handleWraparoundChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {wraparounds.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
        <Select
          label="Show Distances"
          value={fixUndefined(distance?.title)}
          onChange={handleDistanceChange}
        >
          <MenuItem key={UNDEFINED} value={UNDEFINED}>
            (random)
          </MenuItem>
          {distances.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Checkbox
        label="Show Coordinates"
        checked={showCoordinates}
        onChange={handleCoordinatesChange}
      />
    </Section>
  );
};
