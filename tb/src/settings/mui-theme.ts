import { createTheme } from '@material-ui/core/styles';

import type { Theme as MuiTheme } from '@material-ui/core/styles';

export type Theme = MuiTheme & {
    iconSize:               number;
    userInterface: {
        headerHeight:       string;
    };
};

export const themeSettings = {
    palette: {
        primary: {
            main:   '#1B6CA8',
            contrastText: '#FFF',
        },
        secondary: {
            main:   '#F49F0A',
        },
        error: {
            main:   '#DD2323',
        },
        warning: {
            main:   '#FEC601',
        },
        info: {
            main:   '#610F7F',
        },
        success: {
            main:   '#07BF6C',
        },
    },
    typography: {
        fontSize:   14,
        fontFamily: '"Noto Sans", Arial, Helvetica, sans-serif',
        h1: {
            fontSize: '2rem',
        },
        h2: {
            fontSize: '1.5rem',
        },
        h3: {
            fontSize: '1.17rem',
        },
        h4: {
            fontSize: '1rem',
        },
        h5: {
            fontSize: '.83rem',
        },
        h6: {
            fontSize: '0.67rem',
        },
    },

};

export const theme: Theme = {
    ...createTheme(themeSettings),
    iconSize: 24,
    userInterface: {
        headerHeight: '40px',
    },
    overrides: {
        MuiLink: {
            root: {
                fontWeight: 'bold',
            },
        },
    },
};

export default theme;
