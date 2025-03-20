import { create2DArray } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.js';

import { type MazeGeneratorProperties } from './maze-generator.js';
import { MazeGenerator } from './maze-generator.js';

export type RecursiveBacktrackerProperties = MazeGeneratorProperties;

export class RecursiveBacktracker extends MazeGenerator {
  private readonly visited: boolean[][];
  public stack: Cell[];
  public direction: Direction;

  public constructor(props: RecursiveBacktrackerProperties) {
    super(props);

    this.currentCell = this.start;
    this.direction =
      this.start.x === this.maze.entrance.x && this.maze.entrance.y === 0 ?
        this.maze.entrance.direction
      : this.maze.resolveDirection(this.maze.exit).direction;
    this.stack = [this.currentCell];

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.visited[this.currentCell.x][this.currentCell.y] = true;
  }

  public override step(): boolean {
    const unvisitedNeighbors = this.maze
      .neighbors(this.currentCell)
      .filter((cell) => !this.visited[cell.x][cell.y]);
    if (unvisitedNeighbors.length > 0) {
      const newCell = this.randomPick(unvisitedNeighbors)!;
      this.maze.drawCell(this.currentCell);
      this.maze.drawX(this.currentCell);
      this.maze.removeWall(this.currentCell, newCell.direction);
      this.visited[newCell.x][newCell.y] = true;

      this.stack.push(newCell);
      this.currentCell = newCell;
      this.direction = newCell.direction;
    } else {
      this.currentCell = this.stack.pop()!;
    }

    return this.stack.length > 0;
  }
}
