import path                         from 'path';
import process                      from 'process';
import mime                         from 'mime';
import express                      from 'express';
import fs                           from 'fs-extra';
import splitLines                   from '@technobuddha/library/splitLines';
import { matchesUA }                from 'browserslist-useragent';
import paths                        from '#config/paths';
import externalPackages             from '#config/external-packages';
import browserSettings              from '#settings/browser';
import userInterfaceSettings        from '#settings/user-interface';
import packageJson                  from '~package.json';

import type { Logger }      from 'winston';
import type { Application, Request, Response, NextFunction } from 'express';

const isDevelopment = process.env.NODE_ENV !== 'production';

function status404(_req: Request, res: Response) {
    res.statusMessage = 'NOT FOUND';
    res.status(404).render('error/404.hbs', { favicon: browserSettings.favicon, homePage: userInterfaceSettings.homePage });
}

function cacheControl(days = 0) {
    const seconds = days * 24 * 60 * 60;

    if(seconds === 0 || isDevelopment)
        return 'public, no-cache, no-store, must-revalidate';

    return `public, max-age=${seconds}`;
}

let preload: string;
if(process.env.USE_CDN === 'true') {
    const cdn = 'https://cdnjs.cloudflare.com/ajax/libs';
    preload = Object.entries(externalPackages)
    .map(([ packageName, info ]) => {
        const { version } = fs.readJsonSync(path.join(paths.node_modules, packageName, 'package.json'));
        const url         = `${cdn}/${info.alias ?? packageName}/${version}/${isDevelopment ? info.development : info.production}`;
        return `<script type="application/javascript" src="${url}"></script>`;
    })
    .join('\n        ');
} else {
    preload = Object.entries(externalPackages)
    .map(([ packageName, info ]) => {
        const url = info.localPath
            ?   path.join('/cdn', info.alias ?? packageName, info.localPath, isDevelopment ? info.development : info.production)
            :   path.join('/cdn', info.alias ?? packageName, isDevelopment ? info.development : info.production);
        return `<script type="application/javascript" src="${url}"></script>`;
    })
    .join('\n        ');
}

export function staticContent(app: Application, logger: Logger): void {
    app
    .get(
        '/oeoaa',
        (_req, res) => {
            res.send('Ting Tang Walla Walla Bing Bang\n');
        }
    )
    .use(
        '/.well-known/',
        express.static(path.join(paths.webroot, '.well-known')),
        status404
    )
    .use(
        '/assets',
        express.static(paths.assets),
        status404
    )
    .get(
        '/favicon.ico',
        express.static(paths.assets),
        status404
    )
    .use(
        '/dist',
        express.static(paths.dist),
        status404
    )
    .get(
        '/cdn/*',
        (req, res) => {
            const name = req.url.slice(5);         // 5 is the length of '/cdn/'
            res.sendFile(path.join(paths.node_modules, name));
        }
    )
    .get(
        '/locales/*',
        express.static(paths.home),
        status404
    )
    .get(
        '/art/:id',
        (req, _res, next) => {
            req.url = `AlbumArt_{${req.params.id.toUpperCase()}}_Large.jpg`;
            next();
        },
        express.static(path.join(paths.home, '../artwork/')),
        status404
    )
    .get(
        '/*',
        (req, res) => {
            res.setHeader('Content-Type',   mime.getType('index.html') ?? 'text/html');
            res.setHeader('Cache-Control',  cacheControl(1));

            const userAgent = req.headers['user-agent'];
            if(userAgent && !matchesUA(userAgent, { browsers: packageJson.browserslist, allowHigherVersions: true })) {
                // if(req.cookies['peril'] !== 'accepted') {
                //     logger.warn(`user-agent not supported: "${userAgent}"`);
                //     res.render('abandon-hope.hbs', { favicon, years: new Date().getFullYear() - 1314 });
                //     return;
                // }
            }

            res.render('index.hbs', { title: browserSettings.title, preload, favicon: browserSettings.favicon });
        }
    )
    .use(status404)
    .use(
        (err: Error, _req: Request, res: Response, _next: NextFunction) => {
            logger.error(`Error: ${err.message}`);
            if(err.stack) {
                for(const stack of splitLines(err.stack).slice(1))
                    logger.debug(stack);
            }

            res.status(500).render('error/500.hbs', { favicon: browserSettings.favicon });
        }
    );
}

export default staticContent;
