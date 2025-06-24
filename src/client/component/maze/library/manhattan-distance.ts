type Coordinates = {
  readonly x: number;
  readonly y: number;
};

export function manhattanDistance(a: Coordinates, b: Coordinates): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
