/* eslint-disable check-file/filename-naming-convention */
import { type ColumnDefinitions, type MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension('uuid-ossp', { ifNotExists: true });
  pgm.createExtension('pgcrypto', { ifNotExists: true });
  pgm.createExtension('citext', { ifNotExists: true });

  pgm.createTable(
    'account',
    {
      id: { type: 'serial', notNull: true, primaryKey: true },
      email: { type: 'citext', notNull: true, unique: true },
      first: { type: 'text', notNull: true },
      last: { type: 'text', notNull: true },
      password: { type: 'text', notNull: true },
      admin: { type: 'boolean', notNull: true, default: false },
      disabled: { type: 'boolean', notNull: true, default: false },
      confirmed: { type: 'timestamptz' },
      failed_logins: { type: 'integer', notNull: true, default: 0 },
      locked: { type: 'timestamptz' },
      created: { type: 'timestamptz' },
      updated: { type: 'timestamptz' },
      policy_accepted: { type: 'timestamptz' },
    }
  );

  pgm.createTable(
    'session',
    {
      id: { type: 'uuid', notNull: true, default: pgm.func('UUID_GENERATE_V4()'), primaryKey: true },
      account_id: { type: 'integer', notNull: true, references: 'account(id)' },
      created: { type: 'timestamptz', notNull: true },
      expires: { type: 'timestamptz', notNull: true },
    }
  );

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('session');
  pgm.dropTable('account');

  pgm.dropExtension('citext', { ifExists: true });
  pgm.dropExtension('pgcrypto', { ifExists: true });
  pgm.dropExtension('uuid-ossp', { ifExists: true });
}
