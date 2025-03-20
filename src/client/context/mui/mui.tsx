import React from 'react';
import { theme } from '#settings/mui-theme';
import { create } from 'jss';
import { useTheme as muiUseTheme } from '@mui/material';
import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider,
  jssPreset,
  makeStyles as muiMakeStyles,
} from '@mui/styles';

import type { ClassNameMap, Styles, WithStylesOptions } from '@mui/styles/withStyles';
import type { Theme } from '#settings/mui-theme';

const jss = create({ plugins: jssPreset().plugins });

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <StylesProvider jss={jss}>{children}</StylesProvider>
    </MuiThemeProvider>
  );
};

export function useTheme(): Theme {
  return muiUseTheme();
}

export function makeStyles<Props extends object = {}, ClassKey extends string = string>(
  style: Styles<Theme, Props, ClassKey>,
  options?: WithStylesOptions<Theme>,
): (props?: unknown) => ClassNameMap<ClassKey> {
  //@ts-expect-error assignment to more restrictive type
  return muiMakeStyles<Theme, Props, ClassKey>(style, options);
}

export { type Theme, theme } from '#settings/mui-theme';
