import { directionMatrix } from './dot-matrix.ts';
import { DotMaze } from './dot-maze.ts';
import { type Cell, type Direction } from './maze.ts';

export class ZetaMaze extends DotMaze {
  public override removeWall(cell: Cell, direction: Direction): void {
    super.removeWall(cell, direction);

    switch (direction) {
      case 'b': {
        const c1 = this.move(cell, 'a');
        const c2 = this.move(cell, 'c');

        if (c1) {
          delete this.nexus(c1).walls.d;
          this.drawCell(c1);
        }
        if (c2) {
          delete this.nexus(c2).walls.h;
          this.drawCell(c2);
        }
        break;
      }

      case 'd': {
        const c1 = this.move(cell, 'c');
        const c2 = this.move(cell, 'e');

        if (c1) {
          delete this.nexus(c1).walls.f;
          this.drawCell(c1);
        }
        if (c2) {
          delete this.nexus(c2).walls.b;
          this.drawCell(c2);
        }
        break;
      }

      case 'f': {
        const c1 = this.move(cell, 'e');
        const c2 = this.move(cell, 'g');

        if (c1) {
          delete this.nexus(c1).walls.h;
          this.drawCell(c1);
        }
        if (c2) {
          delete this.nexus(c2).walls.d;
          this.drawCell(c2);
        }
        break;
      }

      case 'h': {
        const c1 = this.move(cell, 'a');
        const c2 = this.move(cell, 'g');

        if (c1) {
          delete this.nexus(c1).walls.f;
          this.drawCell(c1);
        }
        if (c2) {
          delete this.nexus(c2).walls.b;
          this.drawCell(c2);
        }
        break;
      }

      // no default
    }
  }

  public override drawCell<T extends Cell>(
    cell: T,
    cellColor = this.cellColor,
    wallColor = this.wallColor,
  ): T {
    this.drawFloor(
      cell,
      this.isSame(cell, this.entrance) ? this.entranceColor
      : this.isSame(cell, this.exit) ? this.exitColor
      : cellColor,
    );

    const wall = this.nexus(cell).walls;
    for (const direction of directionMatrix) {
      switch (wall[direction]) {
        case true: {
          this.drawLongWall({ ...cell, direction }, wallColor);
          break;
        }

        case false: {
          this.drawIntersection({ ...cell, direction }, cellColor);
          break;
        }

        case undefined: {
          this.drawWall({ ...cell, direction }, wallColor);
        }

        // no default
      }
    }

    for (const pillar of this.pillars) {
      this.drawPillar({ ...cell, pillar }, wallColor);
    }

    return cell;
  }

  public override removeInteriorWalls(): void {
    super.removeInteriorWalls();
    this.freezeWalls();
  }

  public override freezeWalls(): void {
    for (let x = 1; x < this.width; ++x) {
      for (let y = 1; y < this.height; ++y) {
        if (this.random() < 0.5) {
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
