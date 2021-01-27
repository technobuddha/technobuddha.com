import { wrap } from 'comlink';
import MyWorker from 'worker-loader!./chaos';
import type { ChaosAPI } from './api';
export type { RGBV, MandelbrotReturn } from './api';

export const chaos = wrap<ChaosAPI>(new MyWorker());
