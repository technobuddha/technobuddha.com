import fs                           from 'fs-extra';
import http                         from 'http';
import https                        from 'https';
import path                         from 'path';
import process                      from 'process';

import type { Logger }      from 'winston';
import type { Application } from 'express';

export function listener(app: Application, logger: Logger): void {
    const HTTP_PORT   = Number.parseInt(process.env.HTTP_PORT  ?? '8080');
    const HTTPS_PORT  = Number.parseInt(process.env.HTTPS_PORT ?? '8443');

    const certificate_home  = process.env.CERTIFICATE_HOME ?? '/etc/letsencrypt/live';
    const file_private      = path.join(certificate_home, 'technobuddha', 'privkey.pem');
    const file_public       = path.join(certificate_home, 'technobuddha', 'fullchain.pem');
    const file_authority    = path.join(certificate_home, 'technobuddha', 'chain.pem');
    const key_private       = fs.existsSync(file_private)   ? fs.readFileSync(file_private,   'utf8') : null;
    const key_public        = fs.existsSync(file_public)    ? fs.readFileSync(file_public,    'utf8') : null;
    const key_authority     = fs.existsSync(file_authority) ? fs.readFileSync(file_authority, 'utf8') : null;
    const credentials       = key_private && key_public && key_authority ? { key: key_private, cert: key_public, ca: key_authority } : null;

    if(credentials) {
        http.createServer(
            (req, res) => {
                const host = req.headers.host?.split(':')[0];
                res.writeHead(301, { Location: `https://${host}${HTTPS_PORT === 443 ? '' : `:${HTTPS_PORT}`}${req.url}` });
                res.end();
            }
        )
        .listen(HTTP_PORT, () => logger.info(`HTTP Redirector listening on port ${HTTP_PORT}`));

        https.createServer(credentials, app)
        .listen(HTTPS_PORT, () => logger.info(`HTTPS Server listening on port ${HTTPS_PORT}`));
    } else {
        app.listen(
            HTTP_PORT,
            () => logger.info(`HTTP Server listening on port ${HTTP_PORT}`)
        );
    }
}

export default listener;
