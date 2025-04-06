import { authenticationSettings } from '#settings/authentication';

import { db } from './driver.ts';
import { type Account, type AccountCreate, type Session } from './schema/index.ts';

export async function getAccountById(id: number): Promise<Account | null> {
  return db.oneOrNone<Account>(
    `
        SELECT  id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                created, updated, policy_accepted
        FROM account WHERE id = $(id)
        `,
    { id },
  );
}

export async function getAccountByEmail(email: string): Promise<Account | null> {
  return db.oneOrNone<Account>(
    `
        SELECT  id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                created, updated, policy_accepted
        FROM account WHERE email = $(email)
        `,
    { email },
  );
}

export async function createAccount(account: AccountCreate): Promise<Account> {
  return db.one<Account>(
    `
        INSERT  INTO account(
            email, first, last, admin, disabled, confirmed, failed_logins, locked,
            created, updated, policy_accepted,
            password
        ) VALUES (
            $(email), $(first), $(last), $(admin), $(disabled), $(confirmed), $(failed_logins), $(locked),
            $(created), $(updated), $(policy_accepted),
            CRYPT($(password), GEN_SALT('bf'))
        )
        RETURNING   id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                    created, updated, policy_accepted;
        `,
    {
      email: account.email,
      first: account.first,
      last: account.last,
      password: account.password,
      admin: account.admin ?? false,
      disabled: account.disabled ?? false,
      confirmed: account.confirmed ?? null,
      failed_logins: account.failed_logins ?? 0,
      locked: account.locked ?? null,
      created: account.created ?? null,
      updated: account.updated ?? null,
      policy_accepted: account.policy_accepted ?? null,
    },
  );
}

export async function verifyPassword(email: string, password: string): Promise<Account | null> {
  return db.oneOrNone<Account>(
    `
        SELECT  id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                created, updated, policy_accepted
        FROM    account WHERE email = $(email) AND CRYPT($(password), password) = password;
        `,
    { email, password },
  );
}

export async function getSession(id: string): Promise<Session | null> {
  return db.oneOrNone<Session>(
    `
        SELECT id, account_id, created, expires
        FROM    session WHERE id = $(id)
        `,
    { id },
  );
}

export async function createSession(accountId: number): Promise<Session> {
  return db.one<Session>(
    `
        INSERT INTO session(account_id, created, expires)
        VALUES      ($(account_id), NOW(), (NOW() + $(duration)::interval))
        RETURNING   id, account_id, created
        `,
    { account_id: accountId, duration: `${authenticationSettings.session.duration}ms` },
  );
}

export async function renewSession(sessionId: string): Promise<Session> {
  return db.one<Session>(
    `
        UPDATE      session
        SET         expires = (NOW() + $(duration)::interval)
        WHERE       id = $(session_id)
        RETURNING   id, account_id, created, expires
        `,
    { session_id: sessionId, duration: `${authenticationSettings.session.duration}ms` },
  );
}

export async function deleteSession(id: string): Promise<null> {
  return db.none(
    `
        DELETE FROM session WHERE id = $(id);
        `,
    { id },
  );
}

export async function deleteConcurrentSessions(accountId: number): Promise<null> {
  return db.none(
    `
        DELETE FROM session WHERE account_id = $(account_id)
        `,
    { account_id: accountId },
  );
}
