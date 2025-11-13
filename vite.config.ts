import react from '@vitejs/plugin-react';
import postcssMuiTheme from 'postcss-mui-theme';
import { defineConfig } from 'vite';
// import { analyzer } from 'vite-bundle-analyzer';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { theme } from './src/settings/mui-theme.ts';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../../dist',
    assetsDir: 'core',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/react') && !id.includes('@technobuddha')) {
            return 'react';
          }
          if (id.includes('/@technobuddha')) {
            return 'technobuddha';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  plugins: [tsconfigPaths(), react(), svgr()], //, analyzer()],
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
