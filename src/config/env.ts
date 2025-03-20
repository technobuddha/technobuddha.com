// import fs from 'fs/promises';
// import { paths } from './paths.js';
// import { config } from 'dotenv';
// import dotenvExpand from 'dotenv-expand';

// if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

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
