import { type Application } from 'express';
import { type Logger } from 'winston';

import { TranslationWorker } from './translation-worker.ts';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function translation(app: Application, logger: Logger): void {
  if (isDevelopment) {
    // if (process.env.GCLOUD_PROJECT && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const translationWorker = new TranslationWorker(logger);

    app.post('/locales/*', (req, res) => {
      const [, , , nsFile] = req.url.split('/');
      const [ns] = nsFile.split('.');

      translationWorker.enqueue(ns, req.body);
      res.end();
    });
    // }
  }
}
