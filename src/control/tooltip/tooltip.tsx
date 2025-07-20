import React from 'react';
import { Tooltip as MuiTooltip, type TooltipProps as MuiTooltipProps } from '@mui/material';

export type TooltipProps = {
  readonly title: MuiTooltipProps['title'];
  readonly placement?: MuiTooltipProps['placement'];

  readonly children: MuiTooltipProps['children'];
};

export const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => (
  <MuiTooltip {...props}>{children}</MuiTooltip>
);
