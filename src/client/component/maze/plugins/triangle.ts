import { type Maze } from '../maze/maze.ts';

export function trianglePlugin(maze: Maze): void {
  const a = { x: 0, y: maze.height - 1 };
  const b = { x: maze.width - 1, y: maze.height - 1 };
  const c = { x: Math.floor(maze.width / 2), y: 0 };

  for (const cell of maze.cellsInMaze()) {
    const asx = cell.x - a.x;
    const asy = cell.y - a.y;
    const sab = (b.x - a.x) * asy - (b.y - a.y) * asx > 0;

    if (
      (c.x - a.x) * asy - (c.y - a.y) * asx > 0 === sab ||
      (c.x - b.x) * (cell.y - b.y) - (c.y - b.y) * (cell.x - b.x) > 0 !== sab
    ) {
      maze.mask[cell.x][cell.y] = true;
    }
  }
}
