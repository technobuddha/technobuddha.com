// eslint-disable-next-line import-x/default
import viteExpress from 'vite-express';

import { server } from './server-development.js';

const { app, logger } = server();

// const resp = await fetch('https://api.ipify.org?format=json');

viteExpress.listen(app, 3000, () => {
  logger.info('viteExpress listening on http://localhost:3000/');
});
//app.listen(3000, () => {
//  logger.info('listening on http://localhost:3000/');
//});
