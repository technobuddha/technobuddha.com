import React                                                    from 'react';
import theme, { Theme }                                         from '$/mui-theme';
import { useTheme as muiUseTheme, makeStyles as muiMakeStyles } from '@material-ui/core';
import { MuiThemeProvider }                                     from '@material-ui/core/styles';
import { ClassNameMap, Styles, WithStylesOptions }              from '@material-ui/styles/withStyles';

export const ThemeProvider: React.FC = ({children}: {children?: React.ReactNode}) => {
    return (
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    );
}

export function useTheme() {
    return muiUseTheme<Theme>();
}

export function makeStyles<ClassKey extends string = string>(
    style: Styles<Theme, Record<string, unknown>, ClassKey>,
    options?: Omit<WithStylesOptions<Theme>, 'withTheme'>
): (props?: unknown) => ClassNameMap<ClassKey> {
    return muiMakeStyles<Theme, ClassKey>(style, options)
}

export { Theme } from '$mui-theme';
export default ThemeProvider;
