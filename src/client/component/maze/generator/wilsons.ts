import { type Cell, type CellDirection } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export class Wilsons extends MazeGenerator {
  private readonly unvisited: Cell[];

  public constructor(props: MazeGeneratorProperties) {
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

  // eslint-disable-next-line @typescript-eslint/require-await
  public async *generate(): AsyncGenerator<void> {
    while (this.unvisited.length > 0) {
      let currentCell = this.randomPick(this.unvisited)!;
      let path: (Cell | CellDirection)[] = [currentCell];

      while (!this.isVisited(currentCell)) {
        const { move } = this.randomPick(this.maze.moves(currentCell))!;

        let cellVisited = false;
        let cellPreviousIndex = -1;
        for (const [index, pathCell] of path.entries()) {
          if (this.maze.isSame(pathCell, move)) {
            cellVisited = true;
            cellPreviousIndex = index;
          }
        }

        if (cellVisited) {
          currentCell = path[cellPreviousIndex];
          path = path.slice(0, cellPreviousIndex + 1);
        } else {
          path.push(move);
          currentCell = move;
        }
      }

      for (const cell of path) {
        if ('direction' in cell) {
          this.maze.removeWall(cell, this.maze.opposite(cell));
          yield;
        }
        this.markAsVisited(cell);
      }
    }
  }
}
