import React from 'react';
import { type ColorResult, Sketch } from '@uiw/react-color';
import Color from 'colorjs.io';

export type ColorPickerProps = {
  readonly className?: string;
  readonly value: string;
  readonly onChange?: (color: string) => void;

  readonly children?: never;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ className, value, onChange }) => {
  const color = React.useMemo<string>(
    () => new Color(value).to('srgb').toString({ format: 'hex' }),
    [value],
  );

  const handleColorChange = React.useCallback(
    (newColor: ColorResult) => {
      const cString = `rgba(${newColor.rgba.r}, ${newColor.rgba.g}, ${newColor.rgba.b}, ${newColor.rgba.a})`;
      onChange?.(new Color(cString).to('oklch').toString());
    },
    [onChange],
  );

  return (
    <Sketch
      className={className}
      color={color}
      presetColors={false}
      onChange={handleColorChange}
      width={250}
    />
  );
};
