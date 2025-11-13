#!/bin/env -S tsx -r ./src/config/env.ts
import path from 'node:path';
import stream from 'node:stream';

import { isString, out } from '@technobuddha/library';
import chalk from 'chalk';
import { type I18NextScannerConfig } from 'i18next-scanner';
import scanner from 'i18next-scanner';
import typescriptTransform from 'i18next-scanner-typescript';
import vfs from 'vinyl-fs';

// import { paths } from '#config';
import {
  readTranslations,
  translate,
  type TranslateReturn,
  writeTranslations,
} from '#server/translation';
import { i18nextInit } from '#settings/i18next';

void (async function main() {
  const foreign =
    i18nextInit.supportedLngs ? i18nextInit.supportedLngs.filter((lng) => lng !== 'en') : [];

  for (const ns of isString(i18nextInit.ns) ?
    [i18nextInit.ns]
  : (i18nextInit.ns ?? ['translation'])) {
    const en = await readTranslations('en', ns, 'external');

    for (const lng of foreign) {
      const t = await readTranslations(lng, ns, 'external');

      await Promise.all(
        Object.keys(en)
          .filter((key) => t[key] == null)
          .map(async (key) => translate(key, lng)),
      ).then((results) => {
        for (const result of results) {
          if (result.translation != null) {
            out(`${chalk.green('translated')} ${chalk.grey(`${ns} ${lng}`)} ${result.key}\n`);
            t[result.key] = result.translation;
          }
        }

        void writeTranslations(t, lng, ns, 'external');
      });
    }
  }

  const config: I18NextScannerConfig = {
    input: ['src/**/*.{ts,tsx}', '!**/*.d.ts'],
    output: './',
    options: {
      debug: false,
      removeUnusedKeys: true,
      sort: false,
      attr: {
        list: ['data-i18n'],
        extensions: ['.html', '.htm'],
      },
      func: {
        list: ['i18next.t', 'i18n.t', 't'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      // trans: {
      //   component: 'Trans',
      //   i18nKey: 'i18nKey',
      //   defaultsKey: 'defaults',
      //   extensions: ['.tsx'],
      //   fallbackKey: (_ns, text) => text,
      // },

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      lngs: i18nextInit.supportedLngs || undefined,
      ns: i18nextInit.ns,
      defaultLng: 'en',
      defaultNs: i18nextInit.defaultNS,
      defaultValue: null,
      resource: {
        //loadPath: path.join(paths.locales, '{{lng}}', '{{ns}}.external.json'),
        loadPath: path.join(process.cwd(), 'locales', '{{lng}}', '{{ns}}.json'),
        savePath: path.join('{{lng}}', '{{ns}}'),
        jsonIndent: 2,
        lineEnding: '\n',
      },
      nsSeparator: i18nextInit.nsSeparator,
      keySeparator: i18nextInit.keySeparator,
      pluralSeparator: i18nextInit.pluralSeparator,
      contextSeparator: i18nextInit.contextSeparator,
      contextDefaultValues: [],
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
    },
    transform: typescriptTransform({ extensions: ['.ts', '.tsx'] }),
  };

  vfs
    .src(config.input, { buffer: false })
    .pipe(scanner(config.options, config.transform, config.flush))
    .pipe(
      new stream.Transform({
        objectMode: true,
        async transform(file, _enc, callback) {
          const [lng, ns] = file.path.split('/');
          const newTranslations = JSON.parse(file.contents.toString()) as Record<string, string>;
          const oldTranslations = await readTranslations(lng, ns);
          const archiveTranslations = await readTranslations(lng, ns, 'archive');
          const promises = [] as Promise<TranslateReturn>[];

          for (const [key, translation] of Object.entries(newTranslations)) {
            if (translation == null) {
              if (key in oldTranslations) {
                newTranslations[key] = oldTranslations[key];
                delete oldTranslations[key];
              } else if (key in archiveTranslations) {
                newTranslations[key] = archiveTranslations[key];
                delete archiveTranslations[key];
                out(`${chalk.cyanBright('reinstated')} ${chalk.grey(`${ns} ${lng}`)} ${key}\n`);
              } else {
                promises.push(translate(key, lng));
              }
            } else {
              delete oldTranslations[key];
              delete archiveTranslations[key];
            }
          }

          for (const [key, translation] of Object.entries(oldTranslations)) {
            archiveTranslations[key] = translation;
            out(`${chalk.cyan('archived')} ${chalk.grey(`${ns} ${lng}`)} ${key}\n`);
          }

          Promise.all(promises)
            .then(async (results) => {
              for (const result of results) {
                if (result.translation) {
                  newTranslations[result.key] = result.translation;
                  out(
                    `${chalk.green('translated+')} ${chalk.grey(`${ns} ${lng}`)} ${result.key}\n`,
                  );
                }
              }

              await writeTranslations(newTranslations, lng, ns);
              await writeTranslations(archiveTranslations, lng, ns, 'archive');

              callback();
            })
            .catch((error) => {
              out(chalk.red(error));
            });
        },
      }),
    );
})();
