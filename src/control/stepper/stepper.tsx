import React from 'react';
import { Stepper as MuiStepper, type StepperProps as MuiStepperProps } from '@mui/material';

export type StepperProps = {
  readonly style?: MuiStepperProps['style'];
  readonly className?: MuiStepperProps['className'];
  readonly activeStep?: MuiStepperProps['activeStep'];
  readonly alternativeLabel?: MuiStepperProps['alternativeLabel'];

  readonly children?: MuiStepperProps['children'];
};

export const Stepper: React.FC<StepperProps> = ({ children, ...props }) => (
  <MuiStepper {...props}>{children}</MuiStepper>
);
