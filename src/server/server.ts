// eslint-disable-next-line import-x/default
import ViteExpress from 'vite-express';

import { server } from './server-development.js';

const app = server();

// eslint-disable-next-line no-console
ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'));
