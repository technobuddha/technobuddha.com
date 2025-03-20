import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellDirection } from '../maze/maze.js';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.js';

export class Wilsons extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly unvisited: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    const { width, height } = this.maze;

    this.visited = create2DArray(width, height, false);
    this.unvisited = create2DArray(width, height, (x, y) => ({ x, y }))
      .flat()
      .filter((cell) => this.maze.inMaze(cell));

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

  public override step(): boolean {
    for (let i = 0; i < 10 && this.unvisited.length > 0; ++i) {
      this.currentCell = this.unvisited[Math.floor(this.random() * this.unvisited.length)];
      let path: (Cell | CellDirection)[] = [this.currentCell];

      while (!this.visited[this.currentCell.x][this.currentCell.y]) {
        const cell = this.randomPick(this.maze.neighbors(this.currentCell))!;

        let cellVisited = false;
        let cellPreviousIndex = -1;
        for (const [index, pathCell] of path.entries()) {
          if (pathCell.x === cell.x && pathCell.y === cell.y) {
            cellVisited = true;
            cellPreviousIndex = index;
          }
        }

        if (cellVisited) {
          this.currentCell = path[cellPreviousIndex];
          path = path.slice(0, cellPreviousIndex + 1);
        } else {
          path.push(cell);
          this.currentCell = cell;
        }
      }

      for (const cell of path) {
        if ('direction' in cell) {
          this.maze.removeWall(cell, this.maze.opposite(cell.direction));
        }
        this.markAsVisited(cell);
      }
    }

    return this.unvisited.length > 0;
  }
}
