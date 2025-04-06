import { type Router, Router as router } from 'express';
import { isUndefined } from 'lodash-es';
import { type Logger } from 'winston';
import zxcvbn from 'zxcvbn';

import { authenticationSettings } from '#settings/authentication.js';

import { cacheControl } from '../cache-control.ts';
import {
  createAccount,
  createSession,
  deleteConcurrentSessions,
  deleteSession,
  getAccountByEmail,
  getAccountById,
  getSession,
  verifyPassword,
} from '../db/authentication.ts';

export function authentication(_logger: Logger): Router {
  return router()
    .get('/session', (req, res) => {
      void (async () => {
        res.setHeader('Cache-Control', cacheControl(0));

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
        res.setHeader('Cache-Control', cacheControl(0));

        const { email, password } = req.body as { email: string; password: string };

        if (!email || !password) {
          res.status(400).json('Request must include fields "username" and "password"');
        }

        const account = await verifyPassword(email, password);
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
        res.setHeader('Cache-Control', cacheControl(0));

        const sessionId = req.cookies.session;
        if (sessionId) {
          await deleteSession(sessionId);
        }

        res.clearCookie('session');
        res.status(204);
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
        res.setHeader('Cache-Control', cacheControl(0));
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
    });
}
