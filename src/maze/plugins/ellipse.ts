import { type Maze } from '../geometry/index.ts';

export function ellipsePlugin(maze: Maze): void {
  const rx = Math.floor(maze.width / 2) + 1;
  const ry = Math.floor(maze.height / 2) + 1;
  const x0 = Math.floor(maze.width / 2);
  const y0 = Math.floor(maze.height / 2);

  for (const cell of maze.cellsInMaze()) {
    if ((cell.x - x0) ** 2 / rx ** 2 + (cell.y - y0) ** 2 / ry ** 2 >= 1) {
      maze.nexus(cell).mask = true;
    }
  }
}
