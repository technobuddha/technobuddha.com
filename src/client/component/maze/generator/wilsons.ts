import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellDirection } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export class Wilsons extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly unvisited: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    const { width, height } = this.maze;

    this.visited = create2DArray(width, height, false);
    this.unvisited = this.maze.cellsInMaze();

    this.currentCell = this.start;
    this.markAsVisited(this.currentCell);
  }

  private markAsVisited(cell: Cell): void {
    this.visited[cell.x][cell.y] = true;

    const index = this.unvisited.findIndex((c) => c.x === cell.x && c.y === cell.y);
    if (index >= 0) {
      this.unvisited.splice(index, 1);
    }
  }

  public *generate(): Generator<void> {
    while (this.unvisited.length > 0) {
      this.currentCell = this.randomPick(this.unvisited)!;
      let path: (Cell | CellDirection)[] = [this.currentCell];

      while (!this.visited[this.currentCell.x][this.currentCell.y]) {
        const { move } = this.randomPick(this.maze.moves(this.currentCell))!;

        let cellVisited = false;
        let cellPreviousIndex = -1;
        for (const [index, pathCell] of path.entries()) {
          if (this.maze.isSame(pathCell, move)) {
            cellVisited = true;
            cellPreviousIndex = index;
          }
        }

        if (cellVisited) {
          this.currentCell = path[cellPreviousIndex];
          path = path.slice(0, cellPreviousIndex + 1);
        } else {
          path.push(move);
          this.currentCell = move;
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
