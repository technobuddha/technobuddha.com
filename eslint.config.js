/* eslint-disable tsdoc/syntax */
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
  // src/tsconfig.json
  app.lint({
    files: ['src/client/**/*.tsx'],
    ignores: [],
    environment: 'browser',
    tsConfig: 'src/client/tsconfig.json',
    react: true,
  }),
  // src/tsconfig.json
  app.lint({
    files: ['src/client/**/*.ts'],
    ignores: [],
    environment: 'browser',
    tsConfig: 'src/client/tsconfig.json',
  }),
  // ?
  app.lint({
    files: ['src/schema/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/schema/tsconfig.json',
  }),
  app.lint({
    files: ['src/settings/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/settings/tsconfig.json',
  }),
  app.lint({
    files: ['src/server/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/server/tsconfig.json',
  }),
  app.lint({
    files: ['src/config/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/config/tsconfig.json',
  }),
  app.lint({
    files: ['src/util/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/util/tsconfig.json',
  }),
  // tsconfig.json
  app.lint({ files: ['*.config.js'], ignores: [], environment: 'node' }),
  // tsconfig.json
  app.lint({ files: ['*.config.ts'], ignores: [], environment: 'node' }),
  // no tsconfig
  app.lint({ files: ['migrations/*.cjs'], ignores: [], environment: 'node' }),
  // scripts/tsconfig.json
  app.lint({
    files: ['scripts/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'scripts/tsconfig.json',
  }),
];

export default config;
