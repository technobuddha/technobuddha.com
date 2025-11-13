import fs from 'node:fs/promises';
import path from 'node:path';

import { TranslationServiceClient } from '@google-cloud/translate';
import { compareStrings, plural } from '@technobuddha/library';
import { cheferize } from 'cheferizeIt';

import { paths } from '#config';

const tsc = new TranslationServiceClient();

export type TranslateReturn = {
  key: string;
  language: string;
  translation: string | null | undefined;
};

export async function translate(key: string, language: string): Promise<TranslateReturn> {
  const phrase = key.endsWith('_plural') ? plural(key.slice(0, -7)) : key;

  if (language === 'en') {
    return Promise.resolve({ key, language, translation: phrase });
  }

  if (language === 'chef') {
    return Promise.resolve({ key, language, translation: cheferize(phrase) });
  }

  const request = {
    parent: `projects/${process.env.GCLOUD_PROJECT}/locations/global`,
    contents: [phrase],
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: language,
  };

  return tsc.translateText(request).then((result) => ({
    key,
    language,
    translation: result[0].translations?.[0].translatedText ?? null,
  }));
}

export async function readTranslations(
  lng: string,
  ns: string,
  group?: string,
): Promise<Record<string, string>> {
  const filename = path.join(paths.locales, lng, `${group ? `${ns}.${group}` : ns}.json`);

  return fs
    .readFile(filename, 'utf8')
    .then((data) => JSON.parse(data))
    .catch(() => {});
}

export async function writeTranslations(
  translations: Record<string, string>,
  lng: string,
  ns: string,
  group?: string,
): Promise<void> {
  const filename = path.join(paths.locales, lng, `${group ? `${ns}.${group}` : ns}.json`);

  return fs.writeFile(
    filename,
    JSON.stringify(
      translations,
      Object.keys(translations).sort((a, b) => compareStrings(a, b, { caseInsensitive: true })),
      2,
    ),
  );
}
