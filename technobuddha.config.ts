import { defineConfig } from '@technobuddha/project/config';

export default defineConfig({
  directories: {
    'scripts': {
      platform: 'node',
    },
    'src/api': {
      platform: 'browser',
    },
    'src/client': {
      platform: 'vite-client',
    },
    'src/config': {
      platform: 'node',
    },
    'src/server': {
      platform: 'node',
    },
    'src/settings': {
      platform: 'esnext',
    },
    'migrations': {
      platform: 'node',
      tsconfig: {
        compilerOptions: {
          noEmit: true,
        },
      },
    },
    '.': {
      tsconfig: {
        references: ['src/settings'],
      },
    },
  },
  git: {
    ignore: ['artwork'],
  },
});
