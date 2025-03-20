import '../../config/env.ts';

import pgPromise from 'pg-promise';

export const pgp = pgPromise({
  capSQL: true,
});

console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');
console.log(process.env.DB_USER);
console.log(process.env.DB_HOST);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_PORT);

export const db = pgp({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number.parseInt(process.env.DB_PORT ?? '5432'),
});
