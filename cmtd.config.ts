import { defineConfig } from 'css-module-type-definitions/config';

export default defineConfig({
  css: {
    generateDts: true,
    classesConvention: 'kebabCase',
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
