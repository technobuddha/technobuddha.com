//@ts-check
// eslint-disable-next-line tsdoc/syntax
/** @type {import("@technobuddha/project").TechnobuddhaConfig} */
const config = {
  lint: {
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': { rule: 'off' },
      '@typescript-eslint/no-confusing-void-expression': { rule: 'off' },
      '@typescript-eslint/method-signature-style': { rule: 'off' },
      'no-shadow': { rule: 'off' },
      '@typescript-eslint/no-shadow': { rule: 'off' },
      'class-methods-use-this': { rule: 'off' },
      '@typescript-eslint/class-methods-use-this': { rule: 'off' },
      'require-await': { rule: 'off' },
      '@typescript-eslint/require-await': { rule: 'off' },
    },
  },
  directories: {
    '.': {
      tsconfig: {
        references: ['./src'],
      },
    },
    'scripts': {
      environment: 'node',
      tsconfig: {
        references: ['src'],
      },
    },
    'src/client': {
      environment: 'vite-client',
      tsconfig: {
        references: ['src/api', 'src/control', 'src/maze', 'src/settings', 'src/server'],
      },
    },
    'src/config': {
      environment: 'node',
    },
    'src/control': {
      environment: 'vite-client',
      tsconfig: {
        references: ['src/client/context'],
      }
    },
    'src/maze': {
      environment: 'vite-client',
    },
    'src/server': {
      environment: 'node',
      tsconfig: {
        references: ['src/config', 'src/settings'],
      },
    },
    'src/settings': {
      environment: 'universal',
      tsconfig: {
        references: ['src/client'],
      },
    },
  },
  tsconfig: {
    base: {
      compilerOptions: {
        paths: {
          /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
          '#api/*': ['./src/api/*/index.ts'],
          '#context/*': ['./src/client/context/*/index.ts'],
          '#control': ['./src/control/index.ts'],
          '#page/*': ['./src/client/page/*/index.ts'],
          '#client*': ['./src/client*'],
          '#server/*': ['./src/server/*/index.ts'],
          '#util*': ['./src/util*'],
          '#settings*': ['./src/settings*'],
          '#config*': ['./src/config*'],
          '#maze/*': ['./src/maze/*/index.ts'],
        },
      },
    },
  },
};

export default config;
