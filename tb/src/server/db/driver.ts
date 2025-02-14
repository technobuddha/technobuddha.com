import process   from 'process';
import pgPromise from 'pg-promise';

export const pgp = pgPromise({
    capSQL:     true,
});

export const db = pgp({
    user:       process.env.DB_USER,
    host:       process.env.DB_HOST,
    database:   process.env.DB_DATABASE,
    port:       Number.parseInt(process.env.DB_PORT ?? '5432', 10),
});

export default db;
