import '#config/env';
import process                      from 'process';
import fs                           from 'fs-extra';
import path                         from 'path';
import http                         from 'http';
import https                        from 'https';
import express                      from 'express';
import { createProxyMiddleware }    from 'http-proxy-middleware';
import chalk                        from 'chalk';
import cookieParser                 from 'cookie-parser';
import webpack                      from 'webpack';
import devMiddleware                from 'webpack-dev-middleware';
import hotMiddleware                from 'webpack-hot-middleware';
import mime                         from 'mime';
import winston                      from 'winston';
import { matchesUA }                from 'browserslist-useragent';

import map                          from 'lodash/map';
import join                         from 'lodash/join';
import repeat                       from 'lodash/repeat';

import paths                        from '#config/paths';
import settings                     from '#settings/browser';
import externalPackages             from '#config/external-packages';
import { replacer, reviver }        from '@technobuddha/library/json';
import { space }                    from '@technobuddha/library/constants';
import { pgp }                      from '#db/driver';
import { genClientWebpackConfig }   from '#client/webpack.config';

import api                          from './api';
import TranslationWorker            from './TranslationWorker';

import packageJson                  from '~package.json';

const exit = () => {
    pgp.end();
    process.exit(0);
}

[ 'SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtException' ].forEach(
    sig => process.on(sig, exit)
);

