// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
// @ts-check
import { lint } from '@technobuddha/project';

export default lint(
  { files: ['**/*.tsx'], typescript: true, react: true },
  { files: ['**/*.ts'], typescript: true },
);
