import '#config/env';
import chalk           from 'chalk';
import express         from 'express';
import createLogger    from './create-logger';
import proxy           from './proxy';
import setup           from './setup';
import staticContent   from './static-content';
import api             from './api';
import listener        from './listener';
import invulnerability from './invulnerability';

const logger = createLogger(false);

invulnerability(logger);
logger.verbose(`Server booting... ${chalk.red('PRODUCTION')}`);

const app = express();
proxy(app, logger);
setup(app, logger);
app.use('/api', api(logger));
staticContent(app, logger);

listener(app, logger);
