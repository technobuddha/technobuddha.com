#!/bin/env -S ts-node --prefer-ts-exts  -r ./config/env.ts -r tsconfig-paths/register
import path        from 'path';
import paths       from '#config/paths';
import { db }      from '#db/driver';
import nReadLines  from 'n-readlines';
import cliProgress from 'cli-progress';
import chalk       from 'chalk';

(async function main() {

    const b1 = new cliProgress.SingleBar({
        format: `Tracks |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });


    await db.task(async t => {
        await t.none('TRUNCATE tracknew;');

        const lineReader = new nReadLines(path.join(paths.data, 'tracks.mldata'));

        let line: Buffer | false;
        let index = 0;
        // eslint-disable-next-line no-cond-assign
        while(line = lineReader.next()) {
            if(index++ === 0) {
                b1.start(Number.parseInt(line.toString()), 0, { speed: "N/A"  });
            } else {
                const json = JSON.parse(line.toString());
                const contentid = json.ContentID;

                if(contentid) {
                    await t.none(
                        'INSERT INTO tracknew(contentid, mldata) VALUES($(contentid), $(json:json))',
                        { contentid, json }
                    );
                } else {
                    console.log(`\n\n${json.Path}`);
                }

                b1.increment();
            }
        }

        await t.none('ALTER TABLE tracknew RENAME TO trackxxx;');
        await t.none('ALTER TABLE trackold RENAME TO tracknew;');
        await t.none('ALTER TABLE track    RENAME TO trackold;');
        await t.none('ALTER TABLE trackxxx RENAME TO track;');
        await t.none('TRUNCATE tracknew;');
    });

    // stop the bar
    b1.stop();
})();
