import { type Cartesian, modulo, type Rect, toRadians } from '@technobuddha/library';

import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { Maze } from './maze.ts';
import { kindMatrix, matrix, offsetXMatrix, offsetYMatrix } from './pentagon-matrix.ts';

export type PentagonMazeProperties = MazeProperties;

export class PentagonMaze extends Maze {
  public constructor({ cellSize = 28, wallSize = 2, ...props }: PentagonMazeProperties) {
    super({ cellSize, wallSize, voidSize: 1, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 5,
      horizontalCellsPerGroup: 4,
      groupHeight: this.cellSize * 5,
      verticalCellsPerGroup: 5,
      topPadding: this.cellSize * 0.5,
      bottomPadding: this.cellSize * 0.5,
      leftPadding: this.cellSize * 0.5,
      rightPadding: this.cellSize * 0.5,
    };
  }

  public cellKind(cell: Cell): number {
    return kindMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)];
  }

  public cellOrigin(cell: Cell): Cartesian {
    const x = offsetXMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)] * this.cellSize;
    const y = offsetYMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)] * this.cellSize;

    return {
      x: x + Math.floor(cell.x / 4) * this.cellSize * 5,
      y: y + Math.floor(cell.y / 5) * this.cellSize * 5,
    };
  }

  protected offsets(kind: Kind): Record<string, number> {
    const c = this.cellSize;
    const v = this.voidSize;
    const w = this.wallSize;

    const { SQRT1_2 } = Math;
    const COT225 = Math.sin(toRadians(22.5)) / Math.cos(toRadians(22.5));

    const x0 = 0;
    const x1 = x0 + v;

    const x5 = x1 + w;
    const x6 = x5 + w * SQRT1_2;
    const x4 = x5 - v * SQRT1_2;
    const x3 = x5 - w * SQRT1_2;
    const x2 = x3 - v * SQRT1_2;

    const xa = x0 + c * 0.5;
    const x9 = xa - v * SQRT1_2;
    const xb = xa + v * SQRT1_2;
    const x8 = xa - w * SQRT1_2;
    const xc = xa + w * SQRT1_2;
    const xd = xc + v * SQRT1_2;
    const x7 = x8 - v * SQRT1_2;

    const xk = x0 + c;
    const xj = xk - v;

    const xf = xj - w;
    const xg = xf + v * SQRT1_2;
    const xh = xf + w * SQRT1_2;
    const xe = xf - w * SQRT1_2;
    const xi = xh + v * SQRT1_2;

    const y0 = 0;
    const y1 = y0 + v;
    const y2 = y1 + w;

    const y7 = y0 + c;
    const y5 = y7 - v;
    const y3 = y5 - w;

    const yh = y0 + c * 1.5;

    const y6 = y7 - v * COT225;
    const y4 = y6 - w * COT225;
    const y8 = y4 + w * SQRT1_2;
    const y9 = y8 + v * SQRT1_2;
    const ya = y8 + w * SQRT1_2;
    const yb = y9 + w * SQRT1_2;
    const yg = yh - v * SQRT1_2;
    const yf = yg - v * SQRT1_2;
    const ye = yg - w * SQRT1_2;
    const yd = yf - w * SQRT1_2;
    const yc = yd - w * SQRT1_2;

    switch (kind) {
      case 0: {
        // prettier-ignore
        return {
          x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi, xj, xk,
          y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yg, yh
        };
      }

      case 1: {
        // prettier-ignore
        return {
          x0: y0, x1: y1, x2: y2, x3: y3, x4: y4, x5: y5, x6: y6, x7: y7, x8: y8, x9: y9, xa: ya,
          xb: yb, xc: yc, xd: yd, xe: ye, xf: yf, xg: yg, xh: yh,
          y0: xk-xk, y1: xk-xj, y2: xk-xi, y3: xk-xh, y4: xk-xg, y5: xk-xf, y6: xk-xe, y7: xk-xd,
          y8: xk-xc, y9: xk-xb, ya: xk-xa, yb: xk-x9, yc: xk-x8, yd: xk-x7, ye: xk-x6, yf: xk-x5,
          yg: xk-x4, yh: xk-x3, yi: xk-x2, yj: xk-x1, yk: xk-x0,
        };
      }

      case 2: {
        // prettier-ignore
        return {
          x0: yh-yh, x1: yh-yg, x2: yh-yf, x3: yh-ye, x4: yh-yd, x5: yh-yc, x6: yh-yb, x7: yh-ya,
          x8: yh-y9, x9: yh-y8, xa: yh-y7, xb: yh-y6, xc: yh-y5, xd: yh-y4, xe: yh-y3, xf: yh-y2,
          xg: yh-y1, xh: yh-y0,
          y0: x0, y1: x1, y2: x2, y3: x3, y4: x4, y5: x5, y6: x6, y7: x7, y8: x8, y9: x9, ya: xa,
          yb: xb, yc: xc, yd: xd, ye: xe, yf: xf, yg: xg, yh: xh, yi: xi, yj: xj, yk: xk
        };
      }

      case 3: {
        // prettier-ignore
        return {
          x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi, xj, xk,
          y0: yh-yh, y1: yh-yg, y2: yh-yf, y3: yh-ye, y4: yh-yd, y5: yh-yc, y6: yh-yb, y7: yh-ya,
          y8: yh-y9, y9: yh-y8, ya: yh-y7, yb: yh-y6, yc: yh-y5, yd: yh-y4, ye: yh-y3, yf: yh-y2,
          yg: yh-y1, yh: yh-y0,
        };
      }

      // no default
    }

    return {};
  }

  public drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x1, xa, xj, xk, y0, y1, y6, y7, yf, yh } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: xk, y: y0 },
              { x: xk, y: y7 },
              { x: xa, y: yh },
              { x: x0, y: y7 },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: xj, y: y1 },
              { x: xj, y: y6 },
              { x: xa, y: yf },
              { x: x1, y: y6 },
            ],
            color,
          );

          break;
        }

        case 1: {
          const { x0, x1, x6, x7, xf, xh, y0, y1, ya, yj, yk } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x7, y: y0 },
              { x: xh, y: ya },
              { x: x7, y: yk },
              { x: x0, y: yk },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: x6, y: y1 },
              { x: xf, y: ya },
              { x: x6, y: yj },
              { x: x1, y: yj },
            ],
            color,
          );

          break;
        }

        case 2: {
          const { x0, x2, xa, xb, xg, xh, y0, y1, ya, yj, yk } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xa, y: y0 },
              { x: xh, y: y0 },
              { x: xh, y: yk },
              { x: xa, y: yk },
              { x: x0, y: ya },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: xb, y: y1 },
              { x: xg, y: y1 },
              { x: xg, y: yj },
              { x: xb, y: yj },
              { x: x2, y: ya },
            ],
            color,
          );
          break;
        }

        case 3: {
          const { x0, x1, xa, xk, xj, y0, y2, yb, ya, yg, yh } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: ya },
              { x: xa, y: y0 },
              { x: xk, y: ya },
              { x: xk, y: yh },
              { x: x0, y: yh },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: yb },
              { x: xa, y: y2 },
              { x: xj, y: yb },
              { x: xj, y: yg },
              { x: x1, y: yg },
            ],
            color,
          );

          break;
        }

        // no default
      }
    }
  }

  public drawWall(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      // Kind 0

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { x5, xf, y1, y2 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x5, y: y1 }, { x: xf, y: y2 }, color);
          break;
        }

        case 'b': {
          const { xf, xj, y2, y3 } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: y2 }, { x: xj, y: y3 }, color);
          break;
        }

        case 'c': {
          const { xa, xc, xe, xf, y8, ya, yc, yd } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xa, y: yc },
              { x: xe, y: y8 },
              { x: xf, y: ya },
              { x: xc, y: yd },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x5, x6, x8, xa, y8, ya, yc, yd } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x6, y: y8 },
              { x: xa, y: yc },
              { x: x8, y: yd },
              { x: x5, y: ya },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { x1, x5, y2, y3 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: y2 }, { x: x5, y: y3 }, color);
          break;
        }

        // Kind 1

        case 'f': {
          const { x2, x3, y1, y5 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x2, y: y1 }, { x: x3, y: y5 }, color);
          break;
        }

        case 'g': {
          const { x8, xa, xc, xd, y5, y6, y8, ya } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xa, y: y5 },
              { x: xd, y: y8 },
              { x: xc, y: ya },
              { x: x8, y: y6 },
            ],
            color,
          );
          break;
        }

        case 'h': {
          const { x8, xa, xc, xd, ya, yc, ye, yf } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xc, y: ya },
              { x: xd, y: yc },
              { x: xa, y: yf },
              { x: x8, y: ye },
            ],
            color,
          );
          break;
        }

        case 'i': {
          const { x2, x3, yf, yj } = this.cellOffsets(cell);

          this.drawing.rect({ x: x2, y: yf }, { x: x3, y: yj }, color);
          break;
        }

        case 'j': {
          const { x1, x2, y5, yf } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: y5 }, { x: x2, y: yf }, color);
          break;
        }

        // Kind 2

        case 'k': {
          const { xe, xf, y1, y5 } = this.cellOffsets(cell);

          this.drawing.rect({ x: xe, y: y1 }, { x: xf, y: y5 }, color);
          break;
        }

        case 'l': {
          const { xf, xg, y5, yf } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: y5 }, { x: xg, y: yf }, color);
          break;
        }

        case 'm': {
          const { xe, xf, yf, yj } = this.cellOffsets(cell);

          this.drawing.rect({ x: xe, y: yf }, { x: xf, y: yj }, color);
          break;
        }

        case 'n': {
          const { x4, x5, x7, x9, ya, yc, ye, yf } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x5, y: ya },
              { x: x9, y: ye },
              { x: x7, y: yf },
              { x: x4, y: yc },
            ],
            color,
          );
          break;
        }

        case 'o': {
          const { x4, x5, x7, x9, y5, y6, y8, ya } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x5, y: ya },
              { x: x9, y: y6 },
              { x: x7, y: y5 },
              { x: x4, y: y8 },
            ],
            color,
          );
          break;
        }

        // Kind 3

        case 'p': {
          const { x5, x6, x8, xa, y4, y5, y7, y9 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x5, y: y7 },
              { x: x8, y: y4 },
              { x: xa, y: y5 },
              { x: x6, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'q': {
          const { xa, xc, xe, xf, y4, y5, y7, y9 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xa, y: y5 },
              { x: xc, y: y4 },
              { x: xf, y: y7 },
              { x: xe, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'r': {
          const { xf, xj, ye, yf } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: ye }, { x: xj, y: yf }, color);
          break;
        }

        case 's': {
          const { x5, xf, yf, yg } = this.cellOffsets(cell);

          this.drawing.rect({ x: x5, y: yf }, { x: xf, y: yg }, color);
          break;
        }

        case 't': {
          const { x1, x5, ye, yf } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: ye }, { x: x5, y: yf }, color);
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
        // Kind 0

        case 'ab': {
          const { xf, xj, y1, y2 } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: y1 }, { x: xj, y: y2 }, color);

          break;
        }

        case 'bc': {
          const { xe, xf, xj, y3, y4, y6, y8, ya } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xf, y: y3 },
              { x: xj, y: y3 },
              { x: xj, y: y6 },
              { x: xf, y: ya },
              { x: xe, y: y8 },
              { x: xf, y: y4 },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { x8, xa, xc, yc, yd, yf } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xa, y: yc },
              { x: xc, y: yd },
              { x: xa, y: yf },
              { x: x8, y: yd },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x1, x5, x6, y3, y4, y6, y8, ya } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x1, y: y3 },
              { x: x5, y: y3 },
              { x: x5, y: y4 },
              { x: x6, y: y8 },
              { x: x5, y: ya },
              { x: x1, y: y6 },
            ],
            color,
          );
          break;
        }

        case 'ea': {
          const { x1, x5, y1, y2 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: y1 }, { x: x5, y: y2 }, color);

          break;
        }

        // Kind 1

        case 'fg': {
          const { x3, x4, x6, x8, xa, y1, y5, y6 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x3, y: y1 },
              { x: x6, y: y1 },
              { x: xa, y: y5 },
              { x: x8, y: y6 },
              { x: x4, y: y5 },
              { x: x3, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'gh': {
          const { xc, xd, xf, y8, ya, yc } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xd, y: y8 },
              { x: xf, y: ya },
              { x: xd, y: yc },
              { x: xc, y: ya },
            ],
            color,
          );

          break;
        }

        case 'hi': {
          const { x3, x4, x6, x8, xa, ye, yf, yj } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x3, y: yf },
              { x: x4, y: yf },
              { x: x8, y: ye },
              { x: xa, y: yf },
              { x: x6, y: yj },
              { x: x3, y: yj },
            ],
            color,
          );
          break;
        }

        case 'ij': {
          const { x1, x2, yf, yj } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: yf }, { x: x2, y: yj }, color);

          break;
        }

        case 'jf': {
          const { x1, x2, y1, y5 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: y1 }, { x: x2, y: y5 }, color);

          break;
        }

        // Kind 2

        case 'kl': {
          const { xf, xg, y1, y5 } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: y1 }, { x: xg, y: y5 }, color);

          break;
        }

        case 'lm': {
          const { xf, xg, yf, yj } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: yf }, { x: xg, y: yj }, color);

          break;
        }

        case 'mn': {
          const { x7, x9, xb, xd, xe, ye, yf, yj } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x9, y: ye },
              { x: xd, y: yf },
              { x: xe, y: yf },
              { x: xe, y: yj },
              { x: xb, y: yj },
              { x: x7, y: yf },
            ],
            color,
          );
          break;
        }

        case 'no': {
          const { x2, x4, x5, y8, ya, yc } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x4, y: y8 },
              { x: x5, y: ya },
              { x: x4, y: yc },
              { x: x2, y: ya },
            ],
            color,
          );

          break;
        }

        case 'ok': {
          const { x7, x9, xb, xd, xe, y1, y5, y6 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xb, y: y1 },
              { x: xe, y: y1 },
              { x: xe, y: y5 },
              { x: xd, y: y5 },
              { x: x9, y: y6 },
              { x: x7, y: y5 },
            ],
            color,
          );
          break;
        }

        // Kind 3

        case 'pq': {
          const { x8, xa, xc, y2, y4, y5 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x8, y: y4 },
              { x: xa, y: y2 },
              { x: xc, y: y4 },
              { x: xa, y: y5 },
            ],
            color,
          );

          break;
        }

        case 'qr': {
          const { xe, xf, xj, y7, y9, yb, yd, ye } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xe, y: y9 },
              { x: xf, y: y7 },
              { x: xj, y: yb },
              { x: xj, y: ye },
              { x: xf, y: ye },
              { x: xf, y: yd },
            ],
            color,
          );
          break;
        }

        case 'rs': {
          const { xf, xj, yf, yg } = this.cellOffsets(cell);

          this.drawing.rect({ x: xf, y: yf }, { x: xj, y: yg }, color);

          break;
        }

        case 'st': {
          const { x1, x5, yf, yg } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: yf }, { x: x5, y: yg }, color);

          break;
        }

        case 'tp': {
          const { x1, x5, x6, y7, y9, yb, yd, ye } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x5, y: y7 },
              { x: x6, y: y9 },
              { x: x5, y: yd },
              { x: x5, y: ye },
              { x: x1, y: ye },
              { x: x1, y: yb },
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
        // Kind 0

        case 'a': {
          const { x1, x5, xf, xj, y0, y1 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: y0 }, { x: x5, y: y1 }, color);
          this.drawing.rect({ x: x5, y: y0 }, { x: xf, y: y1 }, this.color.cell);
          this.drawing.rect({ x: xf, y: y0 }, { x: xj, y: y1 }, color);
          break;
        }

        case 'b': {
          const { xk, xj, y1, y2, y3, y5 } = this.cellOffsets(cell);

          this.drawing.rect({ x: xk, y: y1 }, { x: xj, y: y2 }, color);
          this.drawing.rect({ x: xk, y: y2 }, { x: xj, y: y3 }, this.color.cell);
          this.drawing.rect({ x: xk, y: y3 }, { x: xj, y: y5 }, color);
          break;
        }

        case 'c': {
          const { xa, xb, xc, xd, xf, xg, xh, xi, y8, y9, ya, yb, yd, ye, yf, yg } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xh, y: y8 },
              { x: xi, y: y9 },
              { x: xg, y: yb },
              { x: xf, y: ya },
            ],
            color,
          );

          this.drawing.polygon(
            [
              { x: xc, y: yd },
              { x: xf, y: ya },
              { x: xg, y: yb },
              { x: xd, y: ye },
            ],
            this.color.cell,
          );

          this.drawing.polygon(
            [
              { x: xc, y: yd },
              { x: xd, y: ye },
              { x: xb, y: yg },
              { x: xa, y: yf },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x2, x3, x4, x5, x7, x8, x9, xa, y8, y9, ya, yb, yd, ye, yf, yg } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x3, y: y8 },
              { x: x5, y: ya },
              { x: x4, y: yb },
              { x: x2, y: y9 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x5, y: ya },
              { x: x8, y: yd },
              { x: x7, y: ye },
              { x: x4, y: yb },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x8, y: yd },
              { x: xa, y: yf },
              { x: x9, y: yg },
              { x: x7, y: ye },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { x0, x1, y1, y2, y3, y5 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y3 }, this.color.cell);
          this.drawing.rect({ x: x0, y: y3 }, { x: x1, y: y5 }, color);
          break;
        }

        // Kind 1

        case 'f': {
          const { x1, x2, x3, x5, y0, y1 } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y1 }, color);
          this.drawing.rect({ x: x2, y: y0 }, { x: x3, y: y1 }, this.color.cell);
          this.drawing.rect({ x: x3, y: y0 }, { x: x5, y: y1 }, color);
          break;
        }

        case 'g': {
          const { x8, x9, xa, xb, xd, xe, xf, xg, y2, y3, y4, y5, y7, y8, y9, ya } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x9, y: y2 },
              { x: xb, y: y4 },
              { x: xa, y: y5 },
              { x: x8, y: y3 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xb, y: y4 },
              { x: xe, y: y7 },
              { x: xd, y: y8 },
              { x: xa, y: y5 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xe, y: y7 },
              { x: xg, y: y9 },
              { x: xf, y: ya },
              { x: xd, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'h': {
          const { x8, x9, xa, xb, xd, xe, xf, xg, ya, yb, yc, yd, yf, yg, yh, yi } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xf, y: ya },
              { x: xg, y: yb },
              { x: xe, y: yd },
              { x: xd, y: yc },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xb, y: yg },
              { x: xe, y: yd },
              { x: xd, y: yc },
              { x: xa, y: yf },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xa, y: yf },
              { x: xb, y: yg },
              { x: x9, y: yi },
              { x: x8, y: yh },
            ],
            color,
          );
          break;
        }

        case 'i': {
          const { x1, x2, x3, x5, yj, yk } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: yj }, { x: x2, y: yk }, color);
          this.drawing.rect({ x: x2, y: yj }, { x: x3, y: yk }, this.color.cell);
          this.drawing.rect({ x: x3, y: yj }, { x: x5, y: yk }, color);
          break;
        }

        case 'j': {
          const { x0, x1, y1, y5, yf, yj } = this.cellOffsets(cell);

          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y5 }, color);
          this.drawing.rect({ x: x0, y: y5 }, { x: x1, y: yf }, this.color.cell);
          this.drawing.rect({ x: x0, y: yf }, { x: x1, y: yj }, color);
          break;
        }

        // Kind 2

        case 'k': {
          const { xc, xe, xf, xg, y0, y1 } = this.cellOffsets(cell);

          this.drawing.rect({ x: xc, y: y0 }, { x: xe, y: y1 }, color);
          this.drawing.rect({ x: xe, y: y0 }, { x: xf, y: y1 }, this.color.cell);
          this.drawing.rect({ x: xf, y: y0 }, { x: xg, y: y1 }, color);
          break;
        }

        case 'l': {
          const { xg, xh, y1, y5, yf, yj } = this.cellOffsets(cell);

          this.drawing.rect({ x: xg, y: y1 }, { x: xh, y: y5 }, color);
          this.drawing.rect({ x: xg, y: y5 }, { x: xh, y: yf }, this.color.cell);
          this.drawing.rect({ x: xg, y: yf }, { x: xh, y: yj }, color);
          break;
        }

        case 'm': {
          const { xc, xe, xf, xg, yj, yk } = this.cellOffsets(cell);

          this.drawing.rect({ x: xc, y: yj }, { x: xe, y: yk }, color);
          this.drawing.rect({ x: xe, y: yj }, { x: xf, y: yk }, this.color.cell);
          this.drawing.rect({ x: xf, y: yj }, { x: xg, y: yk }, color);
          break;
        }

        case 'n': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, ya, yb, yc, yd, yf, yg, yh, yi } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x2, y: ya },
              { x: x4, y: yc },
              { x: x3, y: yd },
              { x: x1, y: yb },
            ],
            color,
          );

          this.drawing.polygon(
            [
              { x: x4, y: yc },
              { x: x7, y: yf },
              { x: x6, y: yg },
              { x: x3, y: yd },
            ],
            this.color.cell,
          );

          this.drawing.polygon(
            [
              { x: x7, y: yf },
              { x: x9, y: yh },
              { x: x8, y: yi },
              { x: x6, y: yg },
            ],
            color,
          );
          break;
        }

        case 'o': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y2, y3, y4, y5, y7, y8, y9, ya } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x8, y: y2 },
              { x: x9, y: y3 },
              { x: x7, y: y5 },
              { x: x6, y: y4 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: y8 },
              { x: x7, y: y5 },
              { x: x6, y: y4 },
              { x: x3, y: y7 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x3, y: y7 },
              { x: x4, y: y8 },
              { x: x2, y: ya },
              { x: x1, y: y9 },
            ],
            color,
          );
          break;
        }

        // Kind 3

        case 'p': {
          const { x2, x3, x4, x5, x7, x8, x9, xa, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x9, y: y1 },
              { x: xa, y: y2 },
              { x: x8, y: y4 },
              { x: x7, y: y3 },
            ],
            color,
          );

          this.drawing.polygon(
            [
              { x: x4, y: y6 },
              { x: x7, y: y3 },
              { x: x8, y: y4 },
              { x: x5, y: y7 },
            ],
            this.color.cell,
          );

          this.drawing.polygon(
            [
              { x: x4, y: y6 },
              { x: x5, y: y7 },
              { x: x3, y: y9 },
              { x: x2, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'q': {
          const { xa, xb, xc, xd, xf, xg, xh, xi, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xb, y: y1 },
              { x: xd, y: y3 },
              { x: xc, y: y4 },
              { x: xa, y: y2 },
            ],
            color,
          );

          this.drawing.polygon(
            [
              { x: xg, y: y6 },
              { x: xd, y: y3 },
              { x: xc, y: y4 },
              { x: xf, y: y7 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xg, y: y6 },
              { x: xi, y: y8 },
              { x: xh, y: y9 },
              { x: xf, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'r': {
          const { xj, xk, yc, ye, yf, yg } = this.cellOffsets(cell);

          this.drawing.rect({ x: xj, y: yc }, { x: xk, y: ye }, color);
          this.drawing.rect({ x: xj, y: ye }, { x: xk, y: yf }, this.color.cell);
          this.drawing.rect({ x: xj, y: yf }, { x: xk, y: yg }, color);
          break;
        }

        case 's': {
          const { x1, x5, xf, xj, yg, yh } = this.cellOffsets(cell);

          this.drawing.rect({ x: x1, y: yg }, { x: x5, y: yh }, color);
          this.drawing.rect({ x: x5, y: yg }, { x: xf, y: yh }, this.color.cell);
          this.drawing.rect({ x: xf, y: yg }, { x: xj, y: yh }, color);
          break;
        }

        case 't': {
          const { x0, x1, yc, ye, yf, yg } = this.cellOffsets(cell);

          this.drawing.rect({ x: x0, y: yc }, { x: x1, y: ye }, color);
          this.drawing.rect({ x: x0, y: ye }, { x: x1, y: yf }, this.color.cell);
          this.drawing.rect({ x: x0, y: yf }, { x: x1, y: yg }, color);
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
          const { x5, xa, xf, y2, y4, yc } = this.cellOffsets(cell);
          this.drawing.line({ x: x5, y: y2 }, { x: (x5 + xf) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: xf, y: y2 }, { x: (x5 + xf) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: x5, y: y4 }, { x: (x5 + xf) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: xf, y: y4 }, { x: (x5 + xf) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: xa, y: yc }, { x: (x5 + xf) / 2, y: (y2 + y4) / 2 }, color);
          break;
        }
        case 1: {
          const { x2, x4, xc, y5, ya, yf } = this.cellOffsets(cell);
          this.drawing.line({ x: x2, y: y5 }, { x: (x2 + x4) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: x4, y: y5 }, { x: (x2 + x4) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: xc, y: ya }, { x: (x2 + x4) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: x4, y: yf }, { x: (x2 + x4) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: x2, y: yf }, { x: (x2 + x4) / 2, y: (y5 + yf) / 2 }, color);
          break;
        }
        case 2: {
          const { x5, xd, xf, y5, ya, yf } = this.cellOffsets(cell);
          this.drawing.line({ x: xd, y: y5 }, { x: (xd + xf) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: xf, y: y5 }, { x: (xd + xf) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: xf, y: yf }, { x: (xd + xf) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: xd, y: yf }, { x: (xd + xf) / 2, y: (y5 + yf) / 2 }, color);
          this.drawing.line({ x: x5, y: ya }, { x: (xd + xf) / 2, y: (y5 + yf) / 2 }, color);
          break;
        }
        case 3: {
          const { x5, xa, xf, y5, yd, yf } = this.cellOffsets(cell);
          this.drawing.line({ x: x5, y: yd }, { x: (x5 + xf) / 2, y: (yd + yf) / 2 }, color);
          this.drawing.line({ x: xa, y: y5 }, { x: (x5 + xf) / 2, y: (yd + yf) / 2 }, color);
          this.drawing.line({ x: xf, y: yd }, { x: (x5 + xf) / 2, y: (yd + yf) / 2 }, color);
          this.drawing.line({ x: xf, y: yf }, { x: (x5 + xf) / 2, y: (yd + yf) / 2 }, color);
          this.drawing.line({ x: x5, y: yf }, { x: (x5 + xf) / 2, y: (yd + yf) / 2 }, color);
          break;
        }
        // no default
      }
    }
  }

  protected getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x5, xf, y2, y4 } = this.cellOffsets(cell);
        return { x: x5, y: y2, width: xf - x5, height: y4 - y2 };
      }

      case 1: {
        const { x2, x4, y4, yf } = this.cellOffsets(cell);
        return { x: x2, y: y4, width: x4 - x2, height: yf - y4 };
      }

      case 2: {
        const { xc, xf, y4, yf } = this.cellOffsets(cell);
        return { x: xc, y: y4, width: xf - xc, height: yf - y4 };
      }

      case 3: {
        const { x5, xf, yd, yf } = this.cellOffsets(cell);
        return { x: x5, y: yd, width: xf - x5, height: yf - yd };
      }

      default: {
        throw new Error(`no Rect for kind ${this.cellKind(cell)}`);
      }
    }
  }
}
