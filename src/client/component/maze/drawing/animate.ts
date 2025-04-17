import { toError } from '@technobuddha/library';

export async function animate<T>(callback: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    requestAnimationFrame(() => {
      try {
        const result = callback();
        resolve(result);
      } catch (error) {
        reject(toError(error));
      }
    });
  });
}
