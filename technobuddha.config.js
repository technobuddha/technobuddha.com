//@ts-check
// eslint-disable-next-line tsdoc/syntax
/** @type {import("@technobuddha/project").TechnobuddhaConfig} */
const config = {
  directories: {
    'src': {
      environment: 'browser',
    },
    'src/client': {
      environment: 'browser',
      tsconfig: {
        references: ['src/settings'],
      },
    },
  },
};

export default config;
