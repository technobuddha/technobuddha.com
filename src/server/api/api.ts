import { type Express, Router as router } from 'express';
import { type Logger } from 'winston';

import { browserSettings } from '#settings/browser.js';
import { userInterfaceSettings } from '#settings/user-interface.js';

import { authentication } from './router/authentication.ts';
import { music } from './router/music.ts';

export function api(app: Express, logger: Logger): void {
  app.use(
    '/api',
    router()
      .use('/authentication', authentication(logger))
      .use('/music', music(logger))
      .use((_req, res) => {
        res.status(404).render('error/404.mustache', {
          favicon: browserSettings.favicon,
          homePage: userInterfaceSettings.homePage,
        });
      }),
  );
}
