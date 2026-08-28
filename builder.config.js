//@ts-check

/** @type import('\@technobuddha/project/build').Builds */
const config = {
  dev: {
    watch: true,
    steps: [
      {
        display: 'Clean',
        command: 'rm -rf ./dist',
      },
      {
        display: 'Technobuddha',
        directory: './src/server', // /etc/letsencrypt/live/technobuddha
        command: 'npx tsx src/server/server.ts',
        context: 'daemon',
      },
    ],
  },
  build: {
    steps: [
      {
        display: 'Clean',
        command: 'rm -rf ./dist',
      },
      {
        display: 'Technobuddha',
        command: 'npx vite build',
      },
    ],
  },
};

export default config;
