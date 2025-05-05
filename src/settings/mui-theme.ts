import { createTheme, type Theme as MuiTheme } from '@mui/material';

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
      main: '#08A4BD',
    },
    error: {
      main: '#EF3E36',
    },
    warning: {
      main: '#F5B700',
    },
    info: {
      main: '#DC0073',
    },
    success: {
      main: '#89FC00',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Noto Sans", Arial, Helvetica, sans-serif',
    h1: {
      fontSize: '4.0rem',
    },
    h2: {
      fontSize: '3.0rem',
    },
    h3: {
      fontSize: '2.5rem',
    },
    h4: {
      fontSize: '2.0rem',
    },
    h5: {
      fontSize: '1.5rem',
    },
    h6: {
      fontSize: '1.25rem',
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
