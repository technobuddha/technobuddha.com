// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
// @ts-check
import { lint } from '@technobuddha/project';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  lint({
    files: ['**/*.ts'],
    ignores: ['i18next-scanner-typescript/**/*'],
    environment: 'node',
    typescript: true,
  }),
]);
