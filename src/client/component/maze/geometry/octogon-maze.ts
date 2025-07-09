/* eslint-disable unicorn/consistent-destructuring */
import { type Cartesian, modulo, type Rect } from '@technobuddha/library';

import {
  type Cell,
  type CellDirection,
  type CustomDrawingSize,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { Maze } from './maze.ts';
import { matrix } from './octogon-matrix.ts';

const { SQRT2, SQRT1_2 } = Math;

export type OctogonMazeProperties = MazeProperties;

export class OctogonMaze extends Maze {
  public constructor({
    cellSize = 42,
    wallSize = 1,
    voidSize = 2,
    ...props
  }: OctogonMazeProperties) {
    super({ cellSize, wallSize, voidSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      horizontalCellsPerGroup: 2,
      groupHeight: this.cellSize,
      custom({ width, height, actualWidth, actualHeight }: CustomDrawingSize): CustomDrawingSize {
        return {
          width: modulo(width, 2) === 0 ? width - 1 : width,
          height: modulo(height, 2) === 0 ? height - 1 : height,
          actualWidth,
          actualHeight,
        };
      },
    };
  }

  // Don't render the last row of squares, the maze looks better
  public override inMaze(cell: Cell): boolean {
    return super.inMaze(cell) && !(cell.y === this.height - 1 && cell.x % 2 === 1);
  }

  public cellKind(cell: Cell): number {
    return modulo(cell.x, 2);
  }

  protected cellOrigin(cell: Cell): Cartesian {
    switch (this.cellKind(cell)) {
      case 0: {
        return { x: cell.x * this.cellSize * 0.5, y: cell.y * this.cellSize };
      }

      case 1: {
        const ao = this.cellSize / (1 + Math.SQRT2);

        return {
          x: ((cell.x - 1) * this.cellSize) / 2 + this.cellSize - Math.sqrt((ao * ao) / 2),
          y: cell.y * this.cellSize + this.cellSize - Math.sqrt((ao * ao) / 2),
        };
      }

      default: {
        throw new Error(`Unknown cell kind: ${this.cellKind(cell)}`);
      }
    }
  }

  protected offsets(kind: Kind): Record<string, number> {
    const v = this.voidSize;
    const w = this.wallSize;
    const c = this.cellSize;

    // Calculate the size of a side of the octagon
    const ag = c / (1 + SQRT2);
    const aw = (c - v * 2) / (1 + SQRT2);
    const ai = (c - (v + w) * 2) / (1 + SQRT2);

    switch (kind) {
      case 0: {
        const x0 = 0;
        const x1 = x0 + v * SQRT1_2;
        const x2 = x0 + v;
        const x3 = x1 + v * SQRT1_2;
        const x4 = x0 + (v + w) * SQRT1_2;
        const x5 = x4 + v * SQRT1_2;
        const x6 = x2 + w;
        const x7 = x5 + w * SQRT1_2;
        const xb = x0 + (c - ag) / 2;
        const xa = xb - v * SQRT1_2;
        const x8 = xa - w * SQRT1_2;
        const x9 = x8 + v * SQRT1_2;
        const xd = xb + v;
        const xf = xd + w;
        const xc = x0 + (c - aw) / 2;
        const xe = x0 + (c - ai) / 2;
        const xv = x0 + c;
        const xk = xv - (c - ag) / 2;
        const xl = xk + v * SQRT1_2;
        const xn = xl + w * SQRT1_2;
        const xm = xn - v * SQRT1_2;
        const xj = xv - (c - aw) / 2;
        const xi = xk - v;
        const xh = xv - (c - ai) / 2;
        const xg = xi - w;
        const xu = xv - v * SQRT1_2;
        const xt = xv - v;
        const xs = xu - v * SQRT1_2;
        const xr = xu - w * SQRT1_2;
        const xq = xr - v * SQRT1_2;
        const xp = xt - w;
        const xo = xq - w * SQRT1_2;

        const y0 = 0;
        const y1 = y0 + v * SQRT1_2;
        const y2 = y0 + v;
        const y3 = y1 + v * SQRT1_2;
        const y4 = y0 + (v + w) * SQRT1_2;
        const y5 = y4 + v * SQRT1_2;
        const y6 = y2 + w;
        const y7 = y5 + w * SQRT1_2;
        const yb = y0 + (c - ag) / 2;
        const ya = yb - v * SQRT1_2;
        const y8 = ya - w * SQRT1_2;
        const y9 = y8 + v * SQRT1_2;
        const yd = yb + v;
        const yf = yd + w;
        const yc = y0 + (c - aw) / 2;
        const ye = y0 + (c - ai) / 2;
        const yv = y0 + c;
        const yk = yv - (c - ag) / 2;
        const yl = yk + v * SQRT1_2;
        const yn = yl + w * SQRT1_2;
        const ym = yn - v * SQRT1_2;
        const yj = yv - (c - aw) / 2;
        const yi = yk - v;
        const yh = yv - (c - ai) / 2;
        const yg = yi - w;
        const yu = yv - v * SQRT1_2;
        const yt = yv - v;
        const ys = yu - v * SQRT1_2;
        const yr = yu - w * SQRT1_2;
        const yq = yr - v * SQRT1_2;
        const yp = yt - w;
        const yo = yq - w * SQRT1_2;

        // prettier-ignore
        return {
          x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf,
          xg, xh, xi, xj, xk, xl, xm, xn, xo, xp, xq, xr, xs, xt, xu, xv,
          y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf,
          yg, yh, yi, yj, yk, yl, ym, yn, yo, yp, yq, yr, ys, yt, yu, yv
      }
      }

      case 1: {
        const x0 = 0;
        const x1 = x0 + v * SQRT1_2;
        const x2 = x1 + v * SQRT1_2;
        const x3 = x1 + w * SQRT1_2;
        const x4 = x2 + w * SQRT1_2;
        const x5 = x4 + w * SQRT1_2;

        const x9 = x0 + ag * SQRT1_2;
        const x8 = x9 - v * SQRT1_2;
        const x7 = x9 - w * SQRT1_2;
        const x6 = x7 - v * SQRT1_2;

        const xa = x9 + v * SQRT1_2;
        const xb = x9 + w * SQRT1_2;
        const xc = xb + v * SQRT1_2;

        const xi = x9 + ag * SQRT1_2;
        const xh = xi - v * SQRT1_2;
        const xg = xh - v * SQRT1_2;
        const xf = xh - w * SQRT1_2;
        const xe = xg - w * SQRT1_2;
        const xd = xe - w * SQRT1_2;

        const y0 = 0;
        const y1 = y0 + v * SQRT1_2;
        const y2 = y1 + v * SQRT1_2;
        const y3 = y1 + w * SQRT1_2;
        const y4 = y2 + w * SQRT1_2;
        const y5 = y4 + w * SQRT1_2;

        const y9 = y0 + ag * SQRT1_2;
        const y8 = y9 - v * SQRT1_2;
        const y7 = y9 - w * SQRT1_2;
        const y6 = y7 - v * SQRT1_2;

        const ya = y9 + v * SQRT1_2;
        const yb = y9 + w * SQRT1_2;
        const yc = yb + v * SQRT1_2;

        const yi = y9 + ag * SQRT1_2;
        const yh = yi - v * SQRT1_2;
        const yg = yh - v * SQRT1_2;
        const yf = yh - w * SQRT1_2;
        const ye = yg - w * SQRT1_2;
        const yd = ye - w * SQRT1_2;

        // prettier-ignore
        return {
          x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi,
          y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yg, yh, yi
        };
      }

      default: {
        throw new Error(`Unknown kind: ${kind}`);
      }
    }
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x2, xb, xc, xj, xk, xt, xv, y0, y2, yb, ye, yj, yk, yt, yv } =
            this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: yb },
              { x: xb, y: y0 },
              { x: xk, y: y0 },
              { x: xv, y: yb },
              { x: xv, y: yk },
              { x: xk, y: yv },
              { x: xb, y: yv },
              { x: x0, y: yk },
            ],
            this.backgroundColor,
          );

          this.drawing.polygon(
            [
              { x: x2, y: yb },
              { x: xc, y: y2 },
              { x: xj, y: y2 },
              { x: xt, y: ye },
              { x: xt, y: yj },
              { x: xj, y: yt },
              { x: xc, y: yt },
              { x: x2, y: yk },
            ],
            color,
          );

          break;
        }

        case 1: {
          const { x0, x2, x9, xg, xi, y0, y2, y9, yg, yi } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y9 },
              { x: x9, y: y0 },
              { x: xi, y: y9 },
              { x: x9, y: yi },
            ],
            this.backgroundColor,
          );

          this.drawing.polygon(
            [
              { x: x9, y: y2 },
              { x: xg, y: y9 },
              { x: x9, y: yg },
              { x: x2, y: y9 },
            ],
            color,
          );

          break;
        }

        // no default
      }
    }
  }

  public drawWall(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { xf, xg, y2, y6 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xf, y: y2 }, { x: xg, y: y6 }, color);
          break;
        }

        case 'b': {
          const { xk, xm, xo, xq, y5, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xm, y: y5 },
              { x: xq, y: y9 },
              { x: xo, y: yb },
              { x: xk, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { xp, xt, yf, yg } = this.cellOffsets(cell);
          this.drawing.rect({ x: xp, y: yf }, { x: xt, y: yg }, color);
          break;
        }

        case 'd': {
          const { xk, xm, xo, xq, yk, ym, yo, yq } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xo, y: yk },
              { x: xq, y: ym },
              { x: xm, y: yq },
              { x: xk, y: yo },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { xf, xg, yp, yt } = this.cellOffsets(cell);
          this.drawing.rect({ x: xf, y: yp }, { x: xg, y: yt }, color);
          break;
        }

        case 'f': {
          const { x5, x7, x9, xb, yk, ym, yo, yq } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x7, y: yk },
              { x: xb, y: yo },
              { x: x9, y: yq },
              { x: x5, y: ym },
            ],
            color,
          );
          break;
        }

        case 'g': {
          const { x2, x6, yf, yg } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: yf }, { x: x6, y: yg }, color);
          break;
        }

        case 'h': {
          const { x5, x7, x9, xb, y5, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y5 },
              { x: xb, y: y7 },
              { x: x7, y: yb },
              { x: x5, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'i': {
          const { x9, xb, xd, xe, y4, y5, y7, y9 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: y4 },
              { x: xe, y: y7 },
              { x: xd, y: y9 },
              { x: x9, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'j': {
          const { x9, xb, xd, xe, y9, yb, yd, ye } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xd, y: y9 },
              { x: xe, y: yb },
              { x: xb, y: ye },
              { x: x9, y: yd },
            ],
            color,
          );
          break;
        }

        case 'k': {
          const { x4, x5, x7, x9, y9, yb, yd, ye } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y9 },
              { x: x9, y: yd },
              { x: x7, y: ye },
              { x: x4, y: yb },
            ],
            color,
          );
          break;
        }

        case 'l': {
          const { x4, x5, x7, x9, y4, y5, y7, y9 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x4, y: y7 },
              { x: x7, y: y4 },
              { x: x9, y: y5 },
              { x: x5, y: y9 },
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
          const { xd, xf, xg, xi, y0, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xd, y: y0 }, { x: xf, y: y2 }, color);
          this.drawing.rect({ x: xf, y: y0 }, { x: xg, y: y2 }, this.cellColor);
          this.drawing.rect({ x: xg, y: y0 }, { x: xi, y: y2 }, color);
          break;
        }
        case 'b': {
          const { xk, xl, xm, xn, xq, xr, xs, xu, y1, y3, y4, y5, y8, y9, ya, yb } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xl, y: y1 },
              { x: xn, y: y4 },
              { x: xm, y: y5 },
              { x: xk, y: y3 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xn, y: y4 },
              { x: xr, y: y8 },
              { x: xq, y: y9 },
              { x: xm, y: y5 },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: xr, y: y8 },
              { x: xu, y: ya },
              { x: xs, y: yb },
              { x: xq, y: y9 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          const { xt, xv, yd, yf, yg, yi } = this.cellOffsets(cell);
          this.drawing.rect({ x: xt, y: yd }, { x: xv, y: yf }, color);
          this.drawing.rect({ x: xt, y: yf }, { x: xv, y: yg }, this.cellColor);
          this.drawing.rect({ x: xt, y: yg }, { x: xv, y: yi }, color);
          break;
        }
        case 'd': {
          const { xk, xl, xm, xn, xq, xr, xs, xu, yk, yl, ym, yn, yq, yr, ys, yu } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xk, y: ys },
              { x: xm, y: yq },
              { x: xn, y: yr },
              { x: xl, y: yu },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xm, y: yq },
              { x: xq, y: ym },
              { x: xr, y: yn },
              { x: xn, y: yr },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: xq, y: ym },
              { x: xs, y: yk },
              { x: xu, y: yl },
              { x: xr, y: yn },
            ],
            color,
          );
          break;
        }
        case 'e': {
          const { xd, xf, xg, xi, yt, yv } = this.cellOffsets(cell);
          this.drawing.rect({ x: xd, y: yt }, { x: xf, y: yv }, color);
          this.drawing.rect({ x: xf, y: yt }, { x: xg, y: yv }, this.cellColor);
          this.drawing.rect({ x: xg, y: yt }, { x: xi, y: yv }, color);
          break;
        }
        case 'f': {
          const { x1, x3, x4, x5, x8, x9, xa, xb, yk, yl, ym, yn, yq, yr, ys, yu } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: yk },
              { x: x5, y: ym },
              { x: x4, y: yn },
              { x: x1, y: yl },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x5, y: ym },
              { x: x9, y: yq },
              { x: x8, y: yr },
              { x: x4, y: yn },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x9, y: yq },
              { x: xb, y: ys },
              { x: xa, y: yu },
              { x: x8, y: yr },
            ],
            color,
          );
          break;
        }

        case 'g': {
          const { x0, x2, yd, yf, yg, yi } = this.cellOffsets(cell);
          this.drawing.rect({ x: x0, y: yd }, { x: x2, y: yf }, color);
          this.drawing.rect({ x: x0, y: yf }, { x: x2, y: yg }, this.cellColor);
          this.drawing.rect({ x: x0, y: yg }, { x: x2, y: yi }, color);
          break;
        }

        case 'h': {
          const { x1, x3, x4, x5, x8, x9, xa, xb, y1, y3, y4, y5, y8, y9, ya, yb } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: ya },
              { x: x4, y: y8 },
              { x: x5, y: y9 },
              { x: x3, y: yb },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: y8 },
              { x: x8, y: y4 },
              { x: x9, y: y5 },
              { x: x5, y: y9 },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x8, y: y4 },
              { x: xa, y: y1 },
              { x: xb, y: y3 },
              { x: x9, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'i': {
          const { x9, xa, xb, xc, xe, xf, xg, xh, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xa, y: y1 },
              { x: xc, y: y3 },
              { x: xb, y: y4 },
              { x: x9, y: y2 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xc, y: y3 },
              { x: xf, y: y6 },
              { x: xe, y: y7 },
              { x: xb, y: y4 },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: xf, y: y6 },
              { x: xh, y: y8 },
              { x: xg, y: y9 },
              { x: xe, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'j': {
          const { x9, xa, xb, xc, xe, xf, xg, xh, y9, ya, yb, yc, ye, yf, yg, yh } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: yg },
              { x: xb, y: ye },
              { x: xc, y: yf },
              { x: xa, y: yh },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: xb, y: ye },
              { x: xe, y: yb },
              { x: xf, y: yc },
              { x: xc, y: yf },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: xe, y: yb },
              { x: xg, y: y9 },
              { x: xh, y: ya },
              { x: xf, y: yc },
            ],
            color,
          );
          break;
        }

        case 'k': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y9, ya, yb, yc, ye, yf, yg, yh } =
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
              { x: x6, y: yf },
              { x: x3, y: yc },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x7, y: ye },
              { x: x9, y: yg },
              { x: x8, y: yh },
              { x: x6, y: yf },
            ],
            color,
          );
          break;
        }

        case 'l': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y8 },
              { x: x3, y: y6 },
              { x: x4, y: y7 },
              { x: x2, y: y9 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x3, y: y6 },
              { x: x6, y: y3 },
              { x: x7, y: y4 },
              { x: x4, y: y7 },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y3 },
              { x: x8, y: y1 },
              { x: x9, y: y2 },
              { x: x7, y: y4 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawPillar(cell: Cell, pillar: Pillar, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (pillar) {
        case 'ab': {
          const { xg, xh, xj, xk, xm, y2, y5, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xg, y: y2 },
              { x: xj, y: y2 },
              { x: xm, y: y5 },
              { x: xk, y: y7 },
              { x: xh, y: y6 },
              { x: xg, y: y6 },
            ],
            color,
          );
          break;
        }
        case 'bc': {
          const { xo, xp, xq, xt, y9, yb, yc, ye, yf } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xq, y: y9 },
              { x: xt, y: yc },
              { x: xt, y: yf },
              { x: xp, y: yf },
              { x: xp, y: ye },
              { x: xo, y: yb },
            ],
            color,
          );
          break;
        }
        case 'cd': {
          const { xo, xp, xq, xt, yg, yh, yj, yk, ym } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xp, y: yg },
              { x: xt, y: yg },
              { x: xt, y: yj },
              { x: xq, y: ym },
              { x: xo, y: yk },
              { x: xp, y: yh },
            ],
            color,
          );
          break;
        }
        case 'de': {
          const { xg, xh, xj, xk, xm, yo, yp, yq, yt } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xg, y: yp },
              { x: xh, y: yp },
              { x: xk, y: yo },
              { x: xm, y: yq },
              { x: xj, y: yt },
              { x: xg, y: yt },
            ],
            color,
          );
          break;
        }
        case 'ef': {
          const { x9, xb, xc, xe, xf, yo, yp, yq, yt } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: yo },
              { x: xe, y: yp },
              { x: xf, y: yp },
              { x: xf, y: yt },
              { x: xc, y: yt },
              { x: x9, y: yq },
            ],
            color,
          );
          break;
        }
        case 'fg': {
          const { x2, x5, x6, x7, yg, yh, yj, yk, ym } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: yg },
              { x: x6, y: yg },
              { x: x6, y: yh },
              { x: x7, y: yk },
              { x: x5, y: ym },
              { x: x2, y: yj },
            ],
            color,
          );
          break;
        }
        case 'gh': {
          const { x2, x5, x6, x7, y9, yb, yc, ye, yf } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y9 },
              { x: x7, y: yb },
              { x: x6, y: ye },
              { x: x6, y: yf },
              { x: x2, y: yf },
              { x: x2, y: yc },
            ],
            color,
          );
          break;
        }
        case 'ha': {
          const { x9, xb, xc, xe, xf, y2, y5, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xc, y: y2 },
              { x: xf, y: y2 },
              { x: xf, y: y6 },
              { x: xe, y: y6 },
              { x: xb, y: y7 },
              { x: x9, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'ij': {
          const { xd, xe, xg, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xd, y: y9 },
              { x: xe, y: y7 },
              { x: xg, y: y9 },
              { x: xe, y: yb },
            ],
            color,
          );
          break;
        }
        case 'jk': {
          const { x7, x9, xb, yd, ye, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x7, y: ye },
              { x: x9, y: yd },
              { x: xb, y: ye },
              { x: x9, y: yg },
            ],
            color,
          );
          break;
        }
        case 'kl': {
          const { x2, x4, x5, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y9 },
              { x: x4, y: y7 },
              { x: x5, y: y9 },
              { x: x4, y: yb },
            ],
            color,
          );
          break;
        }
        case 'li': {
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

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x6, xe, xh, xp, y6, ye, yh, yp } = this.cellOffsets(cell);
          this.drawing.line({ x: x6, y: yh }, { x: xp, y: ye }, color);
          this.drawing.line({ x: x6, y: ye }, { x: xp, y: yh }, color);
          this.drawing.line({ x: xe, y: y6 }, { x: xh, y: yp }, color);
          this.drawing.line({ x: xe, y: yp }, { x: xh, y: y6 }, color);

          break;
        }

        case 1: {
          const { x5, x9, xd, y5, y9, yd } = this.cellOffsets(cell);
          this.drawing.line({ x: x5, y: y9 }, { x: xd, y: y9 }, color);
          this.drawing.line({ x: x9, y: y5 }, { x: x9, y: yd }, color);
          break;
        }

        // no default
      }
    }
  }

  protected getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x6, xe, xk, xp, y6, ye, yk, yp } = this.cellOffsets(cell);

        return {
          x: (x6 + xe) / 2,
          y: (y6 + ye) / 2,
          width: (xk + xp) / 2 - (x6 + xe) / 2,
          height: (yk + yp) / 2 - (y6 + ye) / 2,
        };
      }
      case 1: {
        const { x5, xd, y5, yd } = this.cellOffsets(cell);

        return { x: x5, y: y5, width: xd - x5, height: yd - y5 };
      }

      default: {
        throw new Error(`"${this.cellKind(cell)}" is not a valid cell kind`);
      }
    }
  }
}
