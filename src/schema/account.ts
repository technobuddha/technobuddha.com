import type { SetRequired } from 'type-fest';

export type Account = {
    id:                 number;
    email:              string;
    first:              string;
    last:               string;
    admin:              boolean;
    disabled:           boolean;
    confirmed:          Date        | null;
    failed_logins:      number;
    locked:             Date        | null;
    created:            Date;
    updated:            Date        | null;
    policy_accepted:    Date        | null;
};

export type AccountCreate = SetRequired<Partial<Omit<Account, 'id'>>, 'email' | 'first' | 'last'> & { password: string };

export default Account;
