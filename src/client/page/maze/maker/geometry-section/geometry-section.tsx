import React from 'react';
import { randomWeightedPick } from '@technobuddha/library';
import { defaultColors, type MazeColors, type MazeProperties } from '@technobuddha/maze';
import { useHMR } from '@technobuddha/react';
import clsx from 'clsx';
import { GiPalette, GiSpottedBug } from 'react-icons/gi';

import { IconButton, MenuItem, Select, Tooltip } from '#control';

import { type GeometryProducer } from '../maze-maker.tsx';
import { Section } from '../section/index.ts';
import { distances, geometries, wraparounds } from '../selection.ts';

import { type Debug, defaultDebug } from './debug.ts';
import { debugDialog } from './debug-dialog.tsx';
import { GeometrySectionHelp } from './geometry-section.help.tsx';
import { paletteDialog } from './palette-dialog.tsx';

import css from './geometry-section.module.css' with { type: 'css' };

type GeometrySectionProps = {
  readonly className?: string;
  readonly onChange?: (this: void, producer: GeometryProducer) => void;
  readonly children?: never;
};

export const GeometrySection: React.FC<GeometrySectionProps> = ({ className, onChange }) => {
  const [shape, setShape] = React.useState<string>();
  const [variation, setVariation] = React.useState<string>();
  const [size, setSize] = React.useState<string>();
  const [wraparound, setWraparound] = React.useState<string>();
  const [debug, setDebug] = React.useState<Debug>(defaultDebug);
  const [color, setColor] = React.useState<MazeColors>(defaultColors);
  const [distance, setDistance] = React.useState<string>();
  const hmr = useHMR();

  const handleShapeChange = React.useCallback((value: string) => {
    const g = geometries.find((g) => g.title === value);

    setShape(value);

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

  const handleWraparoundChange = React.useCallback((value: string) => {
    setWraparound(value);
  }, []);

  const handleDistanceChange = React.useCallback((value: string) => {
    setDistance(value);
  }, []);

  const handlePalette = React.useCallback(() => {
    paletteDialog({ value: color })
      .then((colors: MazeColors) => {
        setColor(colors);
      })
      .catch(() => {});
  }, [color]);

  const handleDebug = React.useCallback(() => {
    debugDialog({ value: debug })
      .then((result) => {
        setDebug(result);
      })
      .catch(() => {});
  }, [debug]);

  React.useEffect(() => {
    onChange?.(() => {
      const currShape =
        geometries.find((g) => g.title === shape) ?? randomWeightedPick(geometries)!;
      const currVariation =
        currShape.variations.find((v) => v.title === variation) ??
        randomWeightedPick(currShape.variations)!;
      const currSize =
        currShape.sizes.find((s) => s.title === size) ?? randomWeightedPick(currShape.sizes)!;
      const currWraparound =
        wraparounds.find((w) => w.title === wraparound) ?? randomWeightedPick(wraparounds)!;
      const currDistance =
        distances.find((d) => d.title === distance) ?? randomWeightedPick(distances)!;

      const { wrapHorizontal, wrapVertical } = currWraparound;
      const { showDistances } = currDistance;
      const { cellSize, wallSize, voidSize } = currSize;
      const { showBridges, showCoordinates, showKind, announceMaze } = debug;

      const titles: string[] = [currShape.title];

      if (currVariation.title !== currShape.title) {
        titles.push(currVariation.title);
      }

      if (currSize.title !== currShape.title) {
        titles.push(currSize.title);
      }

      if (currWraparound.title !== 'None') {
        titles.push(`[Wraparound ${currWraparound.title}]`);
      }

      const title = titles.join(' ');

      return {
        announceMaze,
        maker: (props: MazeProperties) =>
          currVariation.maker({
            cellSize,
            wallSize,
            voidSize,
            showBridges,
            showCoordinates,
            showKind,
            wrapHorizontal,
            wrapVertical,
            showDistances,
            color,
            ...props,
          }),
        title,
      };
    });
  }, [shape, variation, size, wraparound, distance, debug, color, onChange, hmr]);

  return (
    <Section
      className={clsx(css.geometrySection, className)}
      title="Geometry"
      info={<GeometrySectionHelp />}
    >
      <div className={css.row}>
        <div className={css.item}>
          <Select
            label="Shape"
            allowUndefined="(random)"
            value={shape}
            onChange={handleShapeChange}
          >
            {geometries
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((m) => (
                <MenuItem key={m.title} value={m.title}>
                  {m.title}
                </MenuItem>
              ))}
          </Select>
        </div>
        <div className={css.item}>
          <Select
            label="Variation"
            disabled={!shape}
            allowUndefined="(random)"
            value={variation}
            onChange={handleVariationChange}
          >
            {geometries
              .find((g) => g.title === shape)
              ?.variations.sort((a, b) => a.title.localeCompare(b.title))
              .map((m) => (
                <MenuItem key={m.title} value={m.title}>
                  {m.title}
                </MenuItem>
              ))}
          </Select>
        </div>
        <div className={css.item}>
          <Select
            label="Size"
            disabled={!shape}
            allowUndefined="(random)"
            value={size}
            onChange={handleSizeChange}
          >
            {geometries
              .find((g) => g.title === shape)
              ?.sizes.map((m) => (
                <MenuItem key={m.title} value={m.title}>
                  {m.title}
                </MenuItem>
              ))}
          </Select>
        </div>
      </div>
      <div className={css.row}>
        <div className={css.item}>
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
        </div>
        <div className={css.item}>
          <Select
            label="Distances"
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
        </div>
        <div className={clsx(css.item, css.buttons)}>
          <Tooltip title="Change Maze Colors">
            <IconButton onClick={handlePalette}>
              <GiPalette />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Diagnostics to the Maze">
            <IconButton onClick={handleDebug}>
              <GiSpottedBug />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Section>
  );
};
