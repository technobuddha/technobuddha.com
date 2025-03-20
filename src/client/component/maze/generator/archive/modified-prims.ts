import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../../maze/maze.js';

import { type MazeGeneratorProperties } from '../maze-generator.js';
import { MazeGenerator } from '../maze-generator.js';

export class ModifiedPrims extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly activeCells: Cell[];
  private readonly costs: number[][];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.activeCells = [this.start];
    this.visited[this.start.x][this.start.y] = true;
    this.costs = create2DArray(this.maze.width, this.maze.height, this.random);
  }

  public override step(): boolean {
    for (let i = 0; i < 10 && this.activeCells.length > 0; ++i) {
      let minCost = Infinity;
      let cellIndex = 0;
      for (const [index, cell] of this.activeCells.entries()) {
        if (this.costs[cell.x][cell.y] < minCost) {
          minCost = this.costs[cell.x][cell.y];
          cellIndex = index;
        }
      }
      this.currentCell = this.activeCells[cellIndex];

      const unvisitedNeighbors = this.maze
        .neighbors(this.currentCell)
        .filter((cell) => !this.visited[cell.x][cell.y]);
      if (unvisitedNeighbors.length > 0) {
        const newCell = this.randomPick(unvisitedNeighbors)!;
        this.maze.removeWall(this.currentCell, newCell.direction);
        this.visited[newCell.x][newCell.y] = true;

        this.activeCells.push(newCell);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }

    return this.activeCells.length > 0;
  }
}
