import { create2DArray } from '@technobuddha/library';

import { type CellFacing } from '../geometry/index.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type History = {
  parent?: CellFacing;
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
    scannedColor = maze.color.scanned,
    avatarColor = maze.color.avatar,
    prunedColor = maze.color.pruned,
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
    const queue: CellFacing[] = [];
    const distances = create2DArray<History>(this.maze.width, this.maze.height, () => ({
      distance: Infinity,
    }));
    distances[entrance.x][entrance.y].distance = 0;

    queue.unshift(entrance);
    this.maze.drawAvatar(this.maze.drawCell(entrance), avatarColor);
    yield;

    let cell = queue.pop();
    while (cell) {
      if (this.maze.isSame(cell, exit)) {
        break;
      }

      const distance = distances[cell.x][cell.y].distance + 1;
      const validMoves = this.randomShuffle(
        this.maze
          .moves(cell, { wall: false })
          .filter(({ target }) => distances[target.x][target.y].distance > distance),
      );

      distances[cell.x][cell.y].children = validMoves.length;

      if (validMoves.length > 0) {
        this.maze.drawAvatar(this.maze.drawCell(cell), scannedColor);
        for (const validMove of validMoves) {
          distances[validMove.target.x][validMove.target.y] = {
            parent: cell,
            distance,
          };
          // this.maze.drawCell(cell, scannedColor);
          this.maze.drawAvatar(this.maze.drawCell(validMove.target), avatarColor);
          yield;
          queue.unshift(validMove.target);
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

      cell = queue.pop()!;
    }

    if (cell) {
      const path: CellFacing[] = [cell];
      for (let dist = distances[cell.x][cell.y]; dist.parent; dist = distances[cell.x][cell.y]) {
        cell = dist.parent;
        path.unshift(cell);
      }

      this.maze.solution = this.maze.makePath(path);
    }
  }
}
