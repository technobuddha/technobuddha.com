import { create2DArray, randomPick, randomShuffle } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.js';
import { animate } from '../util/animate.js';

import { type SolveArguments } from './maze-solver.js';
import { MazeSolver } from './maze-solver.js';

export class DepthFirstSearch extends MazeSolver {
  public async solve({
    color = '#1589FF',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  }: SolveArguments = {}): Promise<void> {
    this.maze.prepareContext(this.context);

    type CP = Cell & { parent?: CP; direction: Direction };

    const queue: CP[] = [];
    const discovered = create2DArray(this.maze.width, this.maze.height, false);
    const distances = create2DArray(this.maze.width, this.maze.height, 0);

    discovered[entrance.x][entrance.y] = true;
    this.maze.drawPath(entrance);
    queue.unshift(entrance);

    let direction: 'forward' | 'backward' | 'solve' = 'forward';

    while (queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      await animate(() => {
        const cell = queue.pop()!;

        switch (direction) {
          case 'forward': {
            discovered[cell.x][cell.y] = true;
            if (cell.parent) {
              distances[cell.x][cell.y] = distances[cell.parent.x][cell.parent.y] + 1;
            }

            if (cell.x === exit.x && cell.y === exit.y) {
              this.maze.clear();
              direction = 'solve';
              queue.length = 0;
              queue.push(cell);
            } else {
              const moves = randomShuffle(
                this.maze.validMoves(cell).filter((n) => !discovered[n.x][n.y]),
              );
              if (moves.length === 0) {
                this.maze.drawX(cell);
                if (cell.parent) {
                  direction = 'backward';
                  queue.push(cell.parent);
                } else {
                  direction = 'solve';
                }
              } else {
                const [next, ...others] = moves;
                queue.push(...others.map((o) => ({ ...o, parent: cell })));

                this.maze.drawPath({ ...cell, direction: next.direction }, color);
                queue.push({ ...next, parent: cell });
              }
            }
            break;
          }

          case 'backward': {
            if (this.maze.validMoves(cell).some((n) => !discovered[n.x][n.y])) {
              const topOfQueue = queue.at(-1)!;
              this.maze.drawPath(
                {
                  x: topOfQueue.parent!.x,
                  y: topOfQueue.parent!.y,
                  direction: topOfQueue.direction,
                },
                color,
              );
              direction = 'forward';
            } else {
              this.maze.drawX(cell);
              queue.push(cell.parent!);
            }

            break;
          }

          case 'solve': {
            const next: CP | undefined = cell.parent;
            if (next) {
              this.maze.drawPath({ ...next, direction: cell.direction }, color);
              queue.push(next);
            } else {
              queue.length = 0;
            }
          }

          // no default
        }
      });
    }

    this.maze.drawPath(exit, color);
  }
}
