import React                                                    from 'react';
import theme                                                    from '#settings/mui-theme';
import { create }                                               from 'jss';
import { useTheme as muiUseTheme, makeStyles as muiMakeStyles } from '@material-ui/core';
import { MuiThemeProvider, StylesProvider, jssPreset }          from '@material-ui/core/styles';

import type { ClassNameMap, Styles, WithStylesOptions } from '@material-ui/styles/withStyles';
import type { Theme }                                   from '#settings/mui-theme';

const jss = create({ plugins: jssPreset().plugins });

type ThemeProviderProps = {
    children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => {
    return (
        <MuiThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
                {children}
            </StylesProvider>
        </MuiThemeProvider>
    );
};

export function useTheme(): Theme {
    return muiUseTheme();
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function makeStyles<Props extends object = {}, ClassKey extends string = string>(
    style: Styles<Theme, Props, ClassKey>,
    options?: WithStylesOptions<Theme>
): (props?: unknown) => ClassNameMap<ClassKey> {
    //@ts-expect-error assignment to more restrictive type
    return muiMakeStyles<Theme, Props, ClassKey>(style, options);
}

export type { Theme } from '#settings/mui-theme';
export default makeStyles;
