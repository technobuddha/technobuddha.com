import react from '@vitejs/plugin-react';
import postcssMuiTheme from 'postcss-mui-theme';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { theme } from './src/settings/mui-theme.js';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  root: './src/client',
  // ...
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [postcssMuiTheme({ theme })],
    },
  },
});
