import {wrap} from 'comlink';
import MyWorker from 'worker-loader!./worker';
import type {MyClass} from './myClass';

export const myWorker = wrap<MyClass>(new MyWorker());
