/* eslint-disable @typescript-eslint/ban-types */

import React                                                    from 'react';
import theme, { Theme }                                         from '#settings/mui-theme';
import { create }                                               from 'jss';
import { useTheme as muiUseTheme, makeStyles as muiMakeStyles } from '@material-ui/core';
import { MuiThemeProvider, StylesProvider, jssPreset }          from '@material-ui/core/styles';
import { ClassNameMap, Styles, WithStylesOptions }              from '@material-ui/styles/withStyles';

const jss = create({ plugins: jssPreset().plugins });

type ThemeProviderProps = {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}: ThemeProviderProps) => {
    return (
        <MuiThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
                {children}
            </StylesProvider>
        </MuiThemeProvider>
    );
}

export function useTheme() {
    return muiUseTheme<Theme>();
}

export function makeStyles<Props extends object = {}, ClassKey extends string = string>( 
    style: Styles<Theme, Props, ClassKey>,
    options?: WithStylesOptions<Theme>
): (props?: unknown) => ClassNameMap<ClassKey> {
    //@ts-expect-error assignment to more restrictive type
    return muiMakeStyles<Theme, Props, ClassKey>(style, options)
}

export { Theme } from '#settings/mui-theme';
export default ThemeProvider;
