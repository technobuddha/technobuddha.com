// import fs from 'node:fs/promises';
import { config } from '@dotenvx/dotenvx';

config({ path: ['.env.development', '.env'] });

console.log('src/config/env.ts <<<<', process.env.DB_USER);

//import { config } from 'dotenv';
// import dotenvExpand from 'dotenv-expand';

// import { paths } from './paths.ts';

// if (!process.env.NODE_ENV) {
//   process.env.NODE_ENV = 'development';
// }

// for (const path of [
//   `${paths.env}.${process.env.NODE_ENV}.local`,
//   `${paths.env}.${process.env.NODE_ENV}`,
//   `${paths.env}.local`,
//   paths.env,
// ]) {
//   void fs
//     .stat(path)
//     .then(() => {
//       dotenvExpand.expand(config({ path }));
//     })
//     .catch(() => undefined);
// }
