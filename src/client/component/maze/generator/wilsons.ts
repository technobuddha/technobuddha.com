import { type Cell, type CellFacing } from '../geometry/index.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export type WilsonsProperties = MazeGeneratorProperties;

export class Wilsons extends MazeGenerator {
  private readonly unvisited: Cell[];

  public constructor(props: WilsonsProperties) {
    super(props);

    this.unvisited = this.maze.cellsInMaze();

    this.player = 0;
    this.createPlayer();

    this.markAsVisited(this.start);
  }

  private markAsVisited(cell: Cell): void {
    this.visit({ cell });

    const index = this.unvisited.findIndex((c) => c.x === cell.x && c.y === cell.y);
    if (index >= 0) {
      this.unvisited.splice(index, 1);
    }
  }

  public async *generate(): AsyncGenerator<void> {
    while (this.unvisited.length > 0) {
      let currentCell = this.randomPick(this.unvisited)!;
      let path: (Cell | CellFacing)[] = [currentCell];

      while (!this.isVisited(currentCell)) {
        const { target } = this.randomPick(this.maze.moves(currentCell, { wall: 'all' }))!;

        let cellVisited = false;
        let cellPreviousIndex = -1;
        for (const [index, pathCell] of path.entries()) {
          if (this.maze.isSame(pathCell, target)) {
            cellVisited = true;
            cellPreviousIndex = index;
          }
        }

        if (cellVisited) {
          currentCell = path[cellPreviousIndex];
          path = path.slice(0, cellPreviousIndex + 1);
        } else {
          path.push(target);
          currentCell = target;
        }
      }

      for (const cell of path) {
        if ('facing' in cell) {
          this.maze.removeWall(cell, this.maze.opposite(cell.facing));
          yield;
        }
        this.markAsVisited(cell);
      }
    }
  }
}
