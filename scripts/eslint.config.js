// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
// @ts-check
import { lint } from '@technobuddha/project';

export default lint({
  files: ['**/*.ts'],
  ignores: ['i18next-scanner-typescript/**/*'],
  platform: 'node',
  typescript: true,
});
