import { type Router } from 'express';
import express from 'express';
import { type Logger } from 'winston';

import { browserSettings } from '#settings/browser.js';
import { userInterfaceSettings } from '#settings/user-interface.js';

import { authentication } from './router/authentication.js';
import { music } from './router/music.js';

export class TimeoutError extends Error {
  public constructor() {
    super('Request Timeout');
    this.name = 'TimeoutError';
  }
}

export type GraphQLQuery = <T>(query: string) => Promise<T>;

export function api(logger: Logger): Router {
  return (
    express
      // eslint-disable-next-line new-cap
      .Router()
      .use('/authentication', authentication(logger))
      .use('/music', music(logger))
      .use((_req, res) => {
        res.status(404).render('error/404.hbs', {
          favicon: browserSettings.favicon,
          homePage: userInterfaceSettings.homePage,
        });
      })
  );
}
