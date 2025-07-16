import { DotMaze, type DotMazeProperties } from './dot-maze.ts';
import { type Cell } from './maze.ts';

export type ZetaMazeProperties = DotMazeProperties;

export class ZetaMaze extends DotMaze {
  public override reset(): void {
    super.reset();
    this.freezeWalls();
  }

  public override drawIntersections(cell: Cell): void {
    super.drawIntersections(cell, false);
  }

  private freezeWalls(): void {
    for (let x = 1; x < this.width; ++x) {
      for (let y = 1; y < this.height; ++y) {
        if (this.randomChance(0.5)) {
          // remove walls on the \ diagonal
          this.nexus({ x: x, y: y }).erectbarrier('h');
          this.nexus({ x: x - 1, y: y - 1 }).erectbarrier('d');
        } else {
          // remove walls on the / diagonal
          this.nexus({ x: x - 1, y: y }).erectbarrier('b');
          this.nexus({ x: x, y: y - 1 }).erectbarrier('f');
        }
      }
    }
  }
}
