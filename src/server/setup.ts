import { replacer, reviver } from '@technobuddha/library';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import { type Application } from 'express';
import express from 'express';
import mustacheExpress from 'mustache-express';
import responseTime from 'response-time';
import { type Logger } from 'winston';

import { paths } from '#config/paths.ts';

export function setup(app: Application, logger: Logger): void {
  app
    .set('view engine', 'mustache')
    .set('views', paths.views)
    .engine('mustache', mustacheExpress())
    .use(cookieParser())
    .use(express.json({ reviver }))
    .use(express.urlencoded({ extended: true }))
    .set('json replacer', replacer)
    .use(
      responseTime((req, res, time) => {
        const { method, url } = req;
        const { statusCode, statusMessage } = res;
        const message = statusMessage ? `${statusMessage} ` : '';

        logger.http(
          `${method} ${statusCode} ${message}${chalk.green(`${time.toFixed(2)}ms`)} ${url}`,
        );
      }),
    );
}
