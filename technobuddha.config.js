//@ts-check
/** @type import("\@technobuddha/project").TechnobuddhaConfig */
const config = {
  directories: {
    'scripts': {
      platform: 'node',
    },
    'src/api': {
      platform: 'browser',
    },
    'src/client': {
      platform: 'vite-client',
    },
    'src/config': {
      platform: 'node',
    },
    'src/server': {
      platform: 'node',
    },
    'src/settings': {
      platform: 'esnext',
    },
    'migrations': {
      platform: 'node',
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
