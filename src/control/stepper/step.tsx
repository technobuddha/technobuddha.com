import React from 'react';
import { Step as MuiStep, type StepProps as MuiStepProps } from '@mui/material';

export type StepProps = {
  readonly style?: MuiStepProps['style'];
  readonly className?: MuiStepProps['className'];
  readonly active?: boolean;

  readonly children?: MuiStepProps['children'];
};

export const Step: React.FC<StepProps> = ({ children, ...props }) => (
  <MuiStep {...props}>{children}</MuiStep>
);
