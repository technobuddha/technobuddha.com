import { type Router, Router as router } from 'express';
import { type Logger } from 'winston';

import { browserSettings } from '#settings/browser.js';
import { userInterfaceSettings } from '#settings/user-interface.js';

import { authentication } from './router/authentication.js';
import { music } from './router/music.js';

export function api(logger: Logger): Router {
  return router()
    .use('/authentication', authentication(logger))
    .use('/music', music(logger))
    .use((_req, res) => {
      res.status(404).render('error/404.hbs', {
        favicon: browserSettings.favicon,
        homePage: userInterfaceSettings.homePage,
      });
    });
}
