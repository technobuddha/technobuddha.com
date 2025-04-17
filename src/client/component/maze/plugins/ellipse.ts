import { type Maze } from '../maze/maze.ts';

export function ellipisePlugin(maze: Maze): void {
  const rx = Math.floor(maze.width / 2) + 1;
  const ry = Math.floor(maze.height / 2) + 1;
  const x0 = Math.floor(maze.width / 2);
  const y0 = Math.floor(maze.height / 2);

  for (const cell of maze.cellsInMaze()) {
    if ((cell.x - x0) ** 2 / rx ** 2 + (cell.y - y0) ** 2 / ry ** 2 >= 1) {
      maze.mask[cell.x][cell.y] = true;
    }
  }
}
