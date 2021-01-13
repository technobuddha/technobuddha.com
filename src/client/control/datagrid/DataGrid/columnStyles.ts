import React          from 'react';
import { makeStyles } from '@material-ui/core/styles';

type RowClassnames = {
    root?:                  string;
    cell?:                  string;
    cellHeader?:            string;
    menu?:                  string;
    menuButton?:            string;
    menuIcon?:              string;
    menuIconHeader?:        string;
    stub?:                  string;
}
export type RowClasses = RowClassnames & {header: HeaderClasses};
export type RowStyles  = {[key in keyof RowClassnames]: React.CSSProperties} & {header: HeaderStyles};

export type HeaderClasses = {
    button:                 string;
    buttonContents:         string;
    buttonTitle:            string;
    buttonSortIndicator:    string;
    [key: string]:          string;
}
export type HeaderStyles = {[key in keyof HeaderClasses]: React.CSSProperties};

const ucs = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
        border: `1px solid ${theme.palette.divider}`,
    },
    cell: {
        flex: '0 0 auto',
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
        cursor: 'default',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        "&:not(:first-child)": {
            borderLeft: `1px solid ${theme.palette.divider}`
        },
    },
    cellHeader: {
        backgroundColor: theme.palette.primary.light,
    },
    menu: {
        flex: '0 0 auto',
        width: (props: Record<string, unknown>) => `${props.controlWidth}px`,
        height: '100%',
    },
    menuButton: {
        width: '28px',
        padding: 0,
        margin: '0 6px',
    },
    menuIcon: {
        marginTop: theme.spacing(0.5),
        width: (props: Record<string, unknown>) => `${props.controlWidth}px`,
        color: theme.palette.primary.main,
    },
    menuIconHeader: {
        color: theme.palette.primary.contrastText,
    },
    hamburger: {
        cursor: 'pointer',
        height: '24px',
        width: '24px',
        margin: '4px',
    },
    stub: {
        width: (props: Record<string, unknown>) => `${props.scrollbarWidth}px`,
        userSelect: 'none',
        height: '100%',
    }
}));

export const useColumnStyles: ((args: {scrollbarWidth: number, controlWidth: number}) => ReturnType<typeof ucs>) = ucs;

export default useColumnStyles;