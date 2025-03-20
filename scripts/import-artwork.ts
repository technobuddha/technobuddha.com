#!/bin/env tsx
import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';
import cliProgress from 'cli-progress';
import { glob } from 'glob';

function out(text: string | undefined): void {
  if (text) {
    process.stdout.write(text);
    process.stdout.write('\n');
  }
}

void (async function main() {
  out(chalk.magenta('Scanning for new artwork...'));

  const files = await glob('/media/music/Library/**/AlbumArt*_@(Large|Small).jpg').then(
    async (artwork) =>
      (
        await Promise.all(
          artwork.map(async (art) =>
            fs
              .stat(art)
              .then(() => null)
              .catch(() => art),
          ),
        )
      ).filter(Boolean) as string[],
  );

  const b1 = new cliProgress.SingleBar({
    format: `Artwork |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  b1.start(files.length, 0, { speed: 'N/A' });

  for (const file of files) {
    await fs.copyFile(file, path.join('../artwork', path.basename(file)));
    b1.increment();
  }

  // stop the bar
  b1.stop();
})();
