import path from 'node:path';

import findUp from 'find-up';

const isDevelopment = process.env.NODE_ENV !== 'production';

const packageJsonPath = await findUp('package.json');
const home = path.dirname(packageJsonPath ?? process.cwd());

function resolveHome(...relativePath: string[]): string {
  return path.join(home, ...relativePath);
}

export const paths = {
  home: resolveHome('.'),
  views: resolveHome('src', 'client', 'views'),
  artwork: resolveHome('artwork'),
  wellKnown: resolveHome('.well-known'),
  locales: resolveHome('locales'),

  env: resolveHome('.env'),
  data: resolveHome('data'),
  src: resolveHome('src'),
  node_modules: resolveHome('node_modules'),
  client: resolveHome('src', 'client'),
  server: resolveHome('src', 'server'),
  serverEntryProduction: resolveHome('src', 'server', 'server-production.ts'),
  serverEntryDevelopment: resolveHome('src', 'server', 'server-development.ts'),
  bin: isDevelopment ? resolveHome('deploy', 'bin') : resolveHome('bin'),
  dist: isDevelopment ? resolveHome('deploy', 'dist') : resolveHome('dist'),
};
