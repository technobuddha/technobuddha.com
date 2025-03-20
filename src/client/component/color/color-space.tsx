import React from 'react';
import Slider from '@mui/material/Slider';
import { type RGB, toRGB } from '@technobuddha/color';

import css from './color-space.module.css';

type ColorSpaceProps<T extends string> = {
  readonly colorSpace: Record<T, Attributes>;
  readonly color: Record<T, number>;
  onChange?(this: void, color: RGB): void;
  readonly children?: never;
};

type Attributes = {
  min: number;
  max: number;
};

export function ColorSpace<T extends string>({
  colorSpace,
  color,
  onChange,
}: ColorSpaceProps<T>): React.ReactElement {
  const handleChange =
    (key: T) =>
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (_: React.ChangeEvent<{}>, value: number | number[] | undefined) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange?.(toRGB({ ...color, [key]: value as number } as any));
    };

  return (
    <div className={css.colorSpace}>
      {Object.entries<Attributes>(colorSpace).map(([key, attributes], i) => (
        <Slider
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          value={color[key as T]}
          onChange={handleChange(key as T)}
          min={attributes.min}
          max={attributes.max}
        />
      ))}
    </div>
  );
}
