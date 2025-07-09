import {
  type Cartesian,
  largestInscribedRectangle,
  modulo,
  type Rect,
} from '@technobuddha/library';

import { matrix } from './hexagon-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  Maze,
  type MazeProperties,
  type Pillar,
} from './maze.ts';

const SIN30 = Math.sin(Math.PI / 6);
const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
const SIN60 = Math.sin(Math.PI / 3);

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
    const x0 = 0;

    const x1 = x0 + this.voidSize * TAN30 * SIN30;
    const x2 = x0 + (this.voidSize + this.wallSize) * TAN30 * SIN30;
    const x3 = x0 + this.voidSize / COS30;
    const x4 = x3 + this.wallSize * TAN30 * SIN30;
    const x5 = x3 + this.wallSize / COS30;
    const x9 = x0 + this.cellSize * 0.25;
    const x6 = x9 - (this.voidSize + this.wallSize) * TAN30 * SIN30;
    const x8 = x9 - this.voidSize * TAN30 * SIN30;
    const xa = x9 + (this.voidSize / COS30) * SIN30;
    const xb = x9 + ((this.voidSize + this.wallSize) / COS30) * SIN30;
    const x7 = xa - this.wallSize * TAN30 * SIN30;
    const xm = x0 + this.cellSize;
    const xn = xm - this.voidSize * TAN30 * SIN30;
    const xl = xm - (this.voidSize + this.wallSize) * TAN30 * SIN30;
    const xk = xm - this.voidSize / COS30;
    const xj = xk - this.wallSize * TAN30 * SIN30;
    const xi = xk - this.wallSize / COS30;
    const xg = xm - this.cellSize * 0.25;
    const xh = xg + (this.voidSize + this.wallSize) * TAN30 * SIN30;
    const xe = xg + this.voidSize * TAN30 * SIN30;
    const xd = xg - (this.voidSize / COS30) * SIN30;
    const xc = xg - ((this.voidSize + this.wallSize) / COS30) * SIN30;
    const xf = xd + this.wallSize * TAN30 * SIN30;

    const y0 = 0;
    const y1 = y0 + this.voidSize * TAN30 * COS30;
    const y2 = y0 + this.voidSize;
    const y3 = y0 + (this.voidSize + this.wallSize) * TAN30 * COS30;

    const y5 = y0 + this.voidSize + this.wallSize;
    const y4 = y5 - this.wallSize * SIN30;

    const y9 = y0 + this.cellSize * SIN60 * 0.5;
    const y8 = y9 - this.voidSize * TAN30 * COS30;
    const y6 = y9 - (this.voidSize + this.wallSize) * TAN30 * COS30;
    const y7 = y9 - this.wallSize * TAN30 * COS30;

    const ya = y9 + this.voidSize * TAN30 * COS30;
    const yb = y9 + this.wallSize * TAN30 * COS30;
    const yc = y9 + (this.voidSize + this.wallSize) * TAN30 * COS30;

    const yi = y0 + this.cellSize * SIN60;
    const yh = yi - this.voidSize * TAN30 * COS30;
    const yg = yi - this.voidSize;
    const yf = yh - this.wallSize * TAN30 * COS30;
    const yd = yg - this.wallSize;
    const ye = yd + this.wallSize * SIN30;

    // prettier-ignore
    return {
      x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi, xj, xk, xl, xn, xm,
      y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yh, yg, yi,
    };
  }

  public override drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      const { x0, x2, xa, x9, xd, xe, xl, xm, y0, y2, y9, yg, yi } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x9, y: y0 },
          { x: xe, y: y0 },
          { x: xm, y: y9 },
          { x: xe, y: yi },
          { x: x9, y: yi },
          { x: x0, y: y9 },
        ],
        this.color.background,
      );

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

  public override drawWall(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { xb, xc, y2, y5 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: y2 }, { x: xc, y: y5 }, color);
          break;
        }

        case 'b': {
          const { xc, xf, xi, xj, y4, y5, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xf, y: y4 },
              { x: xc, y: y5 },
              { x: xi, y: y9 },
              { x: xj, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          const { xc, xf, xi, xj, y9, yb, ye, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xi, y: y9 },
              { x: xj, y: yb },
              { x: xf, y: ye },
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

  public override drawDoor(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { xa, xb, xc, xd, y0, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xa, y: y0 }, { x: xb, y: y2 }, color);
          this.drawing.rect({ x: xb, y: y0 }, { x: xc, y: y2 }, this.color.cell);
          this.drawing.rect({ x: xc, y: y0 }, { x: xd, y: y2 }, color);
          break;
        }
        case 'b': {
          const { xd, xf, xg, xh, xl, xn, xj, xk, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xf, y: y1 },
              { x: xh, y: y3 },
              { x: xg, y: y4 },
              { x: xd, y: y2 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xh, y: y3 },
              { x: xl, y: y6 },
              { x: xj, y: y7 },
              { x: xg, y: y4 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xk, y: y6 },
              { x: xn, y: y8 },
              { x: xl, y: y9 },
              { x: xj, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          const { xg, xd, xf, xh, xj, xk, xn, y9, ya, yb, yc, ye, yf, yh, yg } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xk, y: y9 },
              { x: xn, y: ya },
              { x: xk, y: yc },
              { x: xj, y: yb },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xk, y: yc },
              { x: xh, y: yf },
              { x: xg, y: ye },
              { x: xj, y: yb },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xg, y: ye },
              { x: xh, y: yf },
              { x: xf, y: yh },
              { x: xd, y: yg },
            ],
            color,
          );
          break;
        }
        case 'd': {
          const { xa, xb, xc, xd, yg, yi } = this.cellOffsets(cell);
          this.drawing.rect({ x: xa, y: yg }, { x: xb, y: yi }, color);
          this.drawing.rect({ x: xb, y: yg }, { x: xc, y: yi }, this.color.cell);
          this.drawing.rect({ x: xc, y: yg }, { x: xd, y: yi }, color);
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
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: yb },
              { x: x7, y: ye },
              { x: x6, y: yh },
              { x: x3, y: yc },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x7, y: ye },
              { x: x6, y: yf },
              { x: x8, y: yg },
              { x: xa, y: yh },
            ],
            color,
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
            color,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y3 },
              { x: x7, y: y4 },
              { x: x3, y: y9 },
              { x: x6, y: y3 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x2, y: y6 },
              { x: x4, y: y7 },
              { x: x3, y: y9 },
              { x: x1, y: y8 },
            ],
            color,
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
          const { xc, xd, xf, y2, y4, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xc, y: y2 },
              { x: xd, y: y2 },
              { x: xf, y: y4 },
              { x: xc, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'bc': {
          const { xi, xj, xk, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xi, y: y9 },
              { x: xj, y: y7 },
              { x: xk, y: y9 },
              { x: xj, y: yb },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { xc, xd, xf, yd, ye, yh } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xc, y: yd },
              { x: xf, y: ye },
              { x: xd, y: yh },
              { x: xc, y: yh },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x9, xa, xb, yd, ye, yh } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: yd },
              { x: xb, y: yh },
              { x: xa, y: yh },
              { x: x9, y: ye },
            ],
            color,
          );
          break;
        }

        case 'ef': {
          const { x3, x4, x5, yb, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y9 },
              { x: x4, y: yb },
              { x: x3, y: y9 },
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
