import { type Cartesian, modulo, type Rect } from '@technobuddha/library';

import { type Cell, type Direction, type Kind, type Pillar } from '../geometry.ts';
import { type DrawingSizes, Maze, type MazeProperties } from '../maze.ts';

import { matrix } from './triangle-matrix.ts';

const SIN60 = Math.sin(Math.PI / 3);
const SIN30 = Math.sin(Math.PI / 6);
const COS60 = Math.cos(Math.PI / 3);
const COS30 = Math.cos(Math.PI / 6);

export type TriangleMazeProperties = MazeProperties;

export class TriangleMaze extends Maze {
  public constructor({
    cellSize = 36,
    wallSize = 2,
    voidSize = 2,
    ...props
  }: TriangleMazeProperties) {
    super({ cellSize, wallSize, voidSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      horizontalCellsPerGroup: 2,
      groupHeight: this.cellSize * SIN60 * 2,
      verticalCellsPerGroup: 2,
      rightPadding: this.cellSize * 0.5,
    };
  }

  public cellKind(cell: Cell): number {
    return modulo(cell.x + cell.y, 2);
  }

  protected cellOrigin(cell: Cell): Cartesian {
    return {
      x: cell.x * this.cellSize * 0.5,
      y: cell.y * this.cellSize * SIN60,
    };
  }

  public override manhattanDistance(a: Cell, b: Cell): number {
    return super.manhattanDistance({ ...a, x: a.x / 2 }, { ...b, x: b.x / 2 });
  }

  protected offsets(kind: Kind): Record<string, number> {
    const c = this.cellSize;
    const w = this.wallSize;
    const v = this.voidSize;

    const x0 = 0;
    const x1 = x0 + v * COS30;
    const x2 = x1 + v * COS30;
    const x5 = x2 + (w / SIN30) * COS30;
    const x4 = x5 - w * COS30;
    const x3 = x4 - v * COS30;

    const xi = x0 + c;
    const xh = xi - v * COS30;
    const xg = xh - v * COS30;
    const xd = xg - (w / SIN30) * COS30;
    const xe = xd + w * COS30;
    const xf = xe + v * COS30;

    const x9 = (x0 + xi) / 2;
    const x8 = x9 - v * COS30;
    const xa = x9 + v * COS30;
    const x7 = x9 - w * COS30;
    const xb = x9 + w * COS30;
    const x6 = x7 - v * COS30;
    const xc = xb + v * COS30;

    const y0 = 0;
    const y2 = y0 + v / SIN30;
    const y1 = y2 - v * SIN30;

    const y5 = y2 + w / SIN30;
    const y4 = y5 - w * SIN30;
    const y3 = y4 - v * SIN30;

    const yb = y0 + c * SIN60;
    const ya = yb - v;
    const y9 = ya - v * COS60;
    const y8 = ya - w;
    const y7 = y8 - w * SIN30;
    const y6 = y7 - v * SIN30;

    const normalX = { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi };
    const normalY = { y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb };
    const invertY = {
      y0: yb - yb,
      y1: yb - ya,
      y2: yb - y9,
      y3: yb - y8,
      y4: yb - y7,
      y5: yb - y6,
      y6: yb - y5,
      y7: yb - y4,
      y8: yb - y3,
      y9: yb - y2,
      ya: yb - y1,
      yb: yb - y0,
    };

    if (kind === 0) {
      return { ...normalX, ...normalY };
    }
    return { ...normalX, ...invertY };
  }

  public eraseCell(cell: Cell, color = this.color.void): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x9, xi, y0, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: yb },
              { x: x9, y: y0 },
              { x: xi, y: yb },
            ],
            color,
          );
          break;
        }

        case 1: {
          const { x0, x9, xi, y0, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: xi, y: y0 },
              { x: x9, y: yb },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x2, x9, xg, y2, ya } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: ya },
              { x: xg, y: ya },
              { x: x9, y: y2 },
            ],
            color,
          );
          break;
        }

        case 1: {
          const { x1, x9, xg, y1, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: xg, y: y1 },
              { x: x9, y: y9 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawWall(cell: Cell, direction: Direction, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (direction) {
        case 'a': {
          const { x5, xd, y1, y3 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x5, y: y1 }, { x: xd, y: y3 }, color);
          break;
        }

        case 'b': {
          const { x9, xb, xd, xe, y4, y5, y7, y8 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y5 },
              { x: xb, y: y4 },
              { x: xe, y: y7 },
              { x: xd, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x9, xb, xd, xe, y3, y4, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y6 },
              { x: xb, y: y7 },
              { x: xe, y: y4 },
              { x: xd, y: y3 },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x5, xd, y8, ya } = this.cellOffsets(cell);
          this.drawing.rect({ x: x5, y: y8 }, { x: xd, y: ya }, color);
          break;
        }

        case 'e': {
          const { x4, x5, x7, x9, y3, y4, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y3 },
              { x: x9, y: y6 },
              { x: x7, y: y7 },
              { x: x4, y: y4 },
            ],
            color,
          );
          break;
        }

        case 'f': {
          const { x4, x5, x7, x9, y4, y5, y7, y8 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y8 },
              { x: x9, y: y5 },
              { x: x7, y: y4 },
              { x: x4, y: y7 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawPassage(
    cell: Cell,
    direction: Direction,
    wallColor = this.color.wall,
    cellColor = this.color.cell,
  ): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (direction) {
        case 'a': {
          const { x2, x5, xd, xg, y0, y1 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: y0 }, { x: x5, y: y1 }, wallColor);
          this.drawing.rect({ x: x5, y: y0 }, { x: xd, y: y1 }, cellColor);
          this.drawing.rect({ x: xd, y: y0 }, { x: xg, y: y1 }, wallColor);
          break;
        }

        case 'b': {
          const { x9, xa, xb, xc, xe, xf, xg, xh, y1, y2, y3, y4, y6, y7, y9, ya } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xa, y: y1 },
              { x: xc, y: y3 },
              { x: xb, y: y4 },
              { x: x9, y: y2 },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: xe, y: y7 },
              { x: xf, y: y6 },
              { x: xc, y: y3 },
              { x: xb, y: y4 },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: xf, y: y6 },
              { x: xh, y: y9 },
              { x: xg, y: ya },
              { x: xe, y: y7 },
            ],
            wallColor,
          );
          break;
        }

        case 'c': {
          const { x9, xa, xb, xc, xe, xf, xg, xh, y1, y2, y4, y5, y7, y8, y9, ya } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y9 },
              { x: xb, y: y7 },
              { x: xc, y: y8 },
              { x: xa, y: ya },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: xe, y: y4 },
              { x: xf, y: y5 },
              { x: xc, y: y8 },
              { x: xb, y: y7 },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: xf, y: y5 },
              { x: xh, y: y2 },
              { x: xg, y: y1 },
              { x: xe, y: y4 },
            ],
            wallColor,
          );
          break;
        }

        case 'd': {
          const { x2, x5, xd, xg, ya, yb } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: ya }, { x: x5, y: yb }, wallColor);
          this.drawing.rect({ x: x5, y: ya }, { x: xd, y: yb }, cellColor);
          this.drawing.rect({ x: xd, y: ya }, { x: xg, y: yb }, wallColor);
          break;
        }

        case 'e': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y1, y2, y4, y5, y7, y8, y9, ya } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y2 },
              { x: x2, y: y1 },
              { x: x4, y: y4 },
              { x: x3, y: y5 },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y8 },
              { x: x7, y: y7 },
              { x: x4, y: y4 },
              { x: x3, y: y5 },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y8 },
              { x: x7, y: y7 },
              { x: x9, y: y9 },
              { x: x8, y: ya },
            ],
            wallColor,
          );
          break;
        }

        case 'f': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y1, y2, y3, y4, y6, y7, y9, ya } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y9 },
              { x: x3, y: y6 },
              { x: x4, y: y7 },
              { x: x2, y: ya },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y3 },
              { x: x7, y: y4 },
              { x: x4, y: y7 },
              { x: x3, y: y6 },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y3 },
              { x: x8, y: y1 },
              { x: x9, y: y2 },
              { x: x7, y: y4 },
            ],
            wallColor,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawPillar(cell: Cell, pillar: Pillar, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (pillar) {
        case 'bd': {
          const { xd, xe, xg, y7, y8, ya } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xd, y: y8 },
              { x: xe, y: y7 },
              { x: xg, y: ya },
              { x: xd, y: ya },
            ],
            color,
          );
          break;
        }

        case 'df': {
          const { x2, x4, x5, y7, y8, ya } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: ya },
              { x: x4, y: y7 },
              { x: x5, y: y8 },
              { x: x5, y: ya },
            ],
            color,
          );
          break;
        }

        case 'fb': {
          const { x7, x9, xb, y2, y4, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x7, y: y4 },
              { x: x9, y: y2 },
              { x: xb, y: y4 },
              { x: x9, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'ac': {
          const { xd, xe, xg, y1, y3, y4 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xd, y: y1 },
              { x: xg, y: y1 },
              { x: xe, y: y4 },
              { x: xd, y: y3 },
            ],
            color,
          );
          break;
        }

        case 'ce': {
          const { x7, x9, xb, y6, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x7, y: y7 },
              { x: x9, y: y6 },
              { x: xb, y: y7 },
              { x: x9, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'ea': {
          const { x2, x4, x5, y1, y3, y4 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y1 },
              { x: x5, y: y1 },
              { x: x5, y: y3 },
              { x: x4, y: y4 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = this.color.blocked): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x5, x9, xd, y5, y8 } = this.cellOffsets(cell);
          const yc = (y8 + y5) / 2;
          this.drawing.line({ x: x5, y: y8 }, { x: x9, y: yc }, color);
          this.drawing.line({ x: xd, y: y8 }, { x: x9, y: yc }, color);
          this.drawing.line({ x: x9, y: y5 }, { x: x9, y: yc }, color);
          break;
        }

        case 1:
        default: {
          const { x5, x9, xd, y3, y6 } = this.cellOffsets(cell);
          const yc = (y6 + y3) / 2;
          this.drawing.line({ x: x5, y: y3 }, { x: x9, y: yc }, color);
          this.drawing.line({ x: xd, y: y3 }, { x: x9, y: yc }, color);
          this.drawing.line({ x: x9, y: y6 }, { x: x9, y: yc }, color);
          break;
        }
      }
    }
  }

  protected getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x5, x9, xd, y8 } = this.cellOffsets(cell);
        const side = (xd - x5) / 2;

        return {
          x: x9 - side / 2,
          y: y8 - side,
          width: side,
          height: side,
        };
      }

      case 1:
      default: {
        const { x5, x9, xd, y3 } = this.cellOffsets(cell);
        const side = (xd - x5) / 2;
        return {
          x: x9 - side / 2,
          y: y3,
          width: side,
          height: side,
        };
      }
    }
  }
}
