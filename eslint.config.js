// @ts-check
// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
import { app } from '@technobuddha/project';

// eslint-disable-next-line tsdoc/syntax
/** @type {import('eslint').Linter.Config[]} */
const config = [
  // .archive/tsconfig.json
  app.lint({
    files: ['.archive/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: '.archive/tsconfig.json',
  }),
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
  // src/maze/tsconfig.json
  app.lint({
    files: ['src/maze/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/maze/tsconfig.json',
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
