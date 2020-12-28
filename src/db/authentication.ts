import { db }                                       from './driver';
import { Account, AccountCreate }                   from '#interface/Account';
import { Session }                                  from '#interface/Session';
import settings                                     from '#settings/authentication';

export async function getAccountById(id: number) {
    return db.oneOrNone<Account>(
        `
        SELECT  id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                created, updated, policy_accepted
        FROM account WHERE id = $(id)
        `,
        {id}
    )
}

export async function getAccountByEmail(email: string) {
    return db.oneOrNone<Account>(
        `
        SELECT  id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                created, updated, policy_accepted
        FROM account WHERE email = $(email)
        `,
        {email}
    )
}

export async function createAccount(account: AccountCreate) {
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
            email:                              account.email,
            first:                              account.first,
            last:                               account.last,
            password:                           account.password,
            admin:                              account.admin           ?? false,
            disabled:                           account.disabled        ?? false,
            confirmed:                          account.confirmed       ?? null,
            failed_logins:                      account.failed_logins   ?? 0,
            locked:                             account.locked          ?? null,
            created:                            account.created         ?? null,
            updated:                            account.updated         ?? null,
            policy_accepted:                    account.policy_accepted ?? null,
        }
    );
}

export async function verifyPassword(email: string, password: string) {
    return db.oneOrNone<Account>(
        `
        SELECT  id, email, first, last, admin, disabled, confirmed, failed_logins, locked,
                created, updated, policy_accepted
        FROM    account WHERE email = $(email) AND CRYPT($(password), password) = password;
        `,
        {email, password}
    );
}

export async function getSession(id: string) {
    return db.oneOrNone<Session>(
        `
        SELECT id, account_id, created, expires
        FROM    session WHERE id = $(id)
        `,
        {id}
    );
}

export async function createSession(account_id: number) {
    return db.one<Session>(
        `
        INSERT INTO session(account_id, created, expires)
        VALUES      ($(account_id), NOW(), (NOW() + $(duration)::interval))
        RETURNING   id, account_id, created
        `,
        {account_id, duration: `${settings.session.duration}ms`}
    )
}


export async function renewSession(session_id: string) {
    return db.one<Session>(
        `
        UPDATE      session
        SET         expires = (NOW() + $(duration)::interval)
        WHERE       id = $(session_id)
        RETURNING   id, account_id, created, expires
        `,
        {session_id, duration: `${settings.session.duration}ms`}
    )
}

export async function deleteSession(id: string) {
    return db.none(
        `
        DELETE FROM session WHERE id = $(id);
        `,
        {id}
    )
}

export async function deleteConcurrentSessions(account_id: number) {
    return db.none(
        `
        DELETE FROM session WHERE account_id = $(account_id)
        `,
        {account_id}
    )
}

export default { getAccountById, getAccountByEmail, createAccount, verifyPassword, getSession, createSession, renewSession, deleteSession, deleteConcurrentSessions }