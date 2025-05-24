/* eslint-disable @typescript-eslint/class-methods-use-this */
import { type Rect } from '../drawing/drawing.ts';

import { matrix } from './dot-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  Maze,
  type MazeProperties,
  type Pillar,
} from './maze.ts';

export class DotMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 6, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      groupHeight: this.cellSize,
      topPadding: this.wallSize,
      leftPadding: this.wallSize,
      rightPadding: this.wallSize,
      bottomPadding: this.wallSize,
    };
  }

  public cellKind(_cell: Cell): number {
    return 0;
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(cell, cell.x * this.cellSize, cell.y * this.cellSize);
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;
    const x7 = x0 + this.cellSize;
    const xc = (x0 + x7) / 2;
    const x1 = x0 + this.wallSize / Math.SQRT2;
    const x3 = xc - this.wallSize / 2;
    const x4 = xc + this.wallSize / 2;
    const x2 = x3 - this.wallSize / Math.SQRT2;
    const x5 = x4 + this.wallSize / Math.SQRT2;
    const x6 = x7 - this.wallSize / Math.SQRT2;
    const xx = x0 - this.wallSize / Math.SQRT2;
    const xz = x7 + this.wallSize / Math.SQRT2;

    const y0 = 0;
    const y7 = y0 + this.cellSize;
    const yc = (y0 + y7) / 2;
    const y1 = y0 + this.wallSize / Math.SQRT2;
    const y3 = yc - this.wallSize / 2;
    const y4 = yc + this.wallSize / 2;
    const y2 = y3 - this.wallSize / Math.SQRT2;
    const y5 = y4 + this.wallSize / Math.SQRT2;
    const y6 = y7 - this.wallSize / Math.SQRT2;
    const yx = y0 - this.wallSize / Math.SQRT2;
    const yz = y7 + this.wallSize / Math.SQRT2;

    // z0 z1 z2 z3 z4 z5 z6 z7 z8 z9
    // zx z0 z1 z2 z3 z4 z5 z6 z7 zz
    return {
      xx,
      x0,
      x1,
      x2,
      x3,
      x4,
      x5,
      x6,
      x7,
      xz,
      yx,
      y0,
      y1,
      y2,
      y3,
      y4,
      y5,
      y6,
      y7,
      yz,
    };
  }

  public override drawCell<T extends Cell>(cell: T, color = this.cellColor): T {
    super.drawCell(cell, color);
    this.drawIntersections(cell);
    return cell;
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x1, x6, x7, y0, y1, y6, y7 } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y6 },
          { x: x0, y: y1 },
          { x: x1, y: y0 },
          { x: x6, y: y0 },
          { x: x7, y: y1 },
          { x: x7, y: y6 },
          { x: x6, y: y7 },
          { x: x1, y: y7 },
        ],
        color,
      );
    }
  }

  public override drawPillars(cell: Cell, color = this.wallColor): void {
    for (const pillar of this.pillars) {
      this.drawPillar(cell, pillar, color);
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      switch (cd.direction) {
        case 'a': {
          const { x3, x4, y0, y2 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x3, y: y0 }, { x: x4, y: y2 }, color);
          break;
        }

        case 'b': {
          const { x4, x5, x6, x7, y0, y1, y2, y3 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x4, y: y2 },
              { x: x6, y: y0 },
              { x: x7, y: y1 },
              { x: x5, y: y3 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x5, x7, y3, y4 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x5, y: y3 }, { x: x7, y: y4 }, color);
          break;
        }

        case 'd': {
          const { x4, x5, x6, x7, y4, y5, y6, y7 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x4, y: y5 },
              { x: x5, y: y4 },
              { x: x7, y: y6 },
              { x: x6, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { x3, x4, y5, y7 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x3, y: y5 }, { x: x4, y: y7 }, color);
          break;
        }

        case 'f': {
          const { x0, x1, x2, x3, y4, y5, y6, y7 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x0, y: y6 },
              { x: x2, y: y4 },
              { x: x3, y: y5 },
              { x: x1, y: y7 },
            ],
            color,
          );

          break;
        }

        case 'g': {
          const { x0, x2, y3, y4 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x0, y: y3 }, { x: x2, y: y4 }, color);
          break;
        }

        case 'h': {
          const { x0, x1, x2, x3, y0, y1, y2, y3 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x0, y: y1 },
              { x: x1, y: y0 },
              { x: x3, y: y2 },
              { x: x2, y: y3 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public override drawOutsideWall(_cell: CellDirection, _color = this.wallColor): void {}

  public override drawOutsidePillar(_cell: Cell, _pillar: Pillar): void {}

  public drawIntersections(cell: Cell): void {
    if (this.drawing) {
      const { walls } = this.nexus(cell);

      const { x0, x1, x6, x7, y0, y1, y6, y7 } = this.cellOffsets(cell);
      // b
      const crossedB =
        this.inMaze({ x: cell.x, y: cell.y - 1 }) &&
        this.nexus({ x: cell.x, y: cell.y - 1 }).walls.d === false;

      this.drawing.polygon(
        [
          { x: x6, y: y0 },
          { x: x7, y: y1 },
          { x: x7, y: y0 },
        ],
        !walls.b || crossedB ? this.cellColor : this.wallColor,
      );

      if (!walls.b && crossedB && (cell.x + cell.y) % 2 === 0) {
        this.drawing.line({ x: x6, y: y0 }, { x: x7, y: y1 }, this.tunnelColor);
      }

      // d
      const crossedD =
        this.inMaze({ x: cell.x + 1, y: cell.y }) &&
        this.nexus({ x: cell.x + 1, y: cell.y }).walls.f === false;

      this.drawing.polygon(
        [
          { x: x6, y: y7 },
          { x: x7, y: y7 },
          { x: x7, y: y6 },
        ],
        !walls.d || crossedD ? this.cellColor : this.wallColor,
      );

      if (!walls.d && crossedD && (cell.x + cell.y) % 2 === 0) {
        this.drawing.line({ x: x6, y: y7 }, { x: x7, y: y6 }, this.tunnelColor);
      }

      // f
      const crossedF =
        this.inMaze({ x: cell.x, y: cell.y + 1 }) &&
        this.nexus({ x: cell.x, y: cell.y + 1 }).walls.h === false;

      this.drawing.polygon(
        [
          { x: x0, y: y7 },
          { x: x1, y: y7 },
          { x: x0, y: y6 },
        ],
        !walls.f || crossedF ? this.cellColor : this.wallColor,
      );

      if (!walls.f && crossedF && (cell.x + cell.y) % 2 === 0) {
        this.drawing.line({ x: x0, y: y6 }, { x: x1, y: y7 }, this.tunnelColor);
      }

      // h
      const crossedH =
        this.inMaze({ x: cell.x - 1, y: cell.y }) &&
        this.nexus({ x: cell.x - 1, y: cell.y }).walls.b === false;

      this.drawing.polygon(
        [
          { x: x0, y: y1 },
          { x: x1, y: y0 },
          { x: x0, y: y0 },
        ],
        !walls.h || crossedH ? this.cellColor : this.wallColor,
      );

      if (!walls.h && crossedH && (cell.x + cell.y) % 2 === 0) {
        this.drawing.line({ x: x0, y: y1 }, { x: x1, y: y0 }, this.tunnelColor);
      }
    }
  }

  public drawPillar(cell: Cell, pillar: Pillar, color = this.wallColor): void {
    if (this.drawing) {
      switch (pillar) {
        case 'ab': {
          const { x4, x6, y0, y2 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x4, y: y2 },
              { x: x6, y: y0 },
              { x: x4, y: y0 },
            ],
            color,
          );
          break;
        }

        case 'bc': {
          const { x5, x7, y1, y3 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y3 },
              { x: x7, y: y3 },
              { x: x7, y: y1 },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { x5, x7, y4, y6 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y4 },
              { x: x7, y: y4 },
              { x: x7, y: y6 },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x4, x6, y5, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x4, y: y7 },
              { x: x4, y: y5 },
              { x: x6, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'ef': {
          const { x1, x3, y5, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y7 },
              { x: x3, y: y5 },
              { x: x3, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'fg': {
          const { x0, x2, y4, y6 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y6 },
              { x: x0, y: y4 },
              { x: x2, y: y4 },
            ],
            color,
          );
          break;
        }

        case 'gh': {
          const { x0, x2, y1, y3 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y3 },
              { x: x2, y: y3 },
              { x: x0, y: y1 },
            ],
            color,
          );
          break;
        }

        case 'ha': {
          const { x1, x3, y0, y2 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y0 },
              { x: x3, y: y0 },
              { x: x3, y: y2 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      const { x2, x3, x4, x5, y2, y3, y4, y5 } = this.cellOffsets(cell);

      this.drawing.line({ x: x3, y: y2 }, { x: x4, y: y5 }, color);
      this.drawing.line({ x: x4, y: y2 }, { x: x3, y: y5 }, color);
      this.drawing.line({ x: x2, y: y4 }, { x: x5, y: y3 }, color);
      this.drawing.line({ x: x5, y: y4 }, { x: x2, y: y3 }, color);
    }
  }

  public getRect(cell: Cell): Rect {
    const { x2, x5, y2, y5 } = this.cellOffsets(cell);

    return { x: x2, y: y2, w: x5 - x2, h: y5 - y2 };
  }
}
