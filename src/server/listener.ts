import fs from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

import { type Application } from 'express';
import { type Logger } from 'winston';

export async function listener(app: Application, logger: Logger): Promise<void> {
  const HTTP_PORT = Number.parseInt(process.env.HTTP_PORT ?? '8080');
  const HTTPS_PORT = Number.parseInt(process.env.HTTPS_PORT ?? '8443');

  const certificateHome = process.env.CERTIFICATE_HOME ?? '/etc/letsencrypt/live';
  const filePrivate = path.join(certificateHome, 'technobuddha', 'privkey.pem');
  const filePublic = path.join(certificateHome, 'technobuddha', 'fullchain.pem');
  const fileAuthority = path.join(certificateHome, 'technobuddha', 'chain.pem');
  const keyPrivate = await fs.readFile(filePrivate, 'utf8').catch(() => null);
  const keyPublic = await fs.readFile(filePublic, 'utf8').catch(() => null);
  const keyAuthority = await fs.readFile(fileAuthority, 'utf8').catch(() => null);

  const credentials =
    keyPrivate && keyPublic && keyAuthority ?
      { key: keyPrivate, cert: keyPublic, ca: keyAuthority }
    : null;

  if (credentials) {
    http
      .createServer((req, res) => {
        const host = req.headers.host?.split(':')[0];
        res.writeHead(301, {
          Location: `https://${host}${HTTPS_PORT === 443 ? '' : `:${HTTPS_PORT}`}${req.url}`,
        });
        res.end();
      })
      .listen(HTTP_PORT, () => logger.info(`HTTP Redirector listening on port ${HTTP_PORT}`));

    https
      .createServer(credentials, app)
      .listen(HTTPS_PORT, () => logger.info(`HTTPS Server listening on port ${HTTPS_PORT}`));
  } else {
    app.listen(HTTP_PORT, () => logger.info(`HTTP Server listening on port ${HTTP_PORT}`));
  }
}
