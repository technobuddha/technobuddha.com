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
import map                          from 'lodash/map';
import join                         from 'lodash/join';

import home                         from '$/home';
import settings                     from '$/settings';
import externalPackages             from '$/external-packages';
import { replacer, reviver }        from '@technobuddha/library/json';
import { pgp }                      from '$db/driver';
import clientWebpackConfig          from '$client/webpack.config';
import api                          from './api';
import TranslationWorker            from './TranslationWorker';

import 'postcss.config';

const exit = () => {
    pgp.end();
    process.exit(0);
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGHUP', exit);
process.on('SIGQUIT', exit);
process.on('exit', exit);
process.on('uncaughtException', exit);

(async function main(){
    chalk.level = 3;
    
    const logLevel = (level: string) => {
        switch(level) {
            case 'error':   return chalk.red(level);
            case 'warn':    return chalk.yellow(level);
            case 'info':    return chalk.cyan(level);
            case 'http':    return chalk.blue(level);
            case 'verbose': return chalk.green(level);
            case 'debug': 
            case 'silly':
            default:        return level;  
        }
    }

    const logger = winston.createLogger({
        level:          'verbose',
        format:         winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.printf(info => `${info.timestamp} ${`[${logLevel(info.level)}]`.padEnd(10)} ${info.message}`),
                        ),
        transports:     [
            new winston.transports.Console(),
            new winston.transports.File({ filename: '/var/log/technobuddha/server.log' }),
        ],
    });


    const isDevelopment         = process.env.NODE_ENV !== 'production';
    const HTTP_PORT             = 8080;
    const HTTPS_PORT            = 8443;
    const title                 = (settings?.browser?.title)      ?? 'Untitled';
    const favicon               = (settings?.browser?.favicon)    ?? '/assets/favicon.ico';
    
    const translationWorker     = new TranslationWorker(home, logger);

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
                        const version   = fs.readJsonSync(path.resolve(home, 'node_modules', packageName, 'package.json')).version;
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

    const file_private      = path.join('/etc/letsencrypt/live', 'technobuddha', 'privkey.pem');
    const file_public       = path.join('/etc/letsencrupt/live', 'technobuddha', 'fullchain.pem');
    const file_authority    = path.join('/etc/letsencrupt/live', 'technobuddha', 'chain.pem');
    const key_private       = fs.existsSync(file_private)   ? fs.readFileSync(file_private,     'utf8') : null;
    const key_public        = fs.existsSync(file_public)    ? fs.readFileSync(file_public,      'utf8') : null;
    const key_authority     = fs.existsSync(file_authority) ? fs.readFileSync(file_authority,   'utf8') : null;
    const credentials       = key_private && key_public && key_authority ? { key: key_private, cert: key_public, ca: key_authority } : null;

    const views             = path.join(home, 'src/server/views');
    const app               = express();

    app.set('view engine', 'ejs');
    app.set('views',       views);

    app.use(cookieParser());
    app.use(express.json({reviver}));
    app.use(express.urlencoded({extended: true}));
    app.set('json replacer', replacer);

    logger.verbose(`Server booting... ${chalk.green(isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION')}`);

    app.use(
        (req, _res, next) => {
            const { protocol, method, url,  } = req;

            logger.info(`${protocol} ${method} ${url}`);
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
                    stats:          'errors-warnings',
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
        express.static(path.join(home, 'assets', '.well-known')),
        (_req, res) => {
            res.sendStatus(404);
        }
    )

    app.use(
        '/assets/',
        express.static(path.join(home, 'assets')),
        (_req, res) => {
            res.sendStatus(404);
        }
    );

    app.get(
        '/favicon.ico',
        express.static(path.join(home, 'assets')),
        (_req, res) => {
            res.sendStatus(404);
        }      
    )

    app.get(
        '/dist/*',
        express.static(home),
        (_req, res) => {
            res.sendStatus(404);
        }
    );

    app.get(
        '/cdn/*',
        (req, res) => {
            const name = req.url.substr(5);         // 5 is the length of '/cdn/'
            res.sendFile(path.resolve(home, 'node_modules', name));
        }
    );

    app.get(
        '/locales/*',
        express.static(home),
        (_req, res) => {
            res.sendStatus(404);
        }
    );

    app.post(
        '/locales/*',
        (req, res) => {
            translationWorker.translate(req.url, req.body);
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
        (_req, res) => {
            res.setHeader('Content-Type',   mime.getType('index.html') ?? 'text/html');
            res.setHeader('Cache-Control',  cacheControl(1));

            res.render('index.ejs', { title, preload, favicon });
        }
    );

    app.use(
        (_req, res) => {
            res.status(404).render('error/404.ejs');
        }
    );

    if(credentials) {
        http.createServer(
            (req, res) => {
                res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
                res.end()
            }
        )
        .listen(HTTP_PORT, () => logger.verbose(`HTTP Redirector listening on port ${HTTP_PORT}`));

        https.createServer(credentials, app)
        .listen(HTTPS_PORT, () => logger.verbose(`HTTPS Server listening on port %{HTTPS_PORT}`));
    } else {
        app.listen(
            HTTP_PORT,
            () => logger.verbose(`HTTP Server listening on port ${HTTP_PORT}`)
        );
    }

})();
