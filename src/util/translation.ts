import fs                          from 'fs-extra';
import path                        from 'path';
import paths                       from '#config/paths';
import {TranslationServiceClient}  from '@google-cloud/translate';
import plural                      from '@technobuddha/library/plural';
import compareStrings              from '@technobuddha/library/compareStrings';
const {cheferize} = require('cheferizeIt');

const tsc = new TranslationServiceClient();

export type TranslateReturn = {
    key: string;
    language: string;
    translation: string | null | undefined;
};
    
export function translate(key: string, language: string): Promise<TranslateReturn> {
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
    
export function readTranslations(lng: string, ns: string, group?: string): Record<string, string> {
    const filename = path.join(paths.locales, lng, `${group ? `${ns}.${group}` : ns}.json`);
    
    if(fs.existsSync(filename))
        return JSON.parse(fs.readFileSync(filename).toString());
    
    return {};
}

export function writeTranslations(translations: Record<string, string>, lng: string, ns: string, group?: string): void {
    const filename = path.join(paths.locales, lng, `${group ? `${ns}.${group}` : ns}.json`);

    fs.writeFileSync(
        filename,
        JSON.stringify(translations, Object.keys(translations).sort((a, b) => compareStrings(a, b, {caseInsensitive: true})), 2)
    );
}

export default translate;
