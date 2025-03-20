export async function animate<T>(callback: () => T): Promise<T> {
  return new Promise<T>((resolve) => {
    requestAnimationFrame(() => {
      resolve(callback());
    });
  });
}
