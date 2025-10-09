//@ts-check
// eslint-disable-next-line tsdoc/syntax
/** @type {import("@technobuddha/project").TechnobuddhaConfig} */
const config = {
  directories: {
    '.': {
      tsconfig: {
        references: ['src/settings'],
      },
    },
    'scripts': {
      environment: 'node',
    },
    'src/api': {
      environment: 'browser',
    },
    'src/client': {
      environment: 'vite-client',
      tsconfig: {
        references: ['src/api', 'src/control', 'src/settings', 'src/server'],
      },
    },
    'src/config': {
      environment: 'node',
    },
    'src/control': {
      environment: 'vite-client',
      tsconfig: {
        references: ['src/client'],
      }
    },
    'src/server': {
      environment: 'node',
      tsconfig: {
        references: ['src/settings', 'src/config'],
      }
    },
    'src/settings': {
      environment: 'esnext',
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
          '#config': ['./src/config/index.ts'],
          '#env': ['./src/config/env.ts'],
        },
      },
    },
  },
  git: {
    ignore: [
      'artwork'
    ]
  }
};

export default config;
