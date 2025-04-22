import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../maze/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export class Prims extends MazeGenerator {
  private readonly visited: boolean[][];
  public activeCells: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.activeCells = [this.start];
    this.visited[this.start.x][this.start.y] = true;
  }

  public override *generate(): Iterator<void> {
    while (this.activeCells.length > 0) {
      const cellIndex = Math.floor(this.random() * this.activeCells.length);
      this.currentCell = this.activeCells[cellIndex];

      const cell = this.randomPick(
        this.maze.neighbors(this.currentCell).filter((c) => !this.visited[c.x][c.y]),
      );
      if (cell) {
        this.maze.removeWall(this.currentCell, cell.direction);
        yield;
        this.visited[cell.x][cell.y] = true;

        this.activeCells.push(cell);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }
  }
}
