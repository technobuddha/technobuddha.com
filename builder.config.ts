import { defineBuilds } from '@technobuddha/project/build';

export default defineBuilds({
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
});
