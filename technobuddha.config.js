//@ts-check
/** @type import("\@technobuddha/project").TechnobuddhaConfig  */
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
  git: {
    ignore: ['artwork'],
  },
};

export default config;
