// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    root: './src',
    include: ['**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    env: {
      TZ: 'America/New_York',
    },
    cache: false as const,
    typecheck: {
      enabled: true,
    },
    coverage: {
      reportsDirectory: '../coverage',
      skipFull: true,
      enabled: true,
      exclude: [
        '**/*.test.*',
        '**/*.config.*',
        'scripts/**/*.*',
        '**/index.ts',
        '**/@types',
        '**/@data',
        ...coverageConfigDefaults.exclude,
        
      ],
    },
  },
}));
