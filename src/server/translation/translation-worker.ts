import { clearTimeout, setTimeout } from 'node:timers';

import { isNil, keys, omit } from 'lodash-es';
import { type Logger } from 'winston';

import i18next from '#settings/i18next';

import {
  readTranslations,
  translate,
  type TranslateReturn,
  writeTranslations,
} from './translation-utils.ts';

export class TranslationWorker {
  private static readonly interval = 1000;

  private queue: { [key: string]: string[] } = {};
  private timer: ReturnType<typeof setTimeout> | undefined = undefined;

  private readonly logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;

    logger.info('Translation worker running.');

    process
      .once('SIGINT', () => {
        this.exit();
        process.exit(1);
      })
      .once('SIGTERM', () => {
        this.exit();
        process.exit(1);
      });

    this.run();
  }

  public enqueue(url: string, body: { [key: string]: string }): void {
    const phrases = keys(omit(body, '_t'));

    this.queue[url] = url in this.queue ? this.queue[url].concat(phrases) : phrases;
  }

  private exit(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    void this.write();
  }

  private run(): void {
    this.timer = setTimeout(() => {
      void this.write().then(() => {
        this.run();
      });
    }, TranslationWorker.interval);
  }

  private async write(): Promise<void> {
    const myQueue = this.queue;
    this.queue = {};

    for (const ns of Object.keys(myQueue)) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      for (const lng of i18next.supportedLngs || []) {
        const currentTranslations = await readTranslations(lng, ns);
        const archiveTranslations = await readTranslations(lng, ns, 'archive');
        const promises = [] as Promise<TranslateReturn>[];

        for (const phrase of myQueue[ns]) {
          if (isNil(currentTranslations[phrase])) {
            if (isNil(archiveTranslations[phrase])) {
              promises.push(translate(phrase, lng));
            } else {
              currentTranslations[phrase] = archiveTranslations[phrase];
              delete archiveTranslations[phrase];
              this.logger.verbose(`${phrase} extracted from archive ${lng}/${ns}`);
            }
          } else {
            this.logger.verbose(`${phrase} is already translated for ${lng}/${ns}`);
          }
        }

        for (const tr of await Promise.all(promises)) {
          if (tr.translation) {
            currentTranslations[tr.key] = tr.translation;
            this.logger.info(`${tr.key} added to ${lng}/${ns}`);
          }
        }

        await writeTranslations(currentTranslations, lng, ns);
        await writeTranslations(archiveTranslations, lng, ns, 'archive');
      }
    }
  }
}
