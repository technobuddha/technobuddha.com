import { wrap } from 'comlink';

import { type ChaosAPI } from './api.js';
import MyWorker from './chaos.js?worker';

export type { MandelbrotReturn } from './api.js';
export const chaos = wrap<ChaosAPI>(new MyWorker());
