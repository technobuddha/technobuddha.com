#!/bin/env -S ts-node -r ./config/env.ts -r tsconfig-paths/register
import process                      from 'process';
import webpack                      from 'webpack';
import chalk                        from 'chalk';
import { genServerWebpackConfig }   from '#server/webpack.config';
import { genClientWebpackConfig }   from '#client/webpack.config';

process.env.NODE_ENV = 'production';

chalk.level = 3;    // Tell chalk that we support full RGB colors

function out(text: string) {
    process.stdout.write(text);
}

out(`Compiling ${chalk.green('server')}\n`);
webpack(
    genServerWebpackConfig(false),
    (error: Error, stats: webpack.Stats) => {
        out(stats.toString())
        if(error) {
            console.log(error);
            process.exit(1);
        } else {
            out(`Compiling ${chalk.green('client')}\n`);
            webpack(
                genClientWebpackConfig(false),
                (error: Error, stats: webpack.Stats) => {
                    out(stats.toString())
                    if(error) {
                        console.log(error);
                        process.exit(1);
                    } else {
                        out('--done\n');
                        process.exit(0);
                    }
                }
            );
        }  
    }
);
