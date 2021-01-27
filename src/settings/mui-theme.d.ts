import type { Theme as MuiTheme } from '@material-ui/core/styles';

export type Theme = MuiTheme & {
    iconSize:               number;
    userInterface: {
        headerHeight:       string;
    };
};

declare const theme: Theme;
