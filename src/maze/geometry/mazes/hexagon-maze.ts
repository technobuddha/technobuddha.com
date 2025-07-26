import {
  type Cartesian,
  largestInscribedRectangle,
  modulo,
  type Rect,
} from '@technobuddha/library';

import { type Cell, type Direction, type Kind, type Pillar } from '../geometry.ts';
import { type DrawingSizes, Maze, type MazeProperties } from '../maze.ts';

import { matrix } from './hexagon-matrix.ts';

const SIN30 = Math.sin(Math.PI / 6);
const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
// const COT30 = 1 / TAN30;
const SEC30 = 1 / COS30;
// const CSC30 = 1 / SIN30;
const SIN60 = Math.sin(Math.PI / 3);
// const COS60 = Math.cos(Math.PI / 3);
// const TAN60 = Math.tan(Math.PI / 3);
// const COT60 = 1 / TAN60;
// const SEC60 = 1 / COS60;
// const CSC60 = 1 / SIN60;

export type HexagonMazeProperties = MazeProperties;

export class HexagonMaze extends Maze {
  public constructor({
    cellSize = 36,
    wallSize = 2,
    voidSize = 1,
    ...props
  }: HexagonMazeProperties) {
    super({ cellSize, wallSize, voidSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 1.5,
      horizontalCellsPerGroup: 2,
      groupHeight: this.cellSize * SIN60,
      rightPadding: this.cellSize * 0.25,
      bottomPadding: (this.cellSize * SIN60) / 2,
    };
  }

  public cellKind(cell: Cell): number {
    return modulo(cell.x, 2);
  }

  protected cellOrigin(cell: Cell): Cartesian {
    return {
      x: cell.x * this.cellSize * 0.75,
      y:
        cell.y * this.cellSize * SIN60 +
        (this.cellKind(cell) === 0 ? 0 : (this.cellSize * SIN60) / 2),
    };
  }

  protected override offsets(_kind: Kind): Record<string, number> {
    const v = this.voidSize;
    const w = this.wallSize;
    const c = this.cellSize;
    const s = c / 2;

    const x0 = 0;
    const x2 = x0 + v * SEC30;
    const x1 = x2 - v * COS30;
    const x5 = x2 + w * SEC30;
    const x4 = x5 - w * COS30;
    const x3 = x4 - v * COS30;

    const x9 = x0 + s * SIN30;
    const xa = x9 + v * TAN30;
    const xb = xa + w * TAN30;
    const x8 = xa - v * COS30;
    const x7 = xb - w * COS30;
    const x6 = x7 - v * COS30;

    const xn = x0 + c;
    const xl = xn - v * SEC30;
    const xm = xl + v * COS30;
    const xi = xl - w * SEC30;
    const xj = xi + w * COS30;
    const xk = xj + v * COS30;

    const xe = x0 + s + s * SIN30;
    const xd = xe - v * TAN30;
    const xc = xd - w * TAN30;
    const xf = xd + v * COS30;
    const xg = xc + w * COS30;
    const xh = xg + v * COS30;

    const y0 = 0;
    const y2 = y0 + v;
    const y1 = y2 - v * SIN30;
    const y5 = y2 + w;
    const y4 = y5 - w * SIN30;
    const y3 = y4 - v * SIN30;

    const y9 = y0 + s * SIN60;
    const y8 = y9 - v * SIN30;
    const y7 = y9 - w * SIN30;
    const y6 = y7 - v * SIN30;
    const ya = y9 + v * SIN30;
    const yb = y9 + w * SIN30;
    const yc = yb + v * SIN30;

    const yi = y0 + s * SIN60 * 2;
    const yg = yi - v;
    const yh = yi - v * SIN30;
    const yd = yg - w;
    const ye = yd + w * SIN30;
    const yf = ye + v * SIN30;

    // prettier-ignore
    return {
      x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi, xj, xk, xl, xn, xm,
      y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yh, yg, yi,
    };
  }

  public eraseCell(cell: Cell, color = this.color.void): void {
    if (this.drawing) {
      const { x0, x9, xe, xn, y0, y9, yi } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x9, y: y0 },
          { x: xe, y: y0 },
          { x: xn, y: y9 },
          { x: xe, y: yi },
          { x: x9, y: yi },
          { x: x0, y: y9 },
        ],
        color,
      );
    }
  }

  public drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      const { x2, xa, xd, xl, y2, y9, yg } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: xa, y: y2 },
          { x: xd, y: y2 },
          { x: xl, y: y9 },
          { x: xd, y: yg },
          { x: xa, y: yg },
          { x: x2, y: y9 },
        ],
        color,
      );
    }
  }

  public drawWall(cell: Cell, direction: Direction, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (direction) {
        case 'a': {
          const { xb, xc, y2, y5 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: y2 }, { x: xc, y: y5 }, color);
          break;
        }

        case 'b': {
          const { xc, xg, xi, xj, y4, y5, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xg, y: y4 },
              { x: xc, y: y5 },
              { x: xi, y: y9 },
              { x: xj, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          const { xc, xg, xi, xj, y9, yb, ye, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xi, y: y9 },
              { x: xj, y: yb },
              { x: xg, y: ye },
              { x: xc, y: yd },
            ],
            color,
          );
          break;
        }
        case 'd': {
          const { xb, xc, yd, yg } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: yd }, { x: xc, y: yg }, color);
          break;
        }
        case 'e': {
          const { x4, x5, x7, xb, y9, yb, ye, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x4, y: yb },
              { x: x5, y: y9 },
              { x: xb, y: yd },
              { x: x7, y: ye },
            ],
            color,
          );
          break;
        }

        case 'f': {
          const { x4, x5, x7, xb, y4, y5, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x7, y: y4 },
              { x: xb, y: y5 },
              { x: x5, y: y9 },
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
          const { xa, xb, xc, xd, y0, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xa, y: y0 }, { x: xb, y: y2 }, wallColor);
          this.drawing.rect({ x: xb, y: y0 }, { x: xc, y: y2 }, cellColor);
          this.drawing.rect({ x: xc, y: y0 }, { x: xd, y: y2 }, wallColor);
          break;
        }
        case 'b': {
          const { xd, xf, xg, xh, xl, xm, xj, xk, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xf, y: y1 },
              { x: xh, y: y3 },
              { x: xg, y: y4 },
              { x: xd, y: y2 },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: xh, y: y3 },
              { x: xk, y: y6 },
              { x: xj, y: y7 },
              { x: xg, y: y4 },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: xk, y: y6 },
              { x: xm, y: y8 },
              { x: xl, y: y9 },
              { x: xj, y: y7 },
            ],
            wallColor,
          );
          break;
        }
        case 'c': {
          const { xg, xd, xf, xh, xi, xj, xk, xl, xm, y9, ya, yb, yc, ye, yf, yh, yg } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xl, y: y9 },
              { x: xm, y: ya },
              { x: xk, y: yc },
              { x: xj, y: yb },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: xk, y: yc },
              { x: xh, y: yf },
              { x: xg, y: ye },
              { x: xi, y: yb },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: xg, y: ye },
              { x: xh, y: yf },
              { x: xf, y: yh },
              { x: xd, y: yg },
            ],
            wallColor,
          );
          break;
        }
        case 'd': {
          const { xa, xb, xc, xd, yg, yi } = this.cellOffsets(cell);
          this.drawing.rect({ x: xa, y: yg }, { x: xb, y: yi }, wallColor);
          this.drawing.rect({ x: xb, y: yg }, { x: xc, y: yi }, cellColor);
          this.drawing.rect({ x: xc, y: yg }, { x: xd, y: yi }, wallColor);
          break;
        }
        case 'e': {
          const { x1, x2, x3, x4, x6, x8, x7, xa, ya, y9, yb, yc, ye, yf, yh, yg } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y9 },
              { x: x4, y: yb },
              { x: x3, y: yc },
              { x: x1, y: ya },
            ],
            wallColor,
          );
          this.drawing.polygon(
            [
              { x: x4, y: yb },
              { x: x7, y: ye },
              { x: x6, y: yf },
              { x: x3, y: yc },
            ],
            cellColor,
          );
          this.drawing.polygon(
            [
              { x: x7, y: ye },
              { x: x6, y: yf },
              { x: x8, y: yh },
              { x: xa, y: yg },
            ],
            wallColor,
          );
          break;
        }
        case 'f': {
          const { x1, x2, x3, x4, x6, x8, x7, xa, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x8, y: y1 },
              { x: xa, y: y2 },
              { x: x7, y: y4 },
              { x: x6, y: y3 },
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
              { x: x3, y: y6 },
              { x: x4, y: y7 },
              { x: x2, y: y9 },
              { x: x1, y: y8 },
            ],
            wallColor,
          );
          break;
        }
        // no default
      }
    }
  }

  public override drawPillar(cell: Cell, pillar: Pillar, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (pillar) {
        case 'ab': {
          const { xc, xd, xg, y2, y4, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xc, y: y2 },
              { x: xd, y: y2 },
              { x: xg, y: y4 },
              { x: xc, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'bc': {
          const { xi, xj, xl, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xi, y: y9 },
              { x: xj, y: y7 },
              { x: xl, y: y9 },
              { x: xj, y: yb },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { xc, xd, xg, yd, ye, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xc, y: yd },
              { x: xg, y: ye },
              { x: xd, y: yg },
              { x: xc, y: yg },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x7, xa, xb, yd, ye, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: yd },
              { x: xb, y: yg },
              { x: xa, y: yg },
              { x: x7, y: ye },
            ],
            color,
          );
          break;
        }

        case 'ef': {
          const { x2, x4, x5, yb, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y9 },
              { x: x4, y: yb },
              { x: x2, y: y9 },
              { x: x4, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'fa': {
          const { x7, xa, xb, y2, y4, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: y2 },
              { x: xa, y: y2 },
              { x: x7, y: y4 },
              { x: xb, y: y5 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public override drawX(cell: Cell, color = this.color.blocked): void {
    if (this.drawing) {
      const { x5, xb, xc, xi, y5, y9, yd } = this.cellOffsets(cell);
      this.drawing.line({ x: xb, y: y5 }, { x: xc, y: yd }, color);
      this.drawing.line({ x: x5, y: y9 }, { x: xi, y: y9 }, color);
      this.drawing.line({ x: xc, y: y5 }, { x: xb, y: yd }, color);
    }
  }

  protected getRect(cell: Cell): Rect {
    // Use the larger hexagon coordinates that include wall areas
    // Based on the drawFloor method coordinates for maximum usable space
    const { x0, x9, xg, xm, y0, y9, yi } = this.cellOffsets(cell);

    // Create the full hexagon polygon using the same coordinates as drawFloor
    // This includes the wall areas for a larger rectangle
    const polygon = [
      { x: x9, y: y0 }, // Top-left edge
      { x: xg, y: y0 }, // Top-right edge
      { x: xm, y: y9 }, // Right edge
      { x: xg, y: yi }, // Bottom-right edge
      { x: x9, y: yi }, // Bottom-left edge
      { x: x0, y: y9 }, // Left edge
    ];

    // Use largestInscribedRectangle to find the optimal rectangle within the full hexagon
    return largestInscribedRectangle(polygon);
  }
}
