import { create2DArray } from '@technobuddha/library';

import { MazeGenerator, type MazeGeneratorProperties } from '../maze-generator.ts';

export class AldousBroder extends MazeGenerator {
  private readonly visited: boolean[][] = [];
  private totalVisited = 0;

  public constructor(props: MazeGeneratorProperties) {
    super(props);
    this.totalVisited = 0;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);

    this.currentCell = this.start;
    this.visited[this.currentCell.x][this.currentCell.y] = true;
  }

  public override step(): boolean {
    for (;;) {
      const cell = this.randomPick(this.maze.neighbors(this.currentCell))!;

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
