import path                 from 'path';
import fs                   from 'fs';
import getPublicUrlOrPath   from 'react-dev-utils/getPublicUrlOrPath';
import packagejson          from '../package.json';

const home          = fs.realpathSync(path.join(__dirname, '..'));
const resolveHome   = (relativePath: string) => path.join(home, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  packagejson.homepage,
  process.env.PUBLIC_URL
);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn: (path: string) => string, filePath: string) => {
    const extension = moduleFileExtensions.find(extension => fs.existsSync(resolveFn(`${filePath}.${extension}`)));

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
export default {
  'home':           resolveHome('.'),
  '.env':           resolveHome('.env'),
  'data':           resolveHome('data'),
  appBuild:         resolveHome('build'),
  appPublic:        resolveHome('public'),
  appHtml:          resolveHome('public/index.html'),
  appIndexJs:       resolveModule(resolveHome, 'src/index'),
  appPackageJson:   resolveHome('package.json'),
  appSrc:           resolveHome('src'),
  appTsConfig:      resolveHome('tsconfig.json'),
  //appJsConfig:      resolveApp('jsconfig.json'),
  yarnLockFile:     resolveHome('yarn.lock'),
  //testsSetup:       resolveModule(resolveApp, 'src/setupTests'),
  //proxySetup:       resolveApp('src/setupProxy.js'),
  appNodeModules:   resolveHome('node_modules'),
  //swSrc:            resolveModule(resolveApp, 'src/service-worker'),
  publicUrlOrPath,
  moduleFileExtensions
};
