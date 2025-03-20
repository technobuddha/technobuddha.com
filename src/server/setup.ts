import { replacer, reviver } from '@technobuddha/library';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import { type Application } from 'express';
import express from 'express';
import responseTime from 'response-time';
// import hbs                          from 'hbs';
import { type Logger } from 'winston';

import { paths } from '#config/paths.js';

export function setup(app: Application, logger: Logger): void {
  app
    // .set('view engine', hbs)
    .set('views', paths.views)
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
