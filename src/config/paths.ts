import fs from 'node:fs/promises';
import path from 'node:path';

const isDevelopment = process.env.NODE_ENV !== 'production';
let home = await fs.realpath(process.env.PROJECT_HOME ?? process.cwd());

for (;;) {
  if (
    await fs
      .stat(path.join(home, '.env'))
      .then(() => true)
      .catch(() => false)
  ) {
    break;
  }

  if (home === '/') {
    home = process.cwd();
    break;
  }

  home = await fs.realpath(path.join(home, '..'));
}

function resolveHome(...relativePath: string[]): string {
  return path.join(home, ...relativePath);
}

export const paths = {
  home: resolveHome('.'),
  env: resolveHome('.env'),
  data: resolveHome('data'),
  src: resolveHome('src'),
  node_modules: resolveHome('node_modules'),
  assets: resolveHome('assets'),
  webroot: resolveHome('webroot'),
  client: resolveHome('src', 'client'),
  clientEntry: resolveHome('src', 'client', 'index.tsx'),
  server: resolveHome('src', 'server'),
  serverEntryProduction: resolveHome('src', 'server', 'server-production.ts'),
  serverEntryDevelopment: resolveHome('src', 'server', 'server-development.ts'),
  worker: resolveHome('src', 'worker'),
  workerEntry: resolveHome('src', 'worker', 'index.ts'),
  views: resolveHome('views'),
  locales: resolveHome('locales'),
  bin: isDevelopment ? resolveHome('deploy', 'bin') : resolveHome('bin'),
  dist: isDevelopment ? resolveHome('deploy', 'dist') : resolveHome('dist'),
};
