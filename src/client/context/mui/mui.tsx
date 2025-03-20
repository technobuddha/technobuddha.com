import React from 'react';
import { useTheme as muiUseTheme } from '@mui/material';
import {
  jssPreset,
  makeStyles as muiMakeStyles,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from '@mui/styles';
import { type ClassNameMap, type Styles, type WithStylesOptions } from '@mui/styles/withStyles';
import { create } from 'jss';

import { type Theme } from '#settings/mui-theme';
import { theme } from '#settings/mui-theme';

const jss = create({ plugins: jssPreset().plugins });

type ThemeProviderProps = {
  readonly children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => (
  <MuiThemeProvider theme={theme}>
    <StylesProvider jss={jss}>{children}</StylesProvider>
  </MuiThemeProvider>
);

export function useTheme(): Theme {
  return muiUseTheme();
}

export function makeStyles<
  Props extends Record<string, unknown> = Record<string, unknown>,
  ClassKey extends string = string,
>(
  style: Styles<Theme, Props, ClassKey>,
  options?: WithStylesOptions<Theme>,
): (props?: unknown) => ClassNameMap<ClassKey> {
  //@ts-expect-error assignment to more restrictive type
  return muiMakeStyles<Theme, Props, ClassKey>(style, options);
}

export { type Theme, theme } from '#settings/mui-theme';
