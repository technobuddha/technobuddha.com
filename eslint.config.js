// @ts-check
// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
import { app } from '@technobuddha/project';

/**
 * @import { type Linter } from 'eslint';
 * @type {Linter.Config[]}
 */
const config = [
  // scripts/tsconfig.json
  app.lint({
    files: ['scripts/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'scripts/tsconfig.json',
  }),
  // src/api/tsconfig.json
  app.lint({
    files: ['src/api/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/api/tsconfig.json',
  }),
  // src/client/tsconfig.json
  app.lint({
    files: ['src/client/**/*.tsx'],
    ignores: [],
    tsConfig: 'src/client/tsconfig.json',
    react: true,
  }),
  // src/client/tsconfig.json
  app.lint({ files: ['src/client/**/*.ts'], ignores: [], tsConfig: 'src/client/tsconfig.json' }),
  // src/config/tsconfig.json
  app.lint({
    files: ['src/config/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/config/tsconfig.json',
  }),
  // src/server/tsconfig.json
  app.lint({
    files: ['src/server/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/server/tsconfig.json',
  }),
  // src/settings/tsconfig.json
  app.lint({ files: ['src/settings/*.ts'], ignores: [], tsConfig: 'src/settings/tsconfig.json' }),
  // src/settings/tsconfig.json
  app.lint({
    files: ['src/settings/*.tsx'],
    ignores: [],
    tsConfig: 'src/settings/tsconfig.json',
    react: true,
  }),
  // tsconfig.json
  app.lint({ files: ['*.config.js'], ignores: [], environment: 'node' }),
  // tsconfig.json
  app.lint({ files: ['*.config.ts'], ignores: [], environment: 'node' }),
];

export default config;
