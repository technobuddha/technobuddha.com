import React from 'react';
import { Slider as MuiSlider, type SliderProps as MuiSliderProps } from '@mui/material';

export type SliderProps = {
  readonly value: MuiSliderProps['value'];
  readonly min: MuiSliderProps['min'];
  readonly max: MuiSliderProps['max'];

  readonly onChange: MuiSliderProps['onChange'];

  readonly children?: MuiSliderProps['children'];
};

export const Slider: React.FC<SliderProps> = ({ children, ...props }) => (
  <MuiSlider {...props}>{children}</MuiSlider>
);
