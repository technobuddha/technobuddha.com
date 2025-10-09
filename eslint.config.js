// @ts-check
// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
import { app } from '@technobuddha/project';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // .
  app.lint({ files: ['*.config.js'], ignores: [], environment: 'node' }),
  // .
  app.lint({ files: ['*.config.ts'], ignores: [], environment: 'node', tsConfig: 'tsconfig.json' }),
  // scripts
  app.lint({
    files: ['scripts/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'scripts/tsconfig.json',
  }),
  // src/api
  app.lint({
    files: ['src/api/**/*.ts'],
    ignores: [],
    environment: 'browser',
    tsConfig: 'src/api/tsconfig.json',
  }),
  // src/client
  app.lint({
    files: ['src/client/**/*.tsx'],
    ignores: [],
    tsConfig: 'src/client/tsconfig.json',
    react: true,
  }),
  // src/client
  app.lint({ files: ['src/client/**/*.ts'], ignores: [], tsConfig: 'src/client/tsconfig.json' }),
  // src/config
  app.lint({
    files: ['src/config/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/config/tsconfig.json',
  }),
  // src/control
  app.lint({ files: ['src/control/**/*.ts'], ignores: [], tsConfig: 'src/control/tsconfig.json' }),
  // src/control
  app.lint({
    files: ['src/control/**/*.tsx'],
    ignores: [],
    tsConfig: 'src/control/tsconfig.json',
    react: true,
  }),
  // src/server
  app.lint({
    files: ['src/server/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/server/tsconfig.json',
  }),
  // src/settings
  app.lint({
    files: ['src/settings/**/*.ts'],
    ignores: [],
    tsConfig: 'src/settings/tsconfig.json',
  }),
  // src/settings
  app.lint({
    files: ['src/settings/**/*.tsx'],
    ignores: [],
    tsConfig: 'src/settings/tsconfig.json',
    react: true,
  }),
];

export default config;
