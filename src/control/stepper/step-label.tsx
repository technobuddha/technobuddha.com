import React from 'react';
import { StepLabel as MuiStepLabel, type StepLabelProps as MuiStepLabelProps } from '@mui/material';

export type StepLabelProps = {
  readonly style?: MuiStepLabelProps['style'];
  readonly className?: MuiStepLabelProps['className'];
  readonly children?: MuiStepLabelProps['children'];
};

export const StepLabel: React.FC<StepLabelProps> = ({ children, ...props }) => (
  <MuiStepLabel {...props}>{children}</MuiStepLabel>
);
