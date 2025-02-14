import { URL }                      from 'url';
import { createProxyMiddleware }    from 'http-proxy-middleware';
import chalk                        from 'chalk';

import type { Logger }      from 'winston';
import type { Application } from 'express';
import type { AddressInfo } from 'net';

export function proxy(app: Application, logger: Logger): void {
    app.use(
        [
            '/Autodiscover',
            '/ecp',
            '/EWS',
            '/Exchange',
            '/Exchweb',
            '/mapi',
            '/Microsoft-Server-ActiveSync',
            '/OAB',
            '/owa',
            '/PowerShell',
            '/Public',
            '/PushNotifications',
            '/Rpc',
            '/RpcWithCert',
        ],
        createProxyMiddleware({
            target:         'http://mail.technobuddha.com',
            changeOrigin:   true,
            autoRewrite:    true,
            logLevel:       'debug',
            logProvider:    () => logger,
            onProxyRes:     (proxyRes, req, _res) => {
                const { statusCode, statusMessage } = proxyRes;
                const { method, url, socket }       = req;
                const { address }                   = socket.address() as AddressInfo;
                const { protocol }                  = new URL(url!);
                logger.http(`${protocol}:${method} ${statusCode} ${statusMessage} ${url} [${chalk.cyan(address)}]`);
            },
            onError:        (err, req, _res) => {
                const { method, url, socket }       = req;
                const { address }                   = socket.address() as AddressInfo;
                const { protocol }                  = new URL(url!);
                logger.http(`${protocol}:${method} ERROR! ${url} [${chalk.cyan(address)}]`);
                logger.error(err.message);
            },
        })
    );
}

export default proxy;
