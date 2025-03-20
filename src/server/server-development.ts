import '#config/env';

import chalk from 'chalk';
import express, { type Express } from 'express';

// import { api } from './api/index.js';
import { createLogger } from './create-logger.js';
import { invulnerability } from './invulnerability.js';
// import { listener } from './listener.js';
import { setup } from './setup.js';
import { staticContent } from './static-content.js';
import { translation } from './translation.js';

export function server(): Express {
  const logger = createLogger(true);

  invulnerability(logger);
  logger.verbose(`Server booting... ${chalk.green('DEVELOPMENT')}`);

  const app = express();
  setup(app, logger);
  translation(app, logger);
  // app.use('/api', api(logger));
  staticContent(app, logger);

  // void listener(app, logger);
  return app;
}
