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

      const unvisitedNeighbors = this.maze
        .neighbors(this.currentCell)
        .filter((cell) => !this.visited[cell.x][cell.y]);
      if (unvisitedNeighbors.length > 0) {
        const newCell = this.randomPick(unvisitedNeighbors)!;
        this.maze.removeWall(this.currentCell, newCell.direction);
        yield;
        this.visited[newCell.x][newCell.y] = true;

        this.activeCells.push(newCell);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }
  }
}
