import express                      from 'express';
import chalk                        from 'chalk';
import hbs                          from 'hbs';
import cookieParser                 from 'cookie-parser';
import { replacer, reviver }        from '@technobuddha/library/json';
import paths                        from '#config/paths';

import type { Logger }      from 'winston';
import type { Application } from 'express';

export function setup(app: Application, logger: Logger): void {
    app
    .set('view engine', hbs)
    .set('views',       paths.views)
    .use(cookieParser())
    .use(express.json({ reviver }))
    .use(express.urlencoded({ extended: true }))
    .set('json replacer', replacer)
    .use(
        (req, res, next) => {
            const start = Date.now();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            const saveEnd = res.end;
            res.end = function end(...args: any[]) {
                const { protocol, method, originalUrl, ip } = req;
                const { statusCode, statusMessage } = res;
                const duration = Date.now() - start;
                const message = statusMessage ? `${statusMessage} ` : '';

                logger.http(`${protocol}:${method} ${statusCode} ${message}${chalk.green(`${duration}ms`)} ${originalUrl} [${chalk.cyan(ip)}]`);

                res.end = saveEnd;
                res.end(...args);
            };

            next();
        }
    );
}

export default setup;
