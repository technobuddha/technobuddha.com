//@ts-check
// eslint-disable-next-line tsdoc/syntax
/** @type {import("@technobuddha/project").TechnobuddhaConfig} */
const config = {
  lint: {
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': { rule: 'off' },
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
        references: ['src/settings', 'src/schema', 'src/server'],
      },
    },
    'src/config': {
      environment: 'node',
    },
    'src/schema': {
      environment: 'universal',
    },
    'src/server': {
      environment: 'node',
      tsconfig: {
        references: ['src/config', 'src/settings', 'src/schema', 'src/util'],
      },
    },
    'src/settings': {
      environment: 'universal',
      tsconfig: {
        references: ['src/client'],
      },
    },
    'src/util': {
      environment: 'universal',
      tsconfig: {
        references: ['src/config', 'src/settings'],
      },
    },
  },
  tsconfig: {
    base: {
      compilerOptions: {
        paths: {
          /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
          '#context/*': ['./src/client/context/*/index.ts'],
          '#control': ['./src/client/control/index.ts'],
          '#component*': ['./src/client/component*'],
          '#client*': ['./src/client*'],
          '#server*': ['./src/server*'],
          '#util*': ['./src/util*'],
          '#schema': ['./src/schema/index.ts'],
          '#settings*': ['./src/settings*'],
          '#config*': ['./src/config*'],
        },
      },
    },
  },
};

export default config;
