import React from 'react';
import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from '@mui/material';

export type TypographyProps = {
  readonly className?: string;
  readonly color?: MuiTypographyProps['color'];
  readonly variant?: MuiTypographyProps['variant'];

  readonly children?: MuiTypographyProps['children'];
};

export const Typography: React.FC<TypographyProps> = ({ children, ...props }) => (
  <MuiTypography {...props}>{children}</MuiTypography>
);
