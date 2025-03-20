import react from '@vitejs/plugin-react';
import postcssMuiTheme from 'postcss-mui-theme';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { theme } from './src/settings/mui-theme.js';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../../dist',
    assetsDir: 'core',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/lodash') || id.includes('node_modules/@mui')) {
            return 'vendor';
          } else if (id.includes('node_modules/react')) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  plugins: [tsconfigPaths(), react(), svgr()],
  root: './src/client',
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [postcssMuiTheme({ theme })],
    },
  },
});
