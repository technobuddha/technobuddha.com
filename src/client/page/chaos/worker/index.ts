import { wrap } from 'comlink';

import { type ChaosAPI } from './api.ts';
import MyWorker from './chaos.ts?worker';

export type { MandelbrotReturn } from './api.ts';
export const chaos = wrap<ChaosAPI>(new MyWorker());
