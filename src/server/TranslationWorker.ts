import process                          from 'process';
import { setTimeout, clearTimeout }     from 'timers';
import keys                             from 'lodash/keys';
import omit                             from 'lodash/omit';
import { Logger }                       from 'winston';
import i18next                          from '#settings/i18next.config.json';
import {translate, readTranslations, writeTranslations, TranslateReturn } from '#util/translation';
import { isNil } from 'lodash';

export class TranslationWorker
{
    private static readonly interval                = 1000;

    private queue:  { [key: string]: string[] }     = {};
    private timer:  NodeJS.Timer | null             = null;

    private logger: Logger;

    constructor(logger: Logger)
    {
        this.logger = logger;

        process
        .once('SIGINT',     () => { this.exit(); process.exit(1); })
        .once('SIGTERM',    () => { this.exit(); process.exit(1); });

        this.run();
    }

    public enqueue(url: string, body: { [key: string]: string }): void {
        const phrases   = keys(omit(body, '_t'));

        this.queue[url] = (url in this.queue) ? this.queue[url].concat(phrases) : phrases;
    }

    private exit() {
        if (this.timer)
            clearTimeout(this.timer);
        this.write();
    }

    private run() {
        this.timer = setTimeout(() => { this.write().then(() => this.run()); }, TranslationWorker.interval);
    }

    private async write() {
        const myQueue       = this.queue;
        this.queue          = {};

        for(const ns of Object.keys(myQueue)) {
            for (const lng of i18next.whitelist) {
                const currentTranslations = readTranslations(lng, ns);
                const archiveTranslations = readTranslations(lng, ns, 'archive');
                const promises            = [] as Promise<TranslateReturn>[];

                for(const phrase of myQueue[ns]) {
                    if(isNil(currentTranslations[phrase])) {
                        if(isNil(archiveTranslations[phrase])) {
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

                for(const tr of await Promise.all(promises)) {
                    if(tr.translation) {
                        currentTranslations[tr.key] = tr.translation; 
                        this.logger.info(`${tr.key} added to ${lng}/${ns}`);
                    }
                }

                writeTranslations(currentTranslations, lng, ns);
                writeTranslations(archiveTranslations, lng, ns, 'archive');
            }
        }
    }
}

export default TranslationWorker;
