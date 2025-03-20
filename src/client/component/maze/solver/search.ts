import { create2DArray } from '@technobuddha/library';

import { animate } from '../drawing/animate.js';
import { type Cell, type CellDirection, type Direction, type XY } from '../maze/maze.js';

import { type MazeSolverProperties, type SolveArguments } from './maze-solver.js';
import { MazeSolver } from './maze-solver.js';

function manhattanDistance(a: XY, b: XY): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

type Method = 'random' | 'seek' | 'left-turn' | 'right-turn';

type SearchProperties = MazeSolverProperties & {
  method?: Method;
};

export class Search extends MazeSolver {
  protected readonly method: Method;

  public constructor({ method = 'random', ...props }: SearchProperties) {
    super(props);
    this.method = method;
  }

  protected decide(array: CellDirection[], direction: Direction): CellDirection[] {
    switch (this.method) {
      case 'random': {
        return this.randomShuffle(array);
      }

      case 'seek': {
        return array.sort(
          (a, b) =>
            manhattanDistance({ x: a.x, y: a.y }, this.maze.exit) -
            manhattanDistance({ x: b.x, y: b.y }, this.maze.exit),
        );
      }

      case 'left-turn': {
        const left = this.maze.leftTurn(direction);
        return array.sort((a, b) => left.indexOf(a.direction) - left.indexOf(b.direction));
      }

      case 'right-turn': {
        const right = this.maze.rightTurn(direction);
        return array.sort((a, b) => right.indexOf(a.direction) - right.indexOf(b.direction));
      }

      default: {
        return array;
      }
    }
  }

  public async solve({
    color = '#1589FF',
    solutionColor = '#00FF00',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  }: SolveArguments = {}): Promise<void> {
    this.maze.prepareDrawing(this.drawing);

    type CP = Cell & { parent?: CP; direction: Direction };

    let queue: CP[] = [];
    const discovered = create2DArray(this.maze.width, this.maze.height, false);
    const distances = create2DArray(this.maze.width, this.maze.height, 0);

    discovered[entrance.x][entrance.y] = true;
    queue.unshift(entrance);

    let mode: 'forward' | 'backward' | 'solve' = 'forward';

    while (queue.length > 0) {
      const cell = queue.pop()!;

      switch (mode) {
        case 'forward': {
          discovered[cell.x][cell.y] = true;
          if (cell.parent) {
            distances[cell.x][cell.y] = distances[cell.parent.x][cell.parent.y] + 1;
          }

          if (cell.x === exit.x && cell.y === exit.y) {
            await animate(() => {
              this.maze.clear();
              this.maze.drawDistances();
            });
            mode = 'solve';
            queue = [cell];
          } else {
            const moves = this.decide(
              this.maze.validMoves(cell).filter((n) => !discovered[n.x][n.y]),
              cell.direction,
            );
            if (moves.length === 0) {
              await animate(() => {
                this.maze.drawCell(cell);
                this.maze.drawX(cell);
              });
              if (cell.parent) {
                mode = 'backward';
                queue.push(cell.parent);
              } else {
                mode = 'solve';
              }
            } else {
              const [next, ...others] = moves;
              queue.push(...others.map((o) => ({ ...o, parent: cell })));

              await animate(() => {
                this.maze.drawPath({ ...cell, direction: next.direction }, color);
              });
              queue.push({ ...next, parent: cell });
            }
          }
          break;
        }

        case 'backward': {
          if (this.maze.validMoves(cell).some((n) => !discovered[n.x][n.y])) {
            const topOfQueue = queue.at(-1);
            if (topOfQueue) {
              const { parent, direction } = topOfQueue;

              if (parent) {
                await animate(() => {
                  this.maze.drawPath({ x: parent.x, y: parent.y, direction }, color);
                });
              }
            }

            mode = 'forward';
          } else {
            await animate(() => {
              this.maze.drawCell(cell);
              this.maze.drawX(cell);
            });
            queue.push(cell.parent!);
          }

          break;
        }

        case 'solve': {
          let next: CP | undefined = cell.parent;
          let prev: CP = cell;
          while (next) {
            this.maze.drawPath({ ...next, direction: prev.direction }, solutionColor);
            prev = next;
            next = next.parent;
          }
          queue.length = 0;
        }

        // no default
      }
    }

    this.maze.drawCell(entrance, 'green');
    this.maze.drawPath(entrance, solutionColor);

    this.maze.drawCell(exit, 'red');
    this.maze.drawPath(exit, solutionColor);
  }
}
