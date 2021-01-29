#!/bin/env -S ts-node --prefer-ts-exts -r ./config/env.ts -r tsconfig-paths/register
import fs                           from 'fs-extra';
import process                      from 'process';
import webpack                      from 'webpack';
import chalk                        from 'chalk';
import shell                        from 'shelljs';
import metricUnits                  from '@technobuddha/library/metricUnits';
import binaryUnits                  from '@technobuddha/library/binaryUnits';
import { genServerWebpackConfig }   from '#server/webpack.config';
import { genClientWebpackConfig }   from '#client/webpack.config';
import type { PackageJson }         from 'type-fest';
chalk.level = 3;

process.env.NODE_ENV = 'production';

function out(text: string | undefined) {
    if(text)
        process.stdout.write(text);
}

function report(error: Error, stats: webpack.Stats): void {
    if(error) {
        out(`\n${chalk.red(error)}\n`);
        process.exit(1);
    }

    // out(` ${(stats.endTime ?? 0) - (stats.startTime ?? 0)}ms\n`);
    if(stats.compilation.errors.length) {
        out(`${chalk.red('Errors:')}\n`);
        for(const e of stats.compilation.errors) {
            out(`${e.message}\n`);
        }
    }

    if(stats.compilation.warnings.length) {
        out(`${chalk.yellow('Warnings:')}\n`);
        for(const w of stats.compilation.warnings) {
            out(`${w.message}\n`);
        }
    }

    if(stats.compilation.errors.length) process.exit(1);

    for(const [filename, asset] of Object.entries(stats.compilation.assets)) {
        const a: any = asset;

        out(`${' '.repeat(50)}${filename.padEnd(40)} ${(a.isOverSizeLimit ? chalk.red : chalk.green)(binaryUnits(fs.statSync(a.existsAt).size, { format: '###.00', pad: 6 })).padStart(20)}\n`);
    }
}

function run(res: shell.ShellString) {
    if(res.code !== 0) {
        if(res.stdout) out(chalk.yellow(res.stdout));
        if(res.stderr) out(chalk.red(res.stderr));
        process.exit(res.code);
    }
}

let timer: number;
function start(task: string, text?: string) {
    out(chalk.whiteBright(task));
    out(' '.repeat(12 - task.length));
    if(text) {
        out(chalk.blue(text));
        out(' '.repeat(20 - text.length));
    } else
        out(' '.repeat(20));
    timer = Date.now();
}

function finish() {
    out(chalk.cyanBright(`${metricUnits((Date.now() - timer) / 1000, { format: '##0.00', pad: 6 })}s\n`));
}

start('Cleaning');
run(shell.rm('-rf', 'deploy'));
run(shell.mkdir('deploy'));
run(shell.mkdir('deploy/bin'));
run(shell.mkdir('deploy/dist'));
finish();

start('Compiling', 'server');
webpack(
    genServerWebpackConfig(false),
    (errorServer: Error, statsServer: webpack.Stats) => {
        finish();
        report(errorServer, statsServer);

        start('Compiling', 'client');
        webpack(
            genClientWebpackConfig(false),
            (errorClient: Error, statsClient: webpack.Stats) => {
                finish();
                report(errorClient, statsClient);

                start('Copying', 'files');
                run(shell.cp('-r', [ 'assets', 'webroot', 'data', 'locales', 'views', '.env', 'package/*' ], 'deploy'));
                finish();

                start('Building', 'package.json');
                const pj = JSON.parse(fs.readFileSync('package.json').toString()) as PackageJson;

                pj.name = 'gateway';
                pj.description = 'gateway';
                delete pj.repository;
                delete pj.bugs;
                delete pj.homepage;

                pj.scripts = { start: 'NODE_ENV=production nodemon --watch /etc/letsencrypt/live/technobuddha --watch bin --ext pem,js bin/server.js' };
                pj.dependencies = Object.fromEntries(
                    Object.entries(pj.dependencies!)
                    .map(([k, v]) => [k, v.startsWith('^') ? v.slice(1) : v])
                );
                pj.devDependencies = Object.fromEntries(
                    Object.entries(pj.devDependencies!)
                    .map(([k, v]) => [k, v.startsWith('^') ? v.slice(1) : v])
                );

                fs.writeFileSync('deploy/package.json', JSON.stringify(pj, undefined, 2), 'utf8');
                finish();

                start('npm', 'install');
                shell.exec('npm install --prefix ./deploy', { silent: true });
                finish();

                out(`\n--${chalk.green('done')}\n`);
                process.exit(0);
            }
        );
    }
);
