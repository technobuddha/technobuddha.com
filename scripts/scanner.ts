#!/bin/env -S ts-node -r ./config/env.ts -r tsconfig-paths/register
//import sort  from 'gulp-sort';
import fs                                   from 'fs-extra';
import path                                 from 'path';
import stream                               from 'stream';
import vfs                                  from 'vinyl-fs';
import isNil                                from 'lodash/isNil';
import scanner, { I18NextScannerConfig }    from 'i18next-scanner';
import typescriptTransform                  from 'i18next-scanner-typescript';
import {TranslationServiceClient}           from '@google-cloud/translate';
import plural                               from '@technobuddha/library/plural';
import {compareStrings}                     from '@technobuddha/library/compare';   // TODO seperate imports
import paths                                from 'config/paths';
import i18next                              from '$i18next.config.json';
const {cheferize} = require('cheferizeIt');

(async function() {
    const tsc = new TranslationServiceClient();

    type GoogleTranslateReturn = {
        key: string;
        language: string;
        translation: string | null | undefined;
    };
    
    function googleTranslate(key: string, language: string): Promise<GoogleTranslateReturn> {
        const phrase = key.endsWith('_plural') ? plural(key.slice(0, key.length - 7)) : key;

        if(language === 'en')
            return Promise.resolve({key, language, translation: phrase});

        if(language === 'chef')
            return Promise.resolve({key, language, translation: cheferize(phrase)});

        const request = {
            parent: `projects/${process.env.GCLOUD_PROJECT}/locations/global`,
            contents: [phrase],
            mimeType: 'text/plain',
            sourceLanguageCode: 'en',
            targetLanguageCode: language,
        };

        // TODO These asserts are dangerous
        return tsc.translateText(request).then(result => ({ key, language, translation: result[0]!.translations![0].translatedText }));
    }
    
    function readTranslations(lng: string, ns: string, group?: string): Record<string, string> {
        const filename = path.join(paths.locales, lng, `${group ? `${ns}.${group}` : ns}.json`);
    
        if(fs.existsSync(filename))
            return JSON.parse(fs.readFileSync(filename).toString());
    
        return {};
    }
    
    function writeTranslations(translations: Record<string, string>, lng: string, ns: string, group?: string): void {
        const filename = path.join(paths.locales, lng, `${group ? `${ns}.${group}` : ns}.json`);

        fs.writeFileSync(
            filename,
            JSON.stringify(translations, Object.keys(translations).sort((a, b) => compareStrings(a, b, {caseInsensitive: true})), 2)
        );
    }
    
    const foreign = i18next.whitelist.filter(lng => lng != 'en');
    
    for(const ns of i18next.ns) {
        const en = readTranslations('en', ns, 'external');
    
        for(const lng of foreign) {
            const t = readTranslations(lng, ns, 'external');
    
            await Promise.all(
                Object.keys(en)
                .filter(key => isNil(t[key]))
                .map(key => googleTranslate(key, lng))
            )
            .then(
                results => {
                    results.forEach(
                        result => {
                            if(!isNil(result.translation))
                                t[result.key] = result.translation;
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
                fallbackKey: false
            },
            lngs: i18next.whitelist,
            ns: i18next.ns,
            defaultLng: 'en',
            defaultNs: i18next.defaultNS,
            defaultValue: null,
            resource: {
                loadPath: path.join(paths.locales, '{{lng}}', `{{ns}}.external.json`),
                savePath: '{{lng}}/{{ns}}',
                jsonIndent: 2,
                lineEnding: '\n'
            },
            nsSeparator: false,
            keySeparator: false,
            pluralSeparator: '_',
            contextSeparator: '_',
            contextDefaultValues: [],
            interpolation: {
                prefix: '{{',
                suffix: '}}'
            },
        },
        transform: typescriptTransform({ extensions: [".ts", ".tsx"] })
    }
    
    vfs.src(config.input, {buffer: false})
    //.pipe(sort()) // Sort files in stream by path
    .pipe(scanner(config.options, config.transform, config.flush))
    .pipe(new stream.Transform({
        objectMode: true,
        transform(file, _enc, callback) {
            const [lng, ns]             = file.path.split('/');
            const newTranslations       = JSON.parse(file.contents.toString()) as Record<string, string>;
            const oldTranslations       = readTranslations(lng, ns);
            const archiveTranslations   = readTranslations(lng, ns, 'archive');
            const promises              = [] as Promise<GoogleTranslateReturn>[];

            for(const [key, translation] of Object.entries(newTranslations)) {
                if(isNil(translation)) {
                    if(key in oldTranslations) {
                        newTranslations[key] = oldTranslations[key];
                        delete oldTranslations[key];
                    } if(key in archiveTranslations) {
                        newTranslations[key] = archiveTranslations[key];
                        delete archiveTranslations[key];
                    } else {
                        promises.push(googleTranslate(key, lng));
                    }
                } else {
                    delete oldTranslations[key];
                    delete archiveTranslations[key];
                }
            }

            for(const [key, translation] of Object.entries(oldTranslations)) {
                archiveTranslations[key] = translation;
            }
            

            Promise.all(promises)
            .then(
                results => {
                    for(const result of results) {
                        if(result.translation)
                            newTranslations[result.key] = result.translation;
                    }

                    writeTranslations(newTranslations, lng, ns);
                    writeTranslations(archiveTranslations, lng, ns, 'archive');

                    callback();
                }
            )
        }
    }))
})()


