import '#config/env';
import { space }                    from '@technobuddha/library/constants';
import { replacer, reviver }        from '@technobuddha/library/json';
import splitLines                   from '@technobuddha/library/splitLines';
import { matchesUA }                from 'browserslist-useragent';
import chalk                        from 'chalk';
import cookieParser                 from 'cookie-parser';
import express                      from 'express';
import fs                           from 'fs-extra';
import hbs                          from 'hbs';
import http                         from 'http';
import { createProxyMiddleware }    from 'http-proxy-middleware';
import https                        from 'https';
import mime                         from 'mime';
import path                         from 'path';
import process                      from 'process';
import webpack                      from 'webpack';
import devMiddleware                from 'webpack-dev-middleware';
import hotMiddleware                from 'webpack-hot-middleware';
import winston                      from 'winston';
import { genClientWebpackConfig }   from '#client/webpack.config';
import paths                        from '#config/paths';
import externalPackages             from '#config/external-packages';
import { pgp }                      from '#server/db/driver';
import settings                     from '#settings/browser';
import api                          from './api/router';
import TranslationWorker            from './TranslationWorker';
import packageJson                  from '~package.json';

import type { Response, Request, NextFunction } from 'express';
import type { IncomingMessage } from 'http';

(async function main(){
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const logLevel = (level: string) => {
        let colored: string;

        switch(level) {
            case 'error':   colored = chalk.red(level);     break;
            case 'warn':    colored = chalk.yellow(level);  break;
            case 'info':    colored = chalk.cyan(level);    break;
            case 'http':    colored = chalk.blue(level);    break;
            case 'verbose': colored = chalk.green(level);   break;
            case 'debug':   colored = chalk.magenta(level); break;
            case 'silly':
            default:        colored = level;                break;
        }

        return `${colored}${space.repeat(7 - level.length)}`;
    }

    const logger = winston.createLogger({
        level:          isDevelopment ? 'silly' : 'verbose',
        format:         winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.printf(info => `${info.timestamp} ${logLevel(info.level)} ${info.message}`),
                        ),
        transports:     [
            new winston.transports.Console(),
            new winston.transports.File({ filename: '/var/log/technobuddha/server.log' }),
        ],
    });

    const exit = () => {
        pgp.end();
        process.exit(0);
    }
    process.on('exit', exit);

    [ 'SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'uncaughtException' ].forEach(
        sig => process.on(
            sig,
            () => {
                logger.error(sig);
                exit()
            }
        )
    );

    const HTTP_PORT             = isDevelopment ? 8080 : 80;
    const HTTPS_PORT            = isDevelopment ? 8443 : 443;
    const title                 = (settings?.title)      ?? 'Untitled';
    const favicon               = (settings?.favicon)    ?? '/assets/favicon.ico';

    function cacheControl(days = 0) {
        const seconds = days * 24 * 60 * 60;

        if (seconds === 0 || isDevelopment)
            return 'public, no-cache, no-store, must-revalidate';
        else
            return `public, max-age=${seconds}`;
    }

    let preload: string;
    if (process.env.USE_CDN === 'true') { 
        const cdn = 'https://cdnjs.cloudflare.com/ajax/libs';
        preload = Object.entries(externalPackages)
        .map(([packageName, info]) => {
            const version   = fs.readJsonSync(path.join(paths.node_modules, packageName, 'package.json')).version;
            const url       = `${cdn}/${info.alias ?? packageName}/${version}/${isDevelopment ? info.development : info.production}`;
            return `<script type="application/javascript" src="${url}"></script>`;
        })
        .join('\n        ');
    } else {
        preload = Object.entries(externalPackages)
        .map(([packageName, info]) => {
            const url = info.localPath
                    ?   path.join('/cdn', info.alias ?? packageName, info.localPath, isDevelopment ? info.development : info.production)
                    :   path.join('/cdn', info.alias ?? packageName, isDevelopment ? info.development : info.production);
            return `<script type="application/javascript" src="${url}"></script>`;
        })
        .join('\n        ');
    }

    const certificate_home  = process.env.CERTIFICATE_HOME ?? '/etc/letsencrypt/live';
    const file_private      = path.join(certificate_home, 'technobuddha', 'privkey.pem');
    const file_public       = path.join(certificate_home, 'technobuddha', 'fullchain.pem');
    const file_authority    = path.join(certificate_home, 'technobuddha', 'chain.pem');
    const key_private       = fs.existsSync(file_private)   ? fs.readFileSync(file_private,   'utf8') : null;
    const key_public        = fs.existsSync(file_public)    ? fs.readFileSync(file_public,    'utf8') : null;
    const key_authority     = fs.existsSync(file_authority) ? fs.readFileSync(file_authority, 'utf8') : null;
    const credentials       = key_private && key_public && key_authority ? { key: key_private, cert: key_public, ca: key_authority } : null;

    logger.verbose(`Server booting... ${chalk.green(isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION')}`);

    function status404(_req: Request, res: Response) {
        res.statusMessage = 'NOT FOUND';
        res.status(404).render('error/404.hbs', { favicon });
    }
    
    const app = express();

    if(!isDevelopment) {
        const logProxy = (req: Request, res: Response | IncomingMessage) => {
            const { statusCode, statusMessage } = res;
            const { protocol, method, url, ip } = req;
            logger.http(`${protocol}:${method} ${statusCode} ${statusMessage} ${url} [${chalk.cyan(ip)}]`) 
        }

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
                '/RpcWithCert'
            ],
            createProxyMiddleware({
                target:         'http://mail.technobuddha.com',
                changeOrigin:   true,
                autoRewrite:    true,
                logLevel:       'debug',
                logProvider:    () => logger,
                onProxyRes:     (proxyRes, req, _res) => logProxy(req, proxyRes),
                onError:        (err, req, res) => {
                    logProxy(req, res);
                    logger.error(err.message);
                }
            })
        );
    }

    app
    .set('view engine', hbs)
    .set('views',       paths.views)
    .use(cookieParser())
    .use(express.json({reviver}))
    .use(express.urlencoded({extended: true}))
    .set('json replacer', replacer)
    .use(
        (req, res, next) => {
            const start = Date.now();

            const end   = res.end;
            res.end = function(...args: any[]) {
                const { protocol, method, originalUrl, url, ip } = req;
                const { statusCode, statusMessage } = res;
                const duration = Date.now() - start;
                logger.http(`${protocol}:${method} ${statusCode} ${statusMessage ? `${statusMessage} ` : ``}${chalk.green(`${duration}ms`)} ${originalUrl ?? url} [${chalk.cyan(ip)}]`);

                res.end = end;
                res.end(...args);
            }

            next();
        }
    )
    .get(
        '/oeoaa',
        (_req, res) => {
            throw new Error('Ting Tang Walla Walla Bing Bang');
            res.send('Ting Tang Walla Walla Bing Bang\n');
        }
    )
    .use(
        '/.well-known/',
        express.static(path.join(paths.webroot, '.well-known')),
        status404
    );

    if (isDevelopment) {
        const clientWebpackConfig   = genClientWebpackConfig(isDevelopment, logger);
        const compiler              = webpack(clientWebpackConfig);

        // The type definition for compiler.hooks is missing the infrastructureLog property
        (compiler.hooks as any).infrastructureLog.tap(
            'server',
            (name: string, type: string, args: string[]) => {
                if(type === 'error' || type === 'warn' || type === 'info' || type === 'debug') {
                    for(const arg of args) {
                        logger[type](`[${chalk.yellow(name)}] ${arg}`);
                    }
                    return false;
                }
                return true;
            }
        );

        app.use(
            devMiddleware(
                compiler,
                {
                    publicPath: clientWebpackConfig.output?.publicPath ?? '/dist',
                }
            )
        )
        .use(
            hotMiddleware(
                compiler,
                {
                    log: (message: string) => logger.debug(`[${chalk.yellow('webpack-hot-middleware')}] ${message}`)
                }
            )
        );

        if(process.env.GCLOUD_PROJECT && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            const translationWorker     = new TranslationWorker(logger);

            app.post(
                '/locales/*',
                (req, res) => {
                    const [,,, nsfile] = req.url.split('/');
                    const [ns]         = nsfile.split('.');
                    translationWorker.enqueue(ns, req.body);
                    res.end();
                }
            );
        }
    }

    app
    .use('/api', api)
    .use(
        '/assets/',
        express.static(paths.assets),
        status404
    )
    .get(
        '/favicon.ico',
        express.static(paths.assets),
        status404
    )
    .get(
        '/dist/',
        express.static(paths.dist),
        status404
    )
    .get(
        '/cdn/*',
        (req, res) => {
            const name = req.url.substr(5);         // 5 is the length of '/cdn/'
            res.sendFile(path.join(paths.node_modules, name));
        }
    )
    .get(
        '/locales/*',
        express.static(paths.home),
        status404
    )
    .get(
        '/*',
        (req, res) => {
            res.setHeader('Content-Type',   mime.getType('index.html') ?? 'text/html');
            res.setHeader('Cache-Control',  cacheControl(1));

            const userAgent = req.headers['user-agent'];
            if(userAgent && !matchesUA(userAgent, { browsers: packageJson.browserslist, allowHigherVersions: true})) {
                // if(req.cookies['peril'] !== 'accepted') {
                //     logger.warn(`user-agent not supported: "${userAgent}"`);
                //     res.render('abandon-hope.hbs', { favicon, years: new Date().getFullYear() - 1314 });
                //     return;
                // }
            }

            res.render('index.hbs', { title, preload, favicon });
        }
    )
    .use(status404)
    .use(
        (err: Error, _req: Request, res: Response, _next: NextFunction) => {
            logger.error(`Error: ${err.message}`);
            if(err.stack) {
                for(const stack of splitLines(err.stack).slice(1)) {
                    logger.debug(stack);
                }
            }

            res.status(500).render('error/500.hbs', { favicon });
        }
    );

    if(credentials) {
        http.createServer(
            (req, res) => {
                const host = req.headers.host?.split(':')[0];
                res.writeHead(301, { Location: `https://${host}${HTTPS_PORT === 443 ? '' : `:${HTTPS_PORT}`}${req.url}` });
                res.end()
            }
        )
        .listen(HTTP_PORT, () => logger.info(`HTTP Redirector listening on port ${HTTP_PORT}`));

        https.createServer(credentials, app)
        .listen(HTTPS_PORT, () => logger.info(`HTTPS Server listening on port ${HTTPS_PORT}`));
    } else {
        http.createServer(
            (req, res) => {
                const host = req.headers.host?.split(':')[0];
                res.writeHead(301, { Location: `http://${host}${HTTP_PORT === 80 ? '' : `:${HTTP_PORT}`}${req.url}` });
                res.end()
            }
        )
        .listen(HTTPS_PORT, () => logger.info(`HTTPS Redirector listening on port ${HTTPS_PORT}`));
        
        app.listen(
            HTTP_PORT,
            () => logger.info(`HTTP Server listening on port ${HTTP_PORT}`)
        );
    }
})();
