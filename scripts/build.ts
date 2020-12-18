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

out('--server\n');
webpack(
    genServerWebpackConfig(false),
    (_error: Error, _stats: webpack.Stats) => {
        out('--client\n');
        webpack(
            genClientWebpackConfig(false),
            (_error: Error, _stats: webpack.Stats) => {
                out('--done\n');
            }
        );
    }
);
