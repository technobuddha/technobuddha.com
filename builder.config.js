//@ts-check

/** @type {import('@technobuddha/builder').Builds} */
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
        daemon: true,
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
