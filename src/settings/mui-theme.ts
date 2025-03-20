import { type Theme as MuiTheme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

export type Theme = MuiTheme & {
  iconSize: number;
  userInterface: {
    headerHeight: string;
  };
};

export const themeSettings = {
  palette: {
    primary: {
      main: '#1B5CA8',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#12664F',
    },
    error: {
      main: '#BA1200',
    },
    warning: {
      main: '#F4D35E',
    },
    info: {
      main: '#A4036F',
    },
    success: {
      main: '#23CE6B',
    },
  },
  typography: {
    fontSize: 14,
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
};
