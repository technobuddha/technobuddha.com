import { DotMaze, type DotMazeProperties } from './dot-maze.ts';
import { type Cell } from './maze.ts';

export type ZetaMazeProperties = DotMazeProperties;

export class ZetaMaze extends DotMaze {
  public override reset(): void {
    super.reset();
    this.freezeWalls();
  }

  public override drawWalls(cell: Cell, color = this.wallColor): void {
    super.drawWalls(cell, color);
    const { walls } = this.nexus(cell);

    for (const direction of this.directions) {
      if (!(direction in walls)) {
        this.drawWall({ ...cell, direction }, color);
      }
    }
  }

  public override drawIntersections(cell: Cell): void {
    super.drawIntersections(cell, false);
  }

  private freezeWalls(): void {
    for (let x = 1; x < this.width; ++x) {
      for (let y = 1; y < this.height; ++y) {
        if (this.randomChance(0.5)) {
          // remove walls on the \ diagonal
          delete this.nexus({ x: x, y: y }).walls.h;
          delete this.nexus({ x: x - 1, y: y - 1 }).walls.d;
        } else {
          // remove walls on the / diagonal
          delete this.nexus({ x: x - 1, y: y }).walls.b;
          delete this.nexus({ x: x, y: y - 1 }).walls.f;
        }
      }
    }
  }
}
