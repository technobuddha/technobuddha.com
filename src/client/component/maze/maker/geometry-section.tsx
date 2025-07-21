import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';

import { MenuItem, Select } from '#control';
import { type MazeProperties } from '#maze/geometry';

import { type GeometryProducer } from './maze-maker.tsx';
import { Section } from './section.tsx';
import { debugs, distances, geometries, wraparounds } from './selection.ts';

type GeometrySectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: GeometryProducer) => void;
  readonly children?: never;
};

export const GeometrySection: React.FC<GeometrySectionProps> = ({ className, onChange }) => {
  const [geometry, setGeometry] = React.useState<string>();
  const [variation, setVariation] = React.useState<string>();
  const [size, setSize] = React.useState<string>();
  const [wraparound, setWraparound] = React.useState<string>();
  const [debug, setDebug] = React.useState<string>();
  const [distance, setDistance] = React.useState<string>();
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

  const handleGeometryChange = React.useCallback((value: string) => {
    const g = geometries.find((g) => g.title === value);

    setGeometry(value);

    if (g && g.variations.length === 1) {
      setVariation(g.variations[0].title);
    } else {
      setVariation(undefined);
    }

    if (g && g.sizes.length === 1) {
      setSize(g.sizes[0].title);
    } else {
      setSize(undefined);
    }
  }, []);

  const handleVariationChange = React.useCallback((value: string) => {
    setVariation(value);
  }, []);

  const handleSizeChange = React.useCallback((value: string) => {
    setSize(value);
  }, []);

  const handleDebugChange = React.useCallback((value: string) => {
    setDebug(value);
  }, []);

  const handleWraparoundChange = React.useCallback((value: string) => {
    setWraparound(value);
  }, []);

  const handleDistanceChange = React.useCallback((value: string) => {
    setDistance(value);
  }, []);

  React.useEffect(() => {
    onChange?.(() => {
      const currGeometry =
        geometries.find((g) => g.title === geometry) ?? randomWeightedPick(geometries)!;
      const currVariation =
        currGeometry.variations.find((v) => v.title === variation) ??
        randomWeightedPick(currGeometry.variations)!;
      const currSize =
        currGeometry.sizes.find((s) => s.title === size) ?? randomWeightedPick(currGeometry.sizes)!;
      const currWraparound =
        wraparounds.find((w) => w.title === wraparound) ?? randomWeightedPick(wraparounds)!;
      const currDistance =
        distances.find((d) => d.title === distance) ?? randomWeightedPick(distances)!;
      const currDebug = debugs.find((d) => d.title === debug) ?? randomWeightedPick(debugs)!;

      const { wrapHorizontal, wrapVertical } = currWraparound;
      const { showDistances } = currDistance;
      const { cellSize, wallSize, voidSize } = currSize;
      const { showCoordinates, showKind } = currDebug;

      const titles: string[] = [currGeometry.title];

      if (currVariation.title !== currGeometry.title) {
        titles.push(currVariation.title);
      }

      if (currSize.title !== currGeometry.title) {
        titles.push(currSize.title);
      }

      if (currWraparound.title !== 'None') {
        titles.push(`[Wraparound ${currWraparound.title}]`);
      }

      const title = titles.join(' ');

      return {
        maker: (props: MazeProperties) =>
          currVariation.maker({
            cellSize,
            wallSize,
            voidSize,
            showCoordinates,
            showKind,
            wrapHorizontal,
            wrapVertical,
            showDistances,
            ...props,
          }),
        title,
      };
    });
  }, [geometry, variation, size, wraparound, distance, debug, onChange, hmr]);

  return (
    <Section className={className} title="Geometry">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select
          label="Shape"
          allowUndefined="(random)"
          value={geometry}
          onChange={handleGeometryChange}
        >
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
          allowUndefined="(random)"
          value={variation}
          onChange={handleVariationChange}
        >
          {geometries
            .find((g) => g.title === geometry)
            ?.variations.sort((a, b) => a.title.localeCompare(b.title))
            .map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
        <Select
          label="Size"
          disabled={!geometry}
          allowUndefined="(random)"
          value={size}
          onChange={handleSizeChange}
        >
          {geometries
            .find((g) => g.title === geometry)
            ?.sizes.map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
        </Select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
        <Select
          label="Wraparound"
          allowUndefined="(random)"
          value={wraparound}
          onChange={handleWraparoundChange}
        >
          {wraparounds.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
        <Select
          label="Show Distances"
          allowUndefined="(random)"
          value={distance}
          onChange={handleDistanceChange}
        >
          {distances.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
        <Select label="Debug" allowUndefined="(random)" value={debug} onChange={handleDebugChange}>
          {debugs.map((m) => (
            <MenuItem key={m.title} value={m.title}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Section>
  );
};
