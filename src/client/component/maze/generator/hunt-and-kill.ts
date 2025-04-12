import { create2DArray } from '@technobuddha/library';

import { type AllOrder } from '../maze/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

function hunt<T, R>(
  cells: Iterable<T>,
  callback: (item: T) => R | undefined,
): { cell: T; hunted: R } | undefined {
  for (const cell of cells) {
    const hunted = callback(cell);
    if (hunted !== undefined) {
      return { cell, hunted };
    }
  }

  return undefined;
}

type HuntAndKillProperties = MazeGeneratorProperties & {
  huntMethod?: AllOrder;
};

export class HuntAndKill extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly huntMethod: AllOrder;

  public constructor({ huntMethod = 'top-left', ...props }: HuntAndKillProperties) {
    super(props);

    this.huntMethod = huntMethod;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.currentCell = {
      x: Math.floor(this.random() * this.maze.width),
      y: Math.floor(this.random() * this.maze.height),
    };
  }

  public *generate(): Iterator<void> {
    while (true) {
      // kill
      this.visited[this.currentCell.x][this.currentCell.y] = true;

      const next = this.randomPick(
        this.maze.neighbors(this.currentCell).filter((m) => !this.visited[m.x][m.y]),
      );
      if (next) {
        this.maze.removeWall(this.currentCell, next.direction);
        this.currentCell = next;
        yield;
      } else {
        // hunt

        const target = hunt(
          this.maze.all(this.huntMethod).filter((c) => !this.visited[c.x][c.y]),
          (c) => this.randomPick(this.maze.neighbors(c).filter((n) => this.visited[n.x][n.y])),
        );
        if (target) {
          this.maze.removeWall(target.cell, target.hunted.direction);
          this.currentCell = target.cell;
          yield;
        } else {
          return;
        }
      }
    }
  }
}
