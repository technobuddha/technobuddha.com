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
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'mui1';
            }
            if (
              id.includes('@emotion') ||
              id.includes('jss') ||
              id.includes('notistack') ||
              id.includes('@popperjs')
            ) {
              return 'mui2';
            }
            if (id.includes('@technobuddha')) {
              return 'technobuddha';
            }
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            if (id.includes('react')) {
              return 'react';
            }
            if (id.includes('colorjs')) {
              return 'color';
            }
            if (id.includes('lodash')) {
              return 'lodash';
            }

            return 'vendor';
          }

          if (id.includes('maze')) {
            return 'maze';
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
