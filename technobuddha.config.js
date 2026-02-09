//@ts-check
/** @type import("\@technobuddha/project").TechnobuddhaConfig */
const config = {
  directories: {
    'scripts': {
      environment: 'node',
      tsconfig: {
        references: ['src/server', 'src/settings'],
      }
    },
    'src/api': {
      environment: 'browser',
    },
    'src/client': {
      environment: 'vite-client',
      tsconfig: {
        references: ['src/settings']
      }
    },
    'src/config': {
      environment: 'node',
    },
    'src/server': {
      environment: 'node',
    },
    'src/settings': {
      environment: 'esnext',
      tsconfig: {
        references: ['src/client']
      }
    },
    'migrations': {
      environment: 'node',
      tsconfig: {
        compilerOptions: {
          noEmit: true,
        }
      }
    },
  },
  tsconfig: {
    base: {
      compilerOptions: {
        paths: {
          /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
          '#api/*': ['./src/api/*/index.ts'],
          '#context/*': ['./src/client/context/*/index.ts'],
          '#page/*': ['./src/client/page/*/index.ts'],
          '#client*': ['./src/client*'],
          '#server/*': ['./src/server/*/index.ts'],
          '#util*': ['./src/util*'],
          '#settings*': ['./src/settings*'],
          '#config': ['./src/config/index.ts']
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
