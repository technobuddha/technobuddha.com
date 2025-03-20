import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  root: './src/client',
  // ...
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
