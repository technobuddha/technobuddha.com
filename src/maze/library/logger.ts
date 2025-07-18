/* eslint-disable no-console */

export const logger = {
  log: console.log,
  warn: console.warn,
  error: (...args: Parameters<typeof console.error>) => {
    console.error(...args);
    // debugger;
  },
  clear: console.clear,
};
