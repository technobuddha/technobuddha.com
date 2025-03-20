import '#config/env';
import chalk                        from 'chalk';
import express                      from 'express';
import createLogger                 from './create-logger';
import setup                        from './setup';
import staticContent                from './static-content';
import api                          from './api';
import development                  from './development';
import translation                  from './translation';
import listener                     from './listener';
import invulnerability from './invulnerability';

const logger = createLogger(true);

invulnerability(logger);
logger.verbose(`Server booting... ${chalk.green('DEVELOPMENT')}`);

const app = express();
setup(app, logger);
development(app, logger);
translation(app, logger);
app.use('/api', api(logger));
staticContent(app, logger);

listener(app, logger);
