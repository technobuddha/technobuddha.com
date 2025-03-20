import type { Cell } from '../maze/maze';
import { MazeGenerator } from './maze-generator';
import type { MazeGeneratorProperties } from './maze-generator';
import create2DArray from '@technobuddha/library/create2DArray';

export class RecursiveBacktracker extends MazeGenerator {
  private readonly visited: boolean[][];
  public stack: Cell[];

  constructor(props: MazeGeneratorProperties) {
    super(props);

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.currentCell = this.start;
    this.stack = [this.currentCell];
    this.visited[this.currentCell.x][this.currentCell.y] = true;
  }

  public override step(): boolean {
    const unvisitedNeighbors = this.maze
      .neighbors(this.currentCell)
      .filter((cell) => !this.visited[cell.x][cell.y]);
    if (unvisitedNeighbors.length > 0) {
      const newCell = this.selectNeighbor(unvisitedNeighbors);
      this.maze.removeWall(this.currentCell, newCell.direction);
      this.visited[newCell.x][newCell.y] = true;

      this.stack.push(newCell);
      this.currentCell = newCell;
    } else {
      this.currentCell = this.stack.pop()!;
    }

    return this.stack.length > 0;
  }
}
