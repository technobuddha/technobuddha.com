import '#config/env';

import chalk from 'chalk';
import express from 'express';

import api from './api/index.ts';
import createLogger from './create-logger.ts';
import invulnerability from './invulnerability.ts';
import listener from './listener.ts';
import proxy from './proxy.ts';
import setup from './setup.ts';
import staticContent from './static-content.ts';

const logger = createLogger(false);

invulnerability(logger);
logger.verbose(`Server booting... ${chalk.red('PRODUCTION')}`);

const app = express();
proxy(app, logger);
setup(app, logger);
app.use('/api', api(logger));
staticContent(app, logger);

listener(app, logger);
