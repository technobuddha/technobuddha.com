// cspell:ignore privkey, fullchain, Redirector

import fs from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

import { type Express } from 'express';
// eslint-disable-next-line import-x/default
import viteExpress from 'vite-express';
import { type Logger } from 'winston';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function listener(app: Express, logger: Logger): void {
  const httpPort = Number.parseInt(process.env.HTTP_PORT ?? (isDevelopment ? '3000' : '80'));
  const httpsPort = Number.parseInt(process.env.HTTPS_PORT ?? (isDevelopment ? '3443' : '443'));

  if (isDevelopment) {
    viteExpress.listen(app, httpPort, () => {
      logger.info(`viteExpress listening on http://localhost:${httpPort}/`);
    });
  } else {
    const certificateHome = process.env.CERTIFICATE_HOME ?? '/etc/letsencrypt/live';
    const filePrivate = path.join(certificateHome, 'technobuddha', 'privkey.pem');
    const filePublic = path.join(certificateHome, 'technobuddha', 'fullchain.pem');
    const fileAuthority = path.join(certificateHome, 'technobuddha', 'chain.pem');

    void Promise.all([
      fs.readFile(filePrivate, 'utf8').catch(() => null),
      fs.readFile(filePublic, 'utf8').catch(() => null),
      fs.readFile(fileAuthority, 'utf8').catch(() => null),
    ]).then(([key, cert, ca]) => {
      const credentials = key && cert && ca ? { key, cert, ca } : null;

      if (credentials) {
        http
          .createServer((req, res) => {
            const host = req.headers.host?.split(':')[0];
            res.writeHead(301, {
              Location: `https://${host}${httpsPort === 443 ? '' : `:${httpsPort}`}${req.url}`,
            });
            res.end();
          })
          .listen(httpPort, () => logger.info(`HTTP Redirector listening on port ${httpPort}`));

        https
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          .createServer(credentials, app)
          .listen(httpsPort, () => logger.info(`HTTPS Server listening on port ${httpsPort}`));
      } else {
        app.listen(httpPort, () => logger.info(`HTTP Server listening on port ${httpPort}`));
      }
    });
  }
}
