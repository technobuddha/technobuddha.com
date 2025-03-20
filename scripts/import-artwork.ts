#!/bin/env -S ts-node --prefer-ts-exts  -r ./config/env.ts -r tsconfig-paths/register
import cliProgress from 'cli-progress';
import chalk       from 'chalk';
import fs          from 'fs-extra';
import path        from 'path';
import glob        from 'glob-promise';

function out(text: string | undefined) {
    if(text) {
        process.stdout.write(text);
        process.stdout.write('\n');
    }
}

void (async function main() {
    out(chalk.magenta('Scanning for new artwork...'));

    const files = await glob('/mnt/music/Library/**/AlbumArt*_@(Large|Small).jpg')
    .then(art => art.filter(file => !fs.existsSync(path.join('../artwork', path.basename(file)))));

    const b1 = new cliProgress.SingleBar({
        format: `Artwork |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    });

    b1.start(files.length, 0, { speed: 'N/A'  });
    for(const file of files) {
        fs.copyFileSync(file, path.join('../artwork', path.basename(file)));
        b1.increment();
    }

    // stop the bar
    b1.stop();
}());
