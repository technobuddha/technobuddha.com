import { MazeGenerator } from './maze-generator.js';
import create2DArray from '@technobuddha/library/create2DArray';

import type { MazeGeneratorProperties } from './maze-generator.js';

export class AldousBroder extends MazeGenerator {
  private readonly visited: boolean[][] = [];
  private totalVisited = 0;

  constructor(props: MazeGeneratorProperties) {
    super(props);
    this.totalVisited = 0;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);

    this.currentCell = this.start;
    this.visited[this.currentCell.x][this.currentCell.y] = true;
  }

  public override step(): boolean {
    for (;;) {
      const cell = this.selectNeighbor(this.maze.neighbors(this.currentCell));

      if (!this.visited[cell.x][cell.y]) {
        this.maze.removeWall(this.currentCell, cell.direction);
        this.visited[cell.x][cell.y] = true;
        this.totalVisited++;
        break;
      }

      this.currentCell = cell;
    }

    return this.totalVisited < this.maze.width * this.maze.height;
  }
}
