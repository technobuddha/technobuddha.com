#!/bin/env -S ts-node --prefer-ts-exts -r ./config/env.ts -r tsconfig-paths/register
import fs                           from 'fs-extra';
import process                      from 'process';
import webpack                      from 'webpack';
import chalk                        from 'chalk';
import binaryUnits                  from '@technobuddha/library/binaryUnits';
import { genServerWebpackConfig }   from '#server/webpack.config';
import { genClientWebpackConfig }   from '#client/webpack.config';
import type { PackageJson }         from 'type-fest';

process.env.NODE_ENV = 'production';

chalk.level = 3;    // Tell chalk that we support full RGB colors

function out(text: string) {
    process.stdout.write(text);
}

function report(error: Error, stats: webpack.Stats): void {
    if(error) {
        out(`\n${chalk.red(error)}\n`);
        process.exit(1);
    }

    out(` ${(stats.endTime ?? 0) - (stats.startTime ?? 0)}ms\n`);
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

        out(`${filename.padEnd(40)} ${(a.isOverSizeLimit ? chalk.red : chalk.green)(binaryUnits(fs.statSync(a.existsAt).size)).padStart(20)}\n`);
    }
}

out(`Compiling ${chalk.blue('server')}`);
webpack(
    genServerWebpackConfig(false),
    (errorServer: Error, statsServer: webpack.Stats) => {
        report(errorServer, statsServer);

        out(`\nCompiling ${chalk.blue('client')}`);
        webpack(
            genClientWebpackConfig(false),
            (errorClient: Error, statsClient: webpack.Stats) => {
                report(errorClient, statsClient);

                out(`\nBuilding ${chalk.blue('package.json')}`);

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
                out(`\n--${chalk.blue('done')}\n`);
                process.exit(0);
            }
        );
    }
);
