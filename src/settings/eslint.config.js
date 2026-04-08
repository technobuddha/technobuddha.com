// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
// @ts-check
import { lint } from '@technobuddha/project';

export default lint(
  { files: ['**/*.ts'], typescript: true },
  { files: ['**/*.tsx'], typescript: true, react: true },
);
