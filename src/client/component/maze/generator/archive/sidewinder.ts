import { type Cell, type Direction } from '../../maze/maze.ts';

import { type MazeGeneratorProperties } from '../maze-generator.ts';
import { MazeGenerator } from '../maze-generator.ts';

export class Sidewinder extends MazeGenerator {
  private runSet: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = { x: 0, y: 0 };
    this.runSet = [];
  }

  public *generator(): Iterator<void> {
    while(true) {
      this.runSet.push(this.currentCell);

      const dirs: Direction[] = [];
      if (this.currentCell.x !== this.maze.width - 1) {
        dirs.push('E');
      }
      if (this.currentCell.y !== 0) {
        dirs.push('N');
      }

      if (dirs.length > 0) {
        const carveDirection = this.randomPick(
          this.maze.neighbors(this.currentCell, { directions: dirs }),
        )!.direction;

        if (carveDirection === 'N') {
          const cell = this.runSet[Math.floor(this.random() * this.runSet.length)];
          this.maze.removeWall(cell, 'N');
          this.runSet = [];
        } else {
          this.maze.removeWall(this.currentCell, 'E');
        }
     }

      this.currentCell = { x: this.currentCell.x + 1, y: this.currentCell.y };
      if (this.currentCell.x >= this.maze.width) {
        this.currentCell.x = 0;
        this.currentCell.y++;
        this.runSet = [];
      }

    return this.currentCell.y < this.maze.height;
  }
}
