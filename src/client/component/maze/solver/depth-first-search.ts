import { create2DArray, randomShuffle } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.js';

import { type SolveArguments } from './maze-solver.js';
import { MazeSolver } from './maze-solver.js';

export class DepthFirstSearch extends MazeSolver {
  public async solve({
    color = 'red',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  }: SolveArguments = {}): Promise<void> {
    this.maze.prepareContext(this.context);

    return new Promise<void>((resolve) => {
      type CP = Cell & { parent?: CP; direction: Direction };

      const queue: CP[] = [];
      const discovered = create2DArray(this.maze.width, this.maze.height, false);
      const distances = create2DArray(this.maze.width, this.maze.height, 0);

      discovered[entrance.x][entrance.y] = true;
      this.maze.drawPath(entrance);
      queue.unshift(entrance);

      const go = (): void => {
        if (queue.length > 0) {
          requestAnimationFrame(() => {
            this.maze.clear();

            const cell = queue.pop();
            let path = cell;
            while (path) {
              const next = path.parent;
              if (next) {
                this.maze.drawPath({ ...next, direction: path.direction }, color);
              }
              path = next;
            }

            if (cell && (cell.x !== exit.x || cell.y !== exit.y)) {
              for (const direction of randomShuffle(this.maze.directions)) {
                if (!this.maze.walls[cell.x][cell.y][direction]) {
                  const next = this.maze.move(cell, direction);

                  if (next && this.maze.inMaze(next) && !discovered[next.x][next.y]) {
                    discovered[next.x][next.y] = true;
                    distances[next.x][next.y] = distances[cell.x][cell.y] + 1;

                    queue.push({ ...next, parent: cell });
                  }
                }
              }

              go();
            } else {
              this.maze.drawPath(exit);
              resolve();
            }
          });
        }
      };

      go();
    });
  }
}
