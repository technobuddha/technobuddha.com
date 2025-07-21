import React from 'react';
import { Box as MuiBox, type BoxProps as MuiBoxProps } from '@mui/material';

export type BoxProps = {
  readonly style?: MuiBoxProps['style'];
  readonly className?: MuiBoxProps['className'];
  readonly component?: MuiBoxProps['component'];

  readonly marginTop?: MuiBoxProps['marginTop'];
  readonly marginRight?: MuiBoxProps['marginRight'];
  readonly marginBottom?: MuiBoxProps['marginBottom'];
  readonly marginLeft?: MuiBoxProps['marginLeft'];
  readonly marginY?: MuiBoxProps['marginY'];
  readonly marginX?: MuiBoxProps['marginX'];

  readonly display?: MuiBoxProps['display'];
  readonly flexDirection?: MuiBoxProps['flexDirection'];

  readonly onKeyUp?: MuiBoxProps['onKeyUp'];
  readonly onMouseOver?: MuiBoxProps['onMouseOver'];
  readonly onMouseLeave?: MuiBoxProps['onMouseLeave'];

  readonly children?: MuiBoxProps['children'];
};

export const Box: React.FC<BoxProps> = ({ children, ...props }) => (
  <MuiBox {...props}>{children}</MuiBox>
);