(async function main(){
    chalk.level = 3;
    
    const logLevel = (level: string) => {
        let colored: string;

        switch(level) {
            case 'error':   colored = chalk.red(level);     break;
            case 'warn':    colored = chalk.yellow(level);  break;
            case 'info':    colored = chalk.cyan(level);    break;
            case 'http':    colored = chalk.blue(level);    break;
            case 'verbose': colored = chalk.green(level);   break;
            case 'debug': 
            case 'silly':
            default:        colored = level;                break;
        }

        return `${colored}${repeat(space, 7 - level.length)}`
    }

    const logger = winston.createLogger({
        level:          'verbose',
        format:         winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.printf(info => `${info.timestamp} ${logLevel(info.level)} ${info.message}`),
                        ),
        transports:     [
            new winston.transports.Console(),
            new winston.transports.File({ filename: '/var/log/technobuddha/server.log' }),
        ],
    });


    const isDevelopment         = process.env.NODE_ENV !== 'production';
    const HTTP_PORT             = 8080;
    const HTTPS_PORT            = 8443;
    const title                 = (settings?.title)      ?? 'Untitled';
    const favicon               = (settings?.favicon)    ?? '/assets/favicon.ico';
    
    const clientWebpackConfig   = genClientWebpackConfig(isDevelopment, logger);
    const translationWorker     = new TranslationWorker(logger);

    function cacheControl(days = 0) {
        const seconds = days * 24 * 60 * 60;

        if (seconds === 0 || isDevelopment)
            return 'public, no-cache, no-store, must-revalidate';
        else
            return `public, max-age=${seconds}`;
    }

    let preload: string;
    // eslint-disable-next-line no-constant-condition
    if (process.env.USE_CDN === 'true') { 
        const cdn = 'https://cdnjs.cloudflare.com/ajax/libs';
        preload =
            join (
                map (
                    externalPackages,
                    (info, packageName) => {
                        const version   = fs.readJsonSync(path.join(paths.node_modules, packageName, 'package.json')).version;
                        const url       = `${cdn}/${info.alias ?? packageName}/${version}/${isDevelopment ? info.development : info.production}`;
                        return `<script type="application/javascript" src="${url}"></script>`;
                    }
                ),
                ''
            );
    } else {
        preload = join(
            map(
                externalPackages,
                (info, packageName) => {
                    const url   =
                        info.localPath
                        ?   path.join('/cdn', info.alias ?? packageName, info.localPath, isDevelopment ? info.development : info.production)
                        :   path.join('/cdn', info.alias ?? packageName, isDevelopment ? info.development : info.production);
                    return `<script type="application/javascript" src="${url}"></script>`;
                }
            ),
            '\n        '
        );
    }

    const certificate_home  = process.env.CERTIFICATE_HOME ?? '/etc/letsencrypt/live';
    const file_private      = path.join(certificate_home, 'technobuddha', 'privkey.pem');
    const file_public       = path.join(certificate_home, 'technobuddha', 'fullchain.pem');
    const file_authority    = path.join(certificate_home, 'technobuddha', 'chain.pem');
    const key_private       = fs.existsSync(file_private)   ? fs.readFileSync(file_private,   'utf8') : null;
    const key_public        = fs.existsSync(file_public)    ? fs.readFileSync(file_public,    'utf8') : null;
    const key_authority     = fs.existsSync(file_authority) ? fs.readFileSync(file_authority, 'utf8') : null;
    const credentials       = key_private && key_public && key_authority ? { key: key_private, cert: key_public, ca: key_authority } : null;

    const app               = express();

    app.set('view engine', 'hbs');
    app.set('views',       paths.views);

    app.use(cookieParser());
    app.use(express.json({reviver}));
    app.use(express.urlencoded({extended: true}));
    app.set('json replacer', replacer);

    logger.verbose(`Server booting... ${chalk.green(isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION')}`);

    app.use(
        (req, _res, next) => {
            const { protocol, method, url,  } = req;

            logger.http(`${protocol} ${method} ${url}`);
            next();
        }
    );

    app.get(
        '/oeoaa',
        (_req, res) => {
            res.send('Ting Tang Walla Walla Bing Bang\n')
        }
    )

    if (isDevelopment) {
        const compiler = webpack(clientWebpackConfig);

        app.use(
            devMiddleware(
                compiler,
                {
                    publicPath:     clientWebpackConfig.output?.publicPath ?? '/dist',
                }
            )
        );

        app.use(
            hotMiddleware(
                compiler,
                {
                    log:    console.log
                }
            )
        );
    }

    app.use('/api', api);

    app.use(
        '/.well-known/',
        express.static(path.join(paths.assets, '.well-known')),
        (_req, res) => {
            res.sendStatus(404);
        }
    )

    app.use(
        '/assets/',
        express.static(paths.assets),
        (_req, res) => {
            res.sendStatus(404);
        }
    );

    app.get(
        '/favicon.ico',
        express.static(paths.assets),
        (_req, res) => {
            res.sendStatus(404);
        }      
    )

    app.get(
        '/dist/*',
        express.static(paths.home),
        (_req, res) => {
            res.sendStatus(404);
        }
    );

    app.get(
        '/cdn/*',
        (req, res) => {
            const name = req.url.substr(5);         // 5 is the length of '/cdn/'
            res.sendFile(path.join(paths.node_modules, name));
        }
    );

    app.get(
        '/locales/*',
        express.static(paths.home),
        (_req, res) => {
            res.sendStatus(404);
        }
    );

    app.post(
        '/locales/*',
        (req, res) => {
            const [,,, nsfile] = req.url.split('/');
            const [ns]         = nsfile.split('.');
            translationWorker.enqueue(ns, req.body);
            res.end();
        }
    );

    app.use(
       createProxyMiddleware(
           (_path, req) => {
               return /^mail\.(technobuddha\.com|hill\.software)$/i.test(req.hostname);
           },
           {
                target:         'http://mail.technobuddha.com',
                changeOrigin:   true,
                autoRewrite:    true,
                logLevel:       'error',
                logProvider:    () => logger,
            }
        )
    )

    app.get(
        '/*',
        (req, res) => {
            res.setHeader('Content-Type',   mime.getType('index.html') ?? 'text/html');
            res.setHeader('Cache-Control',  cacheControl(1));

            const userAgent = req.headers['user-agent'];
            if(userAgent && !matchesUA(userAgent, { browsers: packageJson.browserslist, allowHigherVersions: true})) {
                if(req.cookies['peril'] !== 'accepted') {
                    logger.warn(`user-agent not supported: "${userAgent}"`);
                    res.render('abandon-hope.hbs', { favicon, years: new Date().getFullYear() - 1314 });
                    return;
                }
            }

            res.render('index.hbs', { title, preload, favicon });
        }
    );

    app.use(
        (_req, res) => {
            res.status(404).render('error/404.hbs');
        }
    );

    if(credentials) {
        http.createServer(
            (req, res) => {
                res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
                res.end()
            }
        )
        .listen(HTTP_PORT, () => logger.verbose(`HTTP Redirecter listening on port ${HTTP_PORT}`));

        https.createServer(credentials, app)
        .listen(HTTPS_PORT, () => logger.verbose(`HTTPS Server listening on port ${HTTPS_PORT}`));
    } else {
        app.listen(
            HTTP_PORT,
            () => logger.verbose(`HTTP Server listening on port ${HTTP_PORT}`)
        );
    }

})();
