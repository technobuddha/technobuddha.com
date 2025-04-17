import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellDirection, type Direction, type XY } from '../maze/maze.ts';

import { type MazeSolverProperties } from './maze-solver.ts';
import { MazeSolver } from './maze-solver.ts';

function manhattanDistance(a: XY, b: XY): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

type Method = 'random' | 'seek' | 'left-turn' | 'right-turn';

type SearchProperties = MazeSolverProperties & {
  avatarColor?: string;
  pathColor?: string;
  method?: Method;
};

export class Search extends MazeSolver {
  public avatarColor: string;
  public pathColor: string;
  protected readonly method: Method;

  public constructor({
    avatarColor = '#6495ED',
    pathColor = '#B6358B',
    method = 'random',
    ...props
  }: SearchProperties) {
    super(props);
    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.method = method;
  }

  protected decide(array: CellDirection[], origin: CellDirection): CellDirection[] {
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
        const left = this.maze.leftTurn(origin);
        return array.sort((a, b) => left.indexOf(a.direction) - left.indexOf(b.direction));
      }

      case 'right-turn': {
        const right = this.maze.rightTurn(origin);
        return array.sort((a, b) => right.indexOf(a.direction) - right.indexOf(b.direction));
      }

      default: {
        return array;
      }
    }
  }

  public *solve({
    pathColor = this.pathColor,
    avatarColor = this.avatarColor,
    solutionColor = this.solutionColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): Iterator<void> {
    this.maze.attachDrawing(this.drawing);

    type CellParentDirection = Cell & { parent?: CellParentDirection; direction: Direction };

    let queue: CellParentDirection[] = [];
    const discovered = create2DArray(this.maze.width, this.maze.height, false);
    const distances = create2DArray(this.maze.width, this.maze.height, 0);

    discovered[entrance.x][entrance.y] = true;
    queue.unshift({
      ...entrance,
      direction: this.maze.opposite({
        ...entrance,
        direction: this.randomPick(Object.keys(this.maze.walls[entrance.x][entrance.y]))!,
      }),
    });

    let mode: 'forward' | 'backward' | 'solve' = 'forward';

    while (queue.length > 0) {
      const cell = queue.pop()!;

      switch (mode) {
        case 'forward': {
          discovered[cell.x][cell.y] = true;
          if (cell.parent) {
            distances[cell.x][cell.y] = distances[cell.parent.x][cell.parent.y] + 1;
          }

          if (this.maze.isSame(cell, exit)) {
            this.maze.clear();
            this.maze.drawDistances();
            yield;
            mode = 'solve';
            queue = [cell];
          } else {
            const moves = this.decide(
              this.maze.validMoves(cell).filter((n) => !discovered[n.x][n.y]),
              cell,
            );
            if (moves.length === 0) {
              this.maze.drawCell(cell);
              // this.maze.drawX(cell);
              // yield;
              if (cell.parent) {
                mode = 'backward';
                queue.push(cell.parent);
              } else {
                mode = 'solve';
              }
            } else {
              const [next, ...others] = moves;
              queue.push(...others.map((o) => ({ ...o, parent: cell })));

              this.maze.drawCell(cell);
              this.maze.drawPath({ ...cell, direction: next.direction }, pathColor);

              this.maze.drawCell(next);
              this.maze.drawAvatar(next, avatarColor);
              yield;
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

              this.maze.drawCell(topOfQueue);
              this.maze.drawAvatar(topOfQueue, avatarColor);

              if (parent) {
                this.maze.drawCell(parent);
                this.maze.drawPath({ ...parent, direction }, pathColor);
                yield;
              }
            }

            mode = 'forward';
          } else {
            this.maze.drawCell(cell);

            this.maze.drawCell(cell.parent!);
            this.maze.drawAvatar(cell.parent!, avatarColor);

            // this.maze.drawX(cell);
            // yield;
            queue.push(cell.parent!);
          }

          break;
        }

        case 'solve': {
          let next: CellParentDirection | undefined = cell.parent;
          let prev: CellParentDirection = cell;
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

    this.maze.drawCell(exit);
    this.maze.drawPath(exit, solutionColor);
  }
}
