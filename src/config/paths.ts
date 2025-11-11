/* eslint-disable n/no-sync */
import path from 'node:path';

import { err, findRootDirectorySync } from '@technobuddha/library';

const home = findRootDirectorySync();
if (!home) {
  err('Could not find project root directory');
  process.exit(1);
}

export const paths = {
  views: path.join(home, 'src', 'client', 'views'),
  artwork: path.join(home, 'artwork'),
  wellKnown: path.join(home, '.well-known'),
  locales: path.join(home, 'locales'),
};
