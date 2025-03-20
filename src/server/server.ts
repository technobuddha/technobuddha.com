import '#config/env';

import chalk from 'chalk';
import express from 'express';

import { api } from './api/index.ts';
import { createLogger } from './create-logger.ts';
import { invulnerability } from './invulnerability.ts';
import { listener } from './listener.ts';
import { proxy } from './proxy.ts';
import { setup } from './setup.ts';
import { staticContent } from './static-content.ts';
import { translation } from './translation.ts';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = createLogger(true);
invulnerability(logger);
logger.verbose(
  `Server booting... ${isDevelopment ? chalk.green('DEVELOPMENT') : chalk.red('PRODUCTION')}`,
);

const app = express();
setup(app, logger);
proxy(app, logger);
translation(app, logger);
api(app, logger);
staticContent(app, logger);
listener(app, logger);
