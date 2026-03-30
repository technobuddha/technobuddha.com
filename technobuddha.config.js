//@ts-check
/** @type import("\@technobuddha/project").TechnobuddhaConfig */
const config = {
  directories: {
    'scripts': {
      environment: 'node',
    },
    'src/api': {
      environment: 'browser',
    },
    'src/client': {
      environment: 'vite-client',
    },
    'src/config': {
      environment: 'node',
    },
    'src/server': {
      environment: 'node',
    },
    'src/settings': {
      environment: 'esnext',
    },
    'migrations': {
      environment: 'node',
      tsconfig: {
        compilerOptions: {
          noEmit: true,
        },
      },
    },
    '.': {
      tsconfig: {
        references: ['src/settings']
      }
    }
  },
  tsconfig: {
    base: {
      compilerOptions: {
        paths: {
          // '#api/*': ['./src/api/*/index.js'],
          // '#context/*': ['./src/client/context/*/index.js'],
          // '#page/*': ['./src/client/page/*/index.ts'],
          // '#client/*': ['./src/client/*/index.js'],
          // '#server/*': ['./src/server/*/index.js'],
          // '#util*': ['./src/util*'],
          // '#settings*': ['./src/settings*'],
          // '#config': ['./src/config/index.js'],
        },
      },
    },
  },
  git: {
    ignore: ['artwork'],
  },
};

export default config;
