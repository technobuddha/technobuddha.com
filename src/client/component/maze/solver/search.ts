import { create2DArray } from '@technobuddha/library';

import {
  type Cell,
  type CellDirection,
  type Direction,
  type Move,
  type XY,
} from '../geometry/maze.ts';

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
    maze,
    avatarColor = maze.avatarColor,
    pathColor = maze.pathColor,
    method = 'random',
    ...props
  }: SearchProperties) {
    super({ maze, ...props });
    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.method = method;
  }

  protected decide(array: Move[], origin: CellDirection): Move {
    switch (this.method) {
      case 'random': {
        return this.randomPick(array)!;
      }

      case 'seek': {
        return array.sort(
          (a, b) =>
            manhattanDistance({ x: a.move.x, y: a.move.y }, this.maze.exit) -
            manhattanDistance({ x: b.move.x, y: b.move.y }, this.maze.exit),
        )[0];
      }

      case 'left-turn': {
        const left = this.maze.leftTurn(origin);
        return array.sort((a, b) => left.indexOf(a.direction) - left.indexOf(b.direction))[0];
      }

      case 'right-turn': {
        const right = this.maze.rightTurn(origin);
        return array.sort((a, b) => right.indexOf(a.direction) - right.indexOf(b.direction))[0];
      }

      default: {
        return array[0];
      }
    }
  }

  public *solve({
    pathColor = this.pathColor,
    avatarColor = this.avatarColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): Iterator<void> {
    type CellParentDirection = Cell & { parent?: CellParentDirection; direction: Direction };

    let queue: CellParentDirection[] = [];
    const discovered = create2DArray(this.maze.width, this.maze.height, false);

    discovered[entrance.x][entrance.y] = true;
    queue.unshift({
      ...entrance,
      direction: this.maze.opposite({
        ...entrance,
        direction: this.randomPick(Object.keys(this.maze.nexus(entrance).walls))!,
      }),
    });

    let mode: 'forward' | 'backward' | 'solve' = 'forward';

    while (queue.length > 0) {
      const cell = queue.pop()!;

      switch (mode) {
        case 'forward': {
          discovered[cell.x][cell.y] = true;

          if (this.maze.isSame(cell, exit)) {
            mode = 'solve';
            queue = [cell];
          } else {
            const next = this.decide(
              this.maze
                .moves(cell, { wall: false })
                .filter(({ move }) => !discovered[move.x][move.y]),
              cell,
            );
            if (next) {
              this.maze.drawPath(
                this.maze.drawCell({ ...cell, direction: next.direction }),
                pathColor,
              );
              this.maze.drawAvatar(this.maze.drawCell(next.move), avatarColor);
              yield;
              queue.push({ ...next.move, parent: cell });
            } else {
              this.maze.drawX(this.maze.drawCell(cell));
              if (cell.parent) {
                this.maze.drawAvatar(this.maze.drawCell(cell.parent), avatarColor);
              }
              yield;

              if (cell.parent) {
                mode = 'backward';
                queue.push(cell.parent);
              } else {
                mode = 'solve';
              }
            }
          }
          break;
        }

        case 'backward': {
          if (
            this.maze.moves(cell, { wall: false }).some(({ move }) => !discovered[move.x][move.y])
          ) {
            const topOfQueue = queue.pop();
            if (topOfQueue) {
              const { parent, direction } = topOfQueue;

              this.maze.drawAvatar(topOfQueue, avatarColor);

              if (parent) {
                this.maze.drawPath(this.maze.drawCell({ ...parent, direction }), pathColor);
              }
              yield;
            }

            mode = 'forward';
            queue.push(cell);
          } else {
            this.maze.drawX(this.maze.drawCell(cell));
            yield this.maze.drawAvatar(this.maze.drawCell(cell.parent!), avatarColor);
            queue.push(cell.parent!);
          }

          break;
        }

        case 'solve': {
          let next: CellParentDirection | undefined = cell.parent;
          let prev: CellParentDirection = cell;
          while (next) {
            this.maze.solution.unshift({ ...next, direction: prev.direction });
            prev = next;
            next = next.parent;
          }
          queue.length = 0;
        }

        // no default
      }
    }
  }
}
