export function lookAhead<T>(array: T[], last?: T): [T, T][] {
  const look: [T, T][] = [];

  for (let i = 0; i < array.length - 1; ++i) {
    const a0 = array[i];
    const a1 = array[i + 1];

    look.push([a0, a1]);
  }

  if (array.length > 0 && last !== undefined) {
    look.push([array.at(-1)!, last]);
  }

  return look;
}
