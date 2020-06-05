import process                          from 'process';
import path                             from 'path';
import fs                               from 'fs-extra';
import { setTimeout, clearTimeout }     from 'timers';
import keys                             from 'lodash/keys';
import omit                             from 'lodash/omit';
import each                             from 'lodash/each';
import { Logger }                       from 'winston';
import i18next                          from '$/i18next.config.json';

export class TranslationWorker
{
    private static readonly interval                = 1000;

    private queue:  { [key: string]: string[] }     = {};
    private timer:  NodeJS.Timer | null             = null;

    private home:   string;
    private logger: Logger;

    constructor(home: string, logger: Logger)
    {
        this.home   = home;
        this.logger = logger;

        process
        .once('SIGINT',     () => { this.exit(); process.exit(1); })
        .once('SIGTERM',    () => { this.exit(); process.exit(1); });

        this.run();
    }

    public translate(url: string, body: { [key: string]: string }): void {
        const phrases   = keys(omit(body, '_t'));

        this.queue[url] = (url in this.queue) ? this.queue[url].concat(phrases) : phrases;
    }

    private exit() {
        if (this.timer)
            clearTimeout(this.timer);
        this.write();
    }

    private run() {
        this.timer = setTimeout(() => { this.write(); this.run(); }, TranslationWorker.interval);
    }

    private write() {
        const myQueue       = this.queue;
        this.queue          = {};

        each(
            myQueue,
            (phrases, _url) => {
                if(i18next.whitelist) {
                    for (const lng of i18next.whitelist) {
                        const translationPath   = path.join(this.home, 'locales', lng, 'translation.json');
                        fs.readFile(translationPath)
                        .then(
                            (text) => {
                                const translation   = JSON.parse(text.toString());

                                each(
                                    phrases,
                                    (phrase) => {
                                        if (phrase in translation)
                                            this.logger.info(`${phrase} is already translated for ${lng}`);
                                        else
                                        {
                                            translation[phrase] = lng === 'en' ? phrase : `[${lng}[${phrase}]]`;
                                            this.logger.verbose(`${phrase} added to ${lng}`);
                                        }
                                    }
                                );

                                fs.writeFile(translationPath, JSON.stringify(translation, null, 2), 'utf8');    // tslint:disable-line:no-magic-numbers
                            }
                        );
                    }
                }
            }
        );
    }
}

export default TranslationWorker;
