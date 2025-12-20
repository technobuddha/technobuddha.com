//@ts-check

/** @type {import('@technobuddha/project/build').Builds} */
const config = {
  dev: {
    watch: true,
    steps: [
      {
        name: 'Clean',
        command: 'rm -rf ./dist'
      },
      {
        name: 'Technobuddha',
        directory: './src/server', // /etc/letsencrypt/live/technobuddha
        command: 'tsx src/server/server.ts',
        context: 'daemon',
      },
    ],
  },
  prod: {
    steps: [
      {
        name: 'Clean',
        command: 'rm -rf ./dist',
      },
      {
        name: 'Technobuddha',
        command: 'vite build',
      },
    ]
  }
};

export default config;
