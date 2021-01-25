#!/bin/env -S ts-node --prefer-ts-exts  -r ./config/env.ts -r tsconfig-paths/register
import chalk               from 'chalk';
import path                from 'path';
import stream              from 'stream';
import vfs                 from 'vinyl-fs';
import isString            from 'lodash/isString';
import isNil               from 'lodash/isNil';
import scanner             from 'i18next-scanner';
import typescriptTransform from 'i18next-scanner-typescript';
import paths               from '#config/paths';
import i18next             from '#settings/i18next';
import {translate, readTranslations, writeTranslations } from '#util/translation';

import type { I18NextScannerConfig } from 'i18next-scanner';
import type { TranslateReturn }      from '#util/translation';

(async function() {
    const foreign = i18next.supportedLngs ? i18next.supportedLngs.filter(lng => lng != 'en') : [];

    for(const ns of isString(i18next.ns) ? [i18next.ns] : i18next.ns ?? ['translation']) {
        const en = readTranslations('en', ns, 'external');
    
        for(const lng of foreign) {
            const t = readTranslations(lng, ns, 'external');
    
            await Promise.all(
                Object.keys(en)
                .filter(key => isNil(t[key]))
                .map(key => translate(key, lng))
            )
            .then(
                results => {
                    results.forEach(
                        result => {
                            if(!isNil(result.translation)) {
                                console.log(`${chalk.green('translated')} ${chalk.grey(`${ns} ${lng}`)} ${result.key}`);
                                t[result.key] = result.translation;
                            }
                        }
                    );
                    
                    writeTranslations(t, lng, ns, 'external');
                }
            )
        }
    }

    const config: I18NextScannerConfig = {
        input: [
            'src/**/*.{ts,tsx}',
            '!**/*.d.ts',
        ],
        output: './',
        options: {
            debug: false,
            removeUnusedKeys: false,
            sort: false,
            attr: {
                list: ['data-i18n'],
                extensions: ['.html', '.htm']
            },
            func: {
                list: ['i18next.t', 'i18n.t', 't'],
                extensions: ['.js', '.jsx']
            },
            trans: {
                component: 'Trans',
                i18nKey: 'i18nKey',
                defaultsKey: 'defaults',
                extensions: ['.js', '.jsx'],
                fallbackKey: (_ns, text) => text,
            },
            lngs: i18next.supportedLngs || undefined,
            ns: i18next.ns,
            defaultLng: 'en',
            defaultNs: i18next.defaultNS,
            defaultValue: null,
            resource: {
                loadPath: path.join(paths.locales, '{{lng}}', `{{ns}}.external.json`),
                savePath: path.join('{{lng}}', '{{ns}}'),
                jsonIndent: 2,
                lineEnding: '\n'
            },
            nsSeparator: i18next.nsSeparator,
            keySeparator: i18next.keySeparator,
            pluralSeparator: i18next.pluralSeparator,
            contextSeparator: i18next.contextSeparator,
            contextDefaultValues: [],
            interpolation: {
                prefix: '{{',
                suffix: '}}'
            },
        },
        transform: typescriptTransform({ extensions: [".ts", ".tsx"] })
    }
    
    vfs.src(config.input, {buffer: false})
    .pipe(scanner(config.options, config.transform, config.flush))
    .pipe(new stream.Transform({
        objectMode: true,
        transform(file, _enc, callback) {
            const [lng, ns]             = file.path.split('/');
            const newTranslations       = JSON.parse(file.contents.toString()) as Record<string, string>;
            const oldTranslations       = readTranslations(lng, ns);
            const archiveTranslations   = readTranslations(lng, ns, 'archive');
            const promises              = [] as Promise<TranslateReturn>[];

            for(const [key, translation] of Object.entries(newTranslations)) {
                if(isNil(translation)) {
                    if(key in oldTranslations) {
                        newTranslations[key] = oldTranslations[key];
                        delete oldTranslations[key];
                    } else if(key in archiveTranslations) {
                        newTranslations[key] = archiveTranslations[key];
                        delete archiveTranslations[key];
                        console.log(`${chalk.cyanBright('reinstated')} ${chalk.grey(`${ns} ${lng}`)} ${key}`);
                    } else {
                        promises.push(translate(key, lng));
                    }
                } else {
                    delete oldTranslations[key];
                    delete archiveTranslations[key];
                }
            }

            for(const [key, translation] of Object.entries(oldTranslations)) {
                archiveTranslations[key] = translation;
                console.log(`${chalk.cyan('archived')} ${chalk.grey(`${ns} ${lng}`)} ${key}`);
            }
            
            Promise.all(promises)
            .then(
                results => {
                    for(const result of results) {
                        if(result.translation) {
                            newTranslations[result.key] = result.translation;
                            console.log(`${chalk.green('translated+')} ${chalk.grey(`${ns} ${lng}`)} ${result.key}`);
                        }
                    }

                    writeTranslations(newTranslations, lng, ns);
                    writeTranslations(archiveTranslations, lng, ns, 'archive');

                    callback();
                }
            )
        }
    }))
})();
