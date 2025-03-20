import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../maze/maze.js';

import { type MazeGeneratorProperties } from './maze-generator.js';
import { MazeGenerator } from './maze-generator.js';

export class HuntAndKill extends MazeGenerator {
  private readonly visited: boolean[][];
  private startHuntingFrom: Cell;
  private hunting: boolean;

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = this.start;
    this.startHuntingFrom = this.currentCell;
    this.hunting = false;

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
  }

  public override step(): boolean {
    let run = true;
    while (run && this.maze.inMaze(this.currentCell)) {
      if (this.hunting) {
        if (!this.visited[this.currentCell.x][this.currentCell.y]) {
          const visitedNeighbors = this.maze
            .neighbors(this.currentCell)
            .filter((cell) => this.visited[cell.x][cell.y]);

          if (visitedNeighbors.length > 0) {
            this.startHuntingFrom =
              (
                this.currentCell.y !== 0 &&
                !this.visited[this.currentCell.y][this.currentCell.y - 1]
              ) ?
                { x: this.currentCell.x, y: this.currentCell.y - 1 }
              : { ...this.currentCell };

            this.maze.removeWall(this.currentCell, this.selectNeighbor(visitedNeighbors).direction);

            this.hunting = false;
          }
        }
      } else {
        this.visited[this.currentCell.x][this.currentCell.y] = true;

        const unvisitedNeighbors = this.maze
          .neighbors(this.currentCell)
          .filter((cell) => !this.visited[cell.x][cell.y]);
        if (unvisitedNeighbors.length > 0) {
          const cell = this.selectNeighbor(unvisitedNeighbors);

          run = false;
          this.maze.removeWall(this.currentCell, cell.direction);
          this.currentCell = cell;

          if (
            Math.max(this.currentCell.y - 1, 0) < this.startHuntingFrom.y ||
            (Math.max(this.currentCell.x - 1, 0) < this.startHuntingFrom.x &&
              Math.max(this.currentCell.y - 1, 0) === this.startHuntingFrom.y)
          ) {
            if (this.currentCell.y !== 0) {
              this.startHuntingFrom = { x: this.currentCell.x, y: this.currentCell.y - 1 };
            } else if (this.currentCell.x === 0) {
              this.startHuntingFrom = this.currentCell;
            } else {
              this.startHuntingFrom = { x: this.currentCell.x - 1, y: this.currentCell.y };
            }
          }
        } else {
          this.hunting = true;
          this.currentCell = this.startHuntingFrom;
        }
      }

      if (this.hunting) {
        this.currentCell = this.maze.scan(this.currentCell);
      }
    }

    return this.maze.inMaze(this.currentCell);
  }
}
