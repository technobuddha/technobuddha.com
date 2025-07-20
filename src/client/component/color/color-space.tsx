import React from 'react';
import { Slider } from '@mui/material';
import { type ColorSpecification, type RGB, toRGB } from '@technobuddha/color';

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
  const handleChange = (key: T) => (_: Event, value: number | number[]) => {
    onChange?.(toRGB({ ...color, [key]: value as number } as ColorSpecification));
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
