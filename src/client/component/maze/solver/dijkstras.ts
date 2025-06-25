import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellDirection, type Direction } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type History = {
  parent?: Cell;
  direction?: Direction;
  distance: number;
  children?: number;
};

export type DijkstrasProperties = MazeSolverProperties & {
  readonly scannedColor?: string;
  readonly prunedColor?: string;
  readonly avatarColor?: string;
};

export class Dijkstras extends MazeSolver {
  public readonly scannedColor: string;
  public readonly prunedColor: string;
  public readonly avatarColor: string;

  public constructor({
    maze,
    scannedColor = maze.scannedColor,
    avatarColor = maze.avatarColor,
    prunedColor = maze.prunedColor,
    ...props
  }: DijkstrasProperties) {
    super({ maze, ...props });
    this.scannedColor = scannedColor;
    this.avatarColor = avatarColor;
    this.prunedColor = prunedColor;
  }

  public async *solve({
    avatarColor = this.avatarColor,
    scannedColor = this.scannedColor,
    prunedColor = this.prunedColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    const queue: Cell[] = [];
    const distances = create2DArray<History>(this.maze.width, this.maze.height, () => ({
      distance: Infinity,
    }));
    distances[entrance.x][entrance.y].distance = 0;

    queue.unshift(entrance);
    this.maze.drawAvatar(this.maze.drawCell(entrance), avatarColor);
    yield;

    while (queue.length > 0) {
      const cell = queue.pop()!;

      if (this.maze.isSame(cell, exit)) {
        break;
      }

      const distance = distances[cell.x][cell.y].distance + 1;
      const validMoves = this.randomShuffle(
        this.maze
          .moves(cell, { wall: false })
          .filter(({ move }) => distances[move.x][move.y].distance > distance),
      );

      distances[cell.x][cell.y].children = validMoves.length;

      if (validMoves.length > 0) {
        this.maze.drawAvatar(this.maze.drawCell(cell), scannedColor);
        for (const validMove of validMoves) {
          distances[validMove.move.x][validMove.move.y] = {
            parent: cell,
            direction: validMove.direction,
            distance,
          };
          // this.maze.drawCell(cell, scannedColor);
          this.maze.drawAvatar(this.maze.drawCell(validMove.move), avatarColor);
          yield;
          queue.unshift(validMove.move);
        }
      } else {
        let parent = cell;
        while (true) {
          distances[parent.x][parent.y].children =
            (distances[parent.x][parent.y].children ?? 0) - 1;

          if (distances[parent.x][parent.y].children! <= 0) {
            this.maze.drawCell(parent, prunedColor);
            // yield;
            parent = distances[parent.x][parent.y].parent!;
          } else {
            break;
          }
        }

        yield;
      }
    }

    let cell: CellDirection = { ...exit, direction: this.maze.opposite(exit.direction) };

    let dist = distances[cell.x][cell.y];
    if (!dist || dist.distance === Infinity) {
      throw new Error('No solution found');
    } else {
      for (;;) {
        dist = distances[cell.x][cell.y];

        this.maze.solution.push({ ...cell });
        if (this.maze.isSame(cell, entrance)) {
          break;
        }
        const next: CellDirection = { ...dist.parent!, direction: dist.direction! };

        if (next) {
          cell = next;
        } else {
          throw new Error('No solution found');
        }
      }
    }
  }
}
