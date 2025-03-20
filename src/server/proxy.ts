import { type AddressInfo } from 'node:net';

import chalk from 'chalk';
import { type Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { type Logger } from 'winston';

export function proxy(app: Application, logger: Logger): void {
  app.use(
    createProxyMiddleware({
      pathFilter: (_path, req) => ['verdaccio.technobuddha.com'].includes(req.hostname),
      target: 'http://verdaccio.technobuddha.com',
      changeOrigin: true,
      autoRewrite: true,
      logger,
      on: {
        proxyRes: (proxyRes, req, _res) => {
          const { statusCode, statusMessage } = proxyRes;
          const { method, url, socket } = req;
          const { address } = socket.address() as AddressInfo;
          // const { protocol } = new URL(url);
          logger.http(`${method} ${statusCode} ${statusMessage} ${url} [${chalk.cyan(address)}]`);
        },
        error: (err, req, _res) => {
          const { method, url, socket } = req;
          const { address } = socket.address() as AddressInfo;
          const { protocol } = new URL(url);
          logger.http(`${protocol}:${method} ERROR! ${url} [${chalk.cyan(address)}]`);
          logger.error(err.message);
        },
      },
    }),
  );
}
