#!/bin/env -S ts-node -r ./config/env.ts

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV  = 'development';



// Ensure environment variables are read.
// import getClientEnvironment from '../config/env';

// import fs from 'fs';
import webpack from 'webpack';
// import WebpackDevServer from 'webpack-dev-server';
//import clearConsole from 'react-dev-utils/clearConsole';
// import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
// import {
//   choosePort,
//   createCompiler,
//   prepareProxy,
//   prepareUrls,
//} from 'react-dev-utils/WebpackDevServerUtils';
//import openBrowser from 'react-dev-utils/openBrowser';
//import semver from 'semver';
//import paths from '../config/paths';
//import configFactory from '../config/webpack.config';
//import createDevServerConfig from '../config/webpackDevServer.config';
//import react from 'react';//require.resolve('react', { paths: [paths.appPath] });

//import { checkBrowsers } from 'react-dev-utils/browsersHelper';

/// 
import repeat                                   from 'lodash/repeat';
import chalk                                    from 'chalk'; chalk.level = 3;    // Tell chalk that we support full RGB colors
import { out, clearScreen, header, screenSize } from '@technobuddha/vt100';
import { spawn, ChildProcess }                  from 'child_process';
import { genServerWebpackConfig }               from '../src/server/webpack.config';

let serverProcess: ChildProcess | null = null;

const startServer   = () => {
    if(serverProcess) {
        out(chalk.red(`\n\nServer changed, restarting...\n\n`));
        stopServer();
    }

    serverProcess = spawn('node', ['./bin/server.js'], { stdio: 'inherit'});
}

const stopServer    = () => {
    if(serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
}

const exit = () => {
    stopServer();
    process.exit(0);
}

['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtexception'].forEach(
    sig => process.on(sig, exit)
);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

webpack(genServerWebpackConfig(true)).watch(
    {},
    (error: Error, stats: webpack.Stats) => {
       if(error ?? stats.hasErrors())
           process.stdout.write(`${stats.toString('errors-only')}\n`);
       else
           startServer();
    }
);

const {width} = screenSize();

clearScreen();
out(header());
out(`${repeat('=', width)}\n`)

/*
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;


// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT ?? '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
    console.log(
        chalk.cyan(
            `Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`
        )
    );
    console.log(
        `If this was unintentional, check that you haven't mistakenly set it in your shell.`
    );
    console.log(
        `Learn more here: ${chalk.yellow('https://cra.link/advanced-config')}`
    );
    console.log();
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then((port: number | null) => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;

    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
    const urls = prepareUrls(
      protocol,
      HOST,
      port,
      paths.publicUrlOrPath.slice(0, -1)
    );
    const devSocket = {
      warnings: (warnings: string) =>
        devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: (errors: string) =>
        devServer.sockWrite(devServer.sockets, 'errors', errors),
    };
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      tscCompileOnError,
      webpack,
    });
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(
      proxySetting,
      paths.appPublic,
      paths.publicUrlOrPath
    );
    // Serve webpack assets generated by the compiler over a web server.
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }

      if (env.raw.FAST_REFRESH && semver.lt(react.version, '16.10.0')) {
        console.log(
          chalk.yellow(
            `Fast Refresh requires React 16.10 or higher. You are using React ${react.version}.`
          )
        );
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', function () {
        devServer.close();
        process.exit();
      });
    }
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
*/