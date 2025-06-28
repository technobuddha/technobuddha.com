import { largestInscribedRectangle, modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.ts';

import { matrix } from './hexagon-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { Maze } from './maze.ts';

const SIN30 = Math.sin(Math.PI / 6);
const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
const SIN60 = Math.sin(Math.PI / 3);

export type HexagonMazeProperties = MazeProperties;

export class HexagonMaze extends Maze {
  public constructor({
    cellSize = 28,
    wallSize = 2,
    gapSize = 2,
    ...props
  }: HexagonMazeProperties) {
    super({ cellSize, wallSize, gapSize, ...props }, matrix);
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

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(
      cell,
      cell.x * this.cellSize * 0.75,
      cell.y * this.cellSize * SIN60 +
        (this.cellKind(cell) === 0 ? 0 : (this.cellSize * SIN60) / 2),
    );
  }

  protected override offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;

    const x1 = x0 + this.gapSize * TAN30 * SIN30;
    const x2 = x0 + (this.gapSize + this.wallSize) * TAN30 * SIN30;
    const x3 = x0 + this.gapSize / COS30;
    const x4 = x3 + this.wallSize * TAN30 * SIN30;
    const x5 = x3 + this.wallSize / COS30;
    const x9 = x0 + this.cellSize * 0.25;
    const x6 = x9 - (this.gapSize + this.wallSize) * TAN30 * SIN30;
    const x8 = x9 - this.gapSize * TAN30 * SIN30;
    const xa = x9 + (this.gapSize / COS30) * SIN30;
    const xb = x9 + ((this.gapSize + this.wallSize) / COS30) * SIN30;
    const x7 = xa - this.wallSize * TAN30 * SIN30;
    const xm = x0 + this.cellSize;
    const xn = xm - this.gapSize * TAN30 * SIN30;
    const xl = xm - (this.gapSize + this.wallSize) * TAN30 * SIN30;
    const xk = xm - this.gapSize / COS30;
    const xj = xk - this.wallSize * TAN30 * SIN30;
    const xi = xk - this.wallSize / COS30;
    const xg = xm - this.cellSize * 0.25;
    const xh = xg + (this.gapSize + this.wallSize) * TAN30 * SIN30;
    const xe = xg + this.gapSize * TAN30 * SIN30;
    const xd = xg - (this.gapSize / COS30) * SIN30;
    const xc = xg - ((this.gapSize + this.wallSize) / COS30) * SIN30;
    const xf = xd + this.wallSize * TAN30 * SIN30;

    const y0 = 0;
    const y1 = y0 + this.gapSize * TAN30 * COS30;
    const y2 = y0 + this.gapSize;
    const y3 = y0 + (this.gapSize + this.wallSize) * TAN30 * COS30;

    const y5 = y0 + this.gapSize + this.wallSize;
    const y4 = y5 - this.wallSize * SIN30;

    const y9 = y0 + this.cellSize * SIN60 * 0.5;
    const y8 = y9 - this.gapSize * TAN30 * COS30;
    const y6 = y9 - (this.gapSize + this.wallSize) * TAN30 * COS30;
    const y7 = y9 - this.wallSize * TAN30 * COS30;

    const ya = y9 + this.gapSize * TAN30 * COS30;
    const yb = y9 + this.wallSize * TAN30 * COS30;
    const yi = y0 + this.cellSize * SIN60;
    const yh = yi - this.gapSize * TAN30 * COS30;
    const yg = yi - this.gapSize;
    const yf = yi - (this.gapSize + this.wallSize) * TAN30 * COS30;
    const yd = yi - (this.gapSize + this.wallSize);
    const ye = yd + this.wallSize * SIN30;
    const yc = y9 + (this.gapSize + this.wallSize) * TAN30 * COS30;

    // prettier-ignore
    return {
      x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi, xj, xk, xl, xn, xm,
      y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yg, yh, yi,
    };
  }

  public override drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x2, xa, x9, xd, xe, xl, xm, y0, y2, y9, yh, yi } = this.cellOffsets(cell);

      // First draw the complete hexagon including gaps (background)
      // Use the outer gap coordinates: x0, x9, xe, xm, y0, y9, yi
      this.drawing.polygon(
        [
          { x: x9, y: y0 }, // Top-left outer edge (including gap)
          { x: xe, y: y0 }, // Top-right outer edge (including gap)
          { x: xm, y: y9 }, // Right outer edge (including gap)
          { x: xe, y: yi }, // Bottom-right outer edge (including gap)
          { x: x9, y: yi }, // Bottom-left outer edge (including gap)
          { x: x0, y: y9 }, // Left outer edge (including gap)
        ],
        this.backgroundColor,
      );

      // Then draw the hexagon without gaps (walls + interior)
      // Use coordinates that exclude the gap areas
      this.drawing.polygon(
        [
          { x: xa, y: y2 }, // Top-left edge (excluding gap)
          { x: xd, y: y2 }, // Top-right edge (excluding gap)
          { x: xl, y: y9 }, // Right edge (excluding gap)
          { x: xd, y: yh }, // Bottom-right edge (excluding gap)
          { x: xa, y: yh }, // Bottom-left edge (excluding gap)
          { x: x2, y: y9 }, // Left edge (excluding gap)
        ],
        color,
      );
    }
  }

  public override drawWall(cell: CellDirection, color = this.wallColor): void {
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

  public override drawDoor(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { xa, xb, xc, xd, y0, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xa, y: y0 }, { x: xb, y: y2 }, color);
          this.drawing.rect({ x: xc, y: y0 }, { x: xd, y: y2 }, color);
          break;
        }
        case 'b': {
          const { xd, xf, xe, xh, xl, xn, xj, xk, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xe, y: y1 },
              { x: xh, y: y3 },
              { x: xf, y: y4 },
              { x: xd, y: y2 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xl, y: y6 },
              { x: xn, y: y8 },
              { x: xk, y: y9 },
              { x: xj, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          const { xf, xd, xe, xh, xj, xk, xl, xn, y9, ya, yb, yc, ye, yf, yg, yh } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xk, y: y9 },
              { x: xn, y: ya },
              { x: xl, y: yc },
              { x: xj, y: yb },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xf, y: ye },
              { x: xh, y: yf },
              { x: xe, y: yh },
              { x: xd, y: yg },
            ],
            color,
          );
          break;
        }
        case 'd': {
          const { xa, xb, xc, xd, yg, yi } = this.cellOffsets(cell);
          this.drawing.rect({ x: xa, y: yg }, { x: xb, y: yi }, color);
          this.drawing.rect({ x: xc, y: yg }, { x: xd, y: yi }, color);
          break;
        }
        case 'e': {
          const { x1, x2, x3, x4, x6, x8, x7, xa, ya, y9, yb, yc, ye, yf, yg, yh } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y9 },
              { x: x4, y: yb },
              { x: x2, y: yc },
              { x: x1, y: ya },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x7, y: ye },
              { x: x6, y: yf },
              { x: x8, y: yh },
              { x: xa, y: yg },
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

  public override drawBridge(cell: CellDirection, _color = this.wallColor): void {
    if (this.drawing) {
      super.drawBridge(cell, this.wallColor);
      this.drawDoor(cell, this.wallColor);
    }
  }

  public override drawTunnel(cell: CellDirection, color = this.wallColor): void {
    this.drawDoor(cell, color);
  }

  public override drawPillar(cell: Cell, pillar: Pillar, color = this.wallColor): void {
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
          const { xc, xd, xf, yd, ye, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xc, y: yd },
              { x: xf, y: ye },
              { x: xd, y: yg },
              { x: xc, y: yg },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x9, xa, xb, yd, ye, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: yd },
              { x: xb, y: yg },
              { x: xa, y: yg },
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

  public override drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      const { x5, xb, xc, xi, y5, y9, yd } = this.cellOffsets(cell);
      this.drawing.line({ x: xb, y: y5 }, { x: xc, y: yd }, color);
      this.drawing.line({ x: x5, y: y9 }, { x: xi, y: y9 }, color);
      this.drawing.line({ x: xc, y: y5 }, { x: xb, y: yd }, color);
    }
  }

  public override getRect(cell: Cell): Rect {
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
