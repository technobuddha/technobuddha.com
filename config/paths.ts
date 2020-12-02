import path from 'path';
import fs   from 'fs';

const home          = fs.realpathSync(path.join(__dirname, '..'));
const resolveHome   = (...relativePath: string[]) => path.join(home, ...relativePath);

export default {
    home:                       resolveHome('.'),
    env:                        resolveHome('.env'),
    data:                       resolveHome('data'),
    dist:                       resolveHome('dist'),
    src:                        resolveHome('src'),
    node_modules:               resolveHome('node_modules'),
    webpackHotMiddlewareClient: resolveHome('node_modules', 'webpack-hot-middleware', 'client.js'),
    assets:                     resolveHome('assets'),
    client:                     resolveHome('src', 'client'),
    clientEntry:                resolveHome('src', 'client', 'index.tsx'),
    server:                     resolveHome('src', 'server'),
    serverEntry:                resolveHome('src', 'server', 'server.ts'),
    views:                      resolveHome('src', 'server', 'views'),
    locales:                    resolveHome('locales'),
    bin:                        resolveHome('bin'),
};
