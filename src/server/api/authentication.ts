import express              from 'express';
import zxcvbn               from 'zxcvbn';
import isUndefined          from 'lodash/isUndefined';
import settings             from '#settings/authentication';
import db                   from '#server/db/authentication';

export const authentication = express.Router();

authentication.get(
    '/session',
    (req, res) => {
        void (async () => {
            const sessionId = req.cookies.session;

            if(sessionId) {
                const session = await db.getSession(sessionId);
                if(session) {
                    if(session.expires >= new Date()) {
                        const account = await db.getAccountById(session.account_id);

                        if(account) {
                            res.status(200).json(account);
                            return;
                        }
                    }
                }
            }

            res.clearCookie('session');
            res.status(401).json('Not logged in.');
        })();
    }
);

authentication.put(
    '/session',
    (req, res) => {
        void (async () => {
            const { username, password }  = req.body as { username: string; password: string };

            if(!username || !password)
                res.status(400).json('Request must include fields "username" and "password"');

            const account   = await db.verifyPassword(username, password);
            if(account) {
                const sessionId = req.cookies.session;

                if(sessionId)
                    await db.deleteSession(sessionId);

                if(!settings.concurrentSessions && !account.admin)
                    await db.deleteConcurrentSessions(account.id);

                const session = await db.createSession(account.id);

                res.cookie('session', session.id, { maxAge: settings.session.cookieAge });
                res.status(201).json(account);
            } else {
                res.clearCookie('session');
                res.status(401).json('Login incorrect');
            }
        })();
    }
);

authentication.delete(
    '/session',
    (req, res) => {
        void (async () => {
            const sessionId = req.cookies.session;
            if(sessionId)
                await db.deleteSession(sessionId);

            res.clearCookie('session');
            res.status(200).json('OK');
        })();
    }
);

authentication.post(
    '/check-password-strength',
    (req, res) => {
        const { password, userInputs } = req.body;

        if(isUndefined(password)) {
            res.status(400).json('Request must include field "password"');
            return;
        }

        const zResult = zxcvbn(password, userInputs);
        res.json({ score: zResult.score, warning: zResult.feedback.warning, suggestions: zResult.feedback.suggestions });
    }
);

authentication.put(
    '/account',
    (req, res) => {
        void (async () => {
            const { first, last, email, password } = req.body;

            if(!first || !last || !email || !password) {
                res.status(400).json('Request must include fields "first", "last", "email" and "password"');
                return;
            }

            if(await db.getAccountByEmail(email))
                res.status(409).json('Account already exists.');

            res.status(201).json(await db.createAccount({ first, last, email, password }));
        })();
    }
);

authentication.use(
    (_req, res) => {
        res.status(500).render('error/500.hbs');
    }
);

export default authentication;
