import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellFacing } from '../geometry/index.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

export type FillerProperties = MazeSolverProperties & {
  readonly blockedColor?: string;
  readonly method?: 'cul-de-sac' | 'dead-end';
};

export class Filler extends MazeSolver {
  protected readonly markedColor: string;
  protected readonly method: FillerProperties['method'];
  protected readonly deadEnds: boolean[][];

  public constructor({
    maze,
    blockedColor = maze.prunedColor,
    method = 'cul-de-sac',
    ...props
  }: FillerProperties) {
    super({ maze, ...props });
    this.markedColor = blockedColor;
    this.method = method;

    this.deadEnds = create2DArray(this.maze.width, this.maze.height, false);
  }

  private isDeadEnd(cell: Cell, entrance: Cell, exit: Cell): boolean {
    return (
      !this.deadEnds[cell.x][cell.y] &&
      !this.maze.isSame(cell, entrance) &&
      !this.maze.isSame(cell, exit) &&
      this.maze
        .moves(cell, { wall: false })
        .filter(
          ({ target }) =>
            !this.deadEnds[target.x][target.y] ||
            this.maze.isSame(target, exit) ||
            this.maze.isSame(target, entrance),
        ).length === 1
    );
  }

  public async *solve({
    markedColor = this.markedColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    const walls = this.maze.backup();

    while (true) {
      const deadEnds = this.randomShuffle(
        this.maze.cellsInMaze().filter((cell) => this.isDeadEnd(cell, entrance, exit)),
      );
      if (deadEnds.length === 0) {
        break;
      }

      for (let deadEnd of deadEnds) {
        if (this.method === 'dead-end') {
          this.deadEnds[deadEnd.x][deadEnd.y] = true;
          // this.maze.drawX(deadEnd, markedColor);
          this.maze.drawCell(deadEnd, markedColor);
          yield;
        } else {
          while (true) {
            const moves = this.maze
              .moves(deadEnd, { wall: false })
              .filter(({ target }) => !this.deadEnds[target.x][target.y]);
            if (moves.length === 1) {
              this.deadEnds[deadEnd.x][deadEnd.y] = true;
              // this.maze.drawX(deadEnd, markedColor);
              this.maze.drawCell(deadEnd, markedColor);
              deadEnd = moves[0].target;
              yield;
            } else {
              break;
            }
          }
        }
      }
    }

    let cell: CellFacing = { ...this.maze.entrance };
    let prev: CellFacing | undefined = undefined;
    const path: CellFacing[] = [cell];

    while (!this.maze.isSame(cell, exit)) {
      const moves = this.maze.moves(cell, { wall: false }).filter(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        ({ target }) => !this.maze.isSame(prev, target) && !this.deadEnds[target.x][target.y],
      );
      if (moves.length === 0 || moves.length > 1) {
        this.maze.sendMessage(`filler ${this.method} no solution found`);
        return;
      }

      const [move] = moves;
      prev = cell;
      cell = move.target;
      path.push(cell);
    }

    this.maze.solution = this.maze.makePath(path);

    this.maze.restore(walls);
  }
}
