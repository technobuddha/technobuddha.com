export function randomDraw<T>(items: T[], random: () => number = Math.random): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const index = Math.floor(random() * items.length);
  const draw = items[index];
  items.splice(index, 1); // Remove the item from the array to prevent reselection
  return draw;
}
