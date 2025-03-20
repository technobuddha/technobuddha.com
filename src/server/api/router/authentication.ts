import { type Router } from 'express';
import express from 'express';
import isUndefined from 'lodash/isUndefined';
import { type Logger } from 'winston';
import zxcvbn from 'zxcvbn';

import {
  createAccount,
  createSession,
  deleteConcurrentSessions,
  deleteSession,
  getAccountByEmail,
  getAccountById,
  getSession,
  verifyPassword,
} from '#server/db/authentication.js';
import { authenticationSettings } from '#settings/authentication.js';

export function authentication(_logger: Logger): Router {
  return (
    express
      // eslint-disable-next-line new-cap
      .Router()
      .get('/session', (req, res) => {
        void (async () => {
          const sessionId = req.cookies.session;

          if (sessionId) {
            const session = await getSession(sessionId);
            if (session && session.expires >= new Date()) {
              const account = await getAccountById(session.account_id);

              if (account) {
                res.status(200).json(account);
                return;
              }
            }
          }

          res.clearCookie('session');
          res.status(401).json('Not logged in.');
        })();
      })
      .put('/session', (req, res) => {
        void (async () => {
          const { username, password } = req.body as { username: string; password: string };

          if (!username || !password) {
            res.status(400).json('Request must include fields "username" and "password"');
          }

          const account = await verifyPassword(username, password);
          if (account) {
            const sessionId = req.cookies.session;

            if (sessionId) {
              await deleteSession(sessionId);
            }

            if (!authenticationSettings.concurrentSessions && !account.admin) {
              await deleteConcurrentSessions(account.id);
            }

            const session = await createSession(account.id);

            res.cookie('session', session.id, { maxAge: authenticationSettings.session.cookieAge });
            res.status(201).json(account);
          } else {
            res.clearCookie('session');
            res.status(401).json('Login incorrect');
          }
        })();
      })
      .delete('/session', (req, res) => {
        void (async () => {
          const sessionId = req.cookies.session;
          if (sessionId) {
            await deleteSession(sessionId);
          }

          res.clearCookie('session');
          res.status(200).json('OK');
        })();
      })
      .post('/check-password-strength', (req, res) => {
        const { password, userInputs } = req.body;

        if (isUndefined(password)) {
          res.status(400).json('Request must include field "password"');
          return;
        }

        const zResult = zxcvbn(password, userInputs);
        res.json({
          score: zResult.score,
          warning: zResult.feedback.warning,
          suggestions: zResult.feedback.suggestions,
        });
      })
      .put('/account', (req, res) => {
        void (async () => {
          const { first, last, email, password } = req.body;

          if (!first || !last || !email || !password) {
            res
              .status(400)
              .json('Request must include fields "first", "last", "email" and "password"');
            return;
          }

          if (await getAccountByEmail(email)) {
            res.status(409).json('Account already exists.');
          }

          res.status(201).json(await createAccount({ first, last, email, password }));
        })();
      })
  );
}
