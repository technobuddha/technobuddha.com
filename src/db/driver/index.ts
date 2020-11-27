import pgPromise from 'pg-promise';

export const pgp = pgPromise({
    capSQL:             true,   
});

export const db = pgp({
    user:       'postgres',
    host:       '/var/run/postgresql',
    database:   'technobuddha',
    port:       5432,
});

export default db;