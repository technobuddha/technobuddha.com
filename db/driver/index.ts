import pgPromise from 'pg-promise';

export const pgp = pgPromise({
    capSQL:             true,   
});

export const db = null;
// pgp({
//     user:       'postgres',
//     host:       '/var/run/postgresql',
//     database:   'technobuddha',
//     port:       5432,
// });

export default db;