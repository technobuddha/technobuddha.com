import { createMuiTheme } from '@material-ui/core/styles';

import type { Theme as MuiTheme } from '@material-ui/core/styles';

export type Theme = MuiTheme & {
    iconSize:               number;
    userInterface: {
        headerHeight:       string;
    };
};

export const theme: Theme = {
    ...createMuiTheme({
        palette: {
            type:       'light',
            primary: {
                main:   '#1B6CA8',
                contrastText: '#FFF',
            },
            secondary: {
                main:   '#07BF6C',
                contrastText: '#FFF',
            },
            error: {
                main:   '#DD2323',
            },
            warning: {
                main:   '#E88B00',
            },
            info: {
                main:   '#029FD8',
            },
        },
        typography: {
            fontSize:   14,
            fontFamily: '"Noto Sans", Arial, Helvetica, sans-serif',
        },
        overrides: {
            MuiLink: {
                root: {
                    fontWeight: 'bold',
                },
            },
        },
    }),
    iconSize: 24,
    userInterface: {
        headerHeight: '40px',
    },
};

export default theme;
