import '#config/env';

import chalk from 'chalk';
import express, { type Express } from 'express';
import { type Logger } from 'winston';

import { api } from './api/index.ts';
import { createLogger } from './create-logger.ts';
import { invulnerability } from './invulnerability.ts';
import { proxy } from './proxy.ts';
// import { listener } from './listener.js';
import { setup } from './setup.ts';
import { staticContent } from './static-content.ts';
import { translation } from './translation.ts';

export function server(): { app: Express; logger: Logger } {
  const logger = createLogger(true);

  invulnerability(logger);
  logger.verbose(`Server booting... ${chalk.green('DEVELOPMENT')}`);

  const app = express();
  setup(app, logger);
  proxy(app, logger);
  translation(app, logger);
  api(app, logger);
  staticContent(app, logger);

  // void listener(app, logger);
  return { app, logger };
}
