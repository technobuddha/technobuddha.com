import path from 'node:path';

import { splitLines } from '@technobuddha/library';
import { type Application, /*type NextFunction,*/ type Request, type Response } from 'express';
import express from 'express';
import { type Logger } from 'winston';

import { paths } from '#config';
import { browserSettings } from '#settings/browser';
import { userInterfaceSettings } from '#settings/user-interface';

import { cacheControl } from './cache-control.ts';

const isDevelopment = process.env.NODE_ENV !== 'production';

function status404(_req: Request, res: Response): void {
  res.statusMessage = 'NOT FOUND';
  res.status(404).render('error/404.mustache', {
    favicon: browserSettings.favicon,
    homePage: userInterfaceSettings.homePage,
  });
}

export function staticContent(app: Application, logger: Logger): void {
  app
    .get('/oeoaa', (_req, res) => {
      res.send('Ting Tang Walla Walla Bing Bang\n');
    })
    .use('/.well-known/', express.static(paths.wellKnown), status404)
    .use('/locales/', express.static(paths.locales), status404)
    .get(
      '/art/:id',
      (req, _res, next) => {
        req.url = `AlbumArt_{${req.params.id.toUpperCase()}}_Large.jpg`;
        next();
      },
      express.static(paths.artwork),
      status404,
    );

  if (!isDevelopment) {
    app
      .get(['/favicon.ico', '/assets/*', '/core/*'], (req, res) => {
        res.setHeader('Cache-Control', cacheControl(1));
        logger.info(`core: ${req.path}`);
        res.sendFile(path.join(paths.home, 'dist', req.path));
      })
      .get('/*', (_req, res) => {
        res.setHeader('Cache-Control', cacheControl(1));

        res.sendFile(path.join(paths.home, 'dist', 'index.html'));
      })
      .use(status404)
      .use((err: Error, _req: Request, res: Response) => {
        logger.error(`Error: ${err.message}`);
        if (err.stack) {
          for (const stack of splitLines(err.stack).slice(1)) {
            logger.debug(stack);
          }
        }

        res.status(500).render('error/500.mustache', { favicon: browserSettings.favicon });
      });
  }
}
