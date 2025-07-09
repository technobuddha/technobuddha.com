import {
  type Cartesian,
  largestInscribedRectangle,
  modulo,
  type Polygon,
  type Rect,
  toRadians,
} from '@technobuddha/library';

import { matrix } from './cubic-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { Maze } from './maze.ts';

const SIN15 = Math.sin(toRadians(15));
const COS15 = Math.cos(toRadians(15));

export type CubicMazeProperties = MazeProperties;

export class CubicMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 2, ...props }: CubicMazeProperties) {
    super({ cellSize, wallSize, voidSize: 2, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 2 * COS15,
      horizontalCellsPerGroup: 3,
      groupHeight: this.cellSize * SIN15 * 5,
      verticalCellsPerGroup: 1,
      leftPadding: 0, //this.cellSize / 2,
      rightPadding: 0, //this.cellSize / 2,
      topPadding: this.cellSize / 2,
      bottomPadding: 0, //this.cellSize / 2,
    };
  }

  public cellKind(cell: Cell): number {
    return modulo(cell.x, 3) + 3 * modulo(cell.y, 2);
  }

  protected cellOrigin(cell: Cell): Cartesian {
    let x = Math.floor((cell.x * 2) / 3) * this.cellSize * COS15;
    let y = cell.y * this.cellSize * SIN15 * 5;

    if (modulo(cell.x, 3) === 1) {
      y -= this.cellSize * SIN15;
    }

    if (modulo(cell.y, 2) === 1) {
      x += this.cellSize * COS15;
    }

    return { x, y };
  }

  protected offsets(kind: Kind): Record<string, number> {
    const c = this.cellSize;
    const v = this.voidSize;
    const w = this.wallSize;

    switch (kind) {
      case 0:
      case 2:
      case 3:
      case 5: {
        const x0 = 0;
        const x1 = x0 + v * COS15;
        const x2 = x1 + w * COS15;

        const x5 = x0 + c * COS15;
        const x4 = x5 - v * COS15;
        const x3 = x4 - w * COS15;

        const y0 = 0;
        const y1 = y0 + v * SIN15;
        const y2 = y0 + v;
        const y3 = y1 + w * SIN15;
        const y4 = y1 + v;
        const y5 = y4 + w * SIN15;
        const y6 = y2 + w;
        const y7 = y4 + w;
        const y8 = y5 + w;

        const yc = y0 + c * SIN15;
        const ya = yc - v * SIN15;
        const y9 = ya - w * SIN15;
        const ye = yc + v;
        const yd = ye - v * SIN15;
        const yb = yd - w * SIN15;
        const yh = ye + w;
        const yg = yh - v * SIN15;
        const yf = yb + w;

        const yn = y0 + c;
        const yl = yn - v;
        const ym = yl + v * SIN15;
        const yi = yl - w;
        const yj = ym - w;
        const yk = yj + w * SIN15;
        const yp = yn + v * SIN15;
        const yq = yp + w * SIN15;
        const yo = yq - v;

        const yz = yc + c;
        const yy = yz - v * SIN15;
        const yx = yz - v;
        const yv = yx - v * SIN15;
        const yt = yx - w;
        const ys = yt - v * SIN15;
        const yr = ys - w * SIN15;
        const yw = yy - w * SIN15;
        const yu = yv - w * SIN15;

        if (kind === 0 || kind === 3) {
          // prettier-ignore
          return {
            x0, x1, x2, x3, x4, x5,
            y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yg, yh, yi, yj, yk, yl,
            ym, yn, yo, yp, yq, yr, ys, yt, yu, yv, yw, yx, yy, yz
          };
        }

        // prettier-ignore
        return {
          x0: x5-x5, x1: x5-x4, x2: x5-x3, x3: x5-x2, x4: x5-x1, x5: x5-x0,
          y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yg, yh, yi, yj, yk, yl,
          ym, yn, yo, yp, yq, yr, ys, yt, yu, yv, yw, yx, yy, yz
        };
      }

      case 1:
      case 4: {
        const x0 = 0;
        const x1 = x0 + v * COS15;
        const x2 = x1 + v * COS15;
        const x3 = x1 + w * COS15;
        const x4 = x2 + w * COS15;
        const x5 = x4 + w * COS15;

        const x9 = x0 + c * COS15;
        const x8 = x9 - v * COS15;
        const x7 = x9 - w * COS15;
        const x6 = x8 - w * COS15;
        const xa = x9 + v * COS15;
        const xb = x9 + w * COS15;
        const xc = xa + w * COS15;

        const xi = x9 + c * COS15;
        const xh = xi - v * COS15;
        const xg = xh - v * COS15;
        const xf = xh - w * COS15;
        const xe = xg - w * COS15;
        const xd = xe - w * COS15;

        const y0 = 0;
        const y1 = y0 + v * SIN15;
        const y2 = y1 + v * SIN15;
        const y3 = y1 + w * SIN15;
        const y4 = y2 + w * SIN15;
        const y5 = y4 + w * SIN15;

        const y9 = y0 + c * SIN15;
        const y8 = y9 - v * SIN15;
        const y7 = y9 - w * SIN15;
        const y6 = y8 - w * SIN15;
        const ya = y9 + v * SIN15;
        const yb = y9 + w * SIN15;
        const yc = ya + w * SIN15;

        const yi = y9 + c * SIN15;
        const yh = yi - v * SIN15;
        const yg = yh - v * SIN15;
        const yf = yi - w * SIN15;
        const ye = yg - w * SIN15;
        const yd = ye - w * SIN15;

        // prettier-ignore
        return {
          x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe, xf, xg, xh, xi,
          y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye, yf, yg, yh, yi };
      }

      default: {
        throw new Error(`Unknown kind: ${kind}`);
      }
    }
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0:
        case 3: {
          const { x0, x1, x4, x5, y0, y4, yc, yd, ym, yn, yv, yz } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x5, y: yc },
              { x: x5, y: yz },
              { x: x0, y: yn },
            ],
            this.backgroundColor,
          );

          this.drawing.polygon(
            [
              { x: x1, y: y4 },
              { x: x4, y: yd },
              { x: x4, y: yv },
              { x: x1, y: ym },
            ],
            color,
          );
          break;
        }

        case 1:
        case 4: {
          const { x0, x2, x9, xg, xi, y0, y2, y9, yg, yi } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x9, y: y0 },
              { x: xi, y: y9 },
              { x: x9, y: yi },
              { x: x0, y: y9 },
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

        case 2:
        case 5: {
          const { x0, x1, x4, x5, y0, y4, yc, yd, ym, yn, yv, yz } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: yc },
              { x: x5, y: y0 },
              { x: x5, y: yn },
              { x: x0, y: yz },
            ],
            this.backgroundColor,
          );
          this.drawing.polygon(
            [
              { x: x1, y: yd },
              { x: x4, y: y4 },
              { x: x4, y: ym },
              { x: x1, y: yv },
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
          const { x2, x3, y5, y8, yb, yf } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y5 },
              { x: x3, y: yb },
              { x: x3, y: yf },
              { x: x2, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'b': {
          const { x3, x4, yf, yg, ys, yr } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: yf },
              { x: x4, y: yg },
              { x: x4, y: ys },
              { x: x3, y: yr },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x2, x3, yk, yo, yr, yu } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: yk },
              { x: x3, y: yr },
              { x: x3, y: yu },
              { x: x2, y: yo },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x1, x2, y7, y8, yk, yj } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y7 },
              { x: x2, y: y8 },
              { x: x2, y: yk },
              { x: x1, y: yj },
            ],
            color,
          );
          break;
        }

        // Kind 1, 4

        case 'e': {
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

        case 'f': {
          const { x9, xb, xd, xe, y9, yb, yd, ye } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: yd },
              { x: xd, y: y9 },
              { x: xe, y: yb },
              { x: xb, y: ye },
            ],
            color,
          );
          break;
        }

        case 'g': {
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

        case 'h': {
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

        // Kind 2, 5

        case 'i': {
          const { x2, x3, y5, y8, yb, yf } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: yb },
              { x: x3, y: y5 },
              { x: x3, y: y8 },
              { x: x2, y: yf },
            ],
            color,
          );
          break;
        }

        case 'j': {
          const { x3, x4, y7, y8, yj, yk } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y8 },
              { x: x4, y: y7 },
              { x: x4, y: yj },
              { x: x3, y: yk },
            ],
            color,
          );
          break;
        }

        case 'k': {
          const { x2, x3, yk, yo, yr, yu } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: yr },
              { x: x3, y: yk },
              { x: x3, y: yo },
              { x: x2, y: yu },
            ],
            color,
          );
          break;
        }

        case 'l': {
          const { x1, x2, yf, yg, yr, ys } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: yg },
              { x: x2, y: yf },
              { x: x2, y: yr },
              { x: x1, y: ys },
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
          const { x3, x4, yb, yd, yf, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: yb },
              { x: x4, y: yd },
              { x: x4, y: yg },
              { x: x3, y: yf },
            ],
            color,
          );
          break;
        }

        case 'bc': {
          const { x3, x4, yr, ys, yu, yv } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: yr },
              { x: x4, y: ys },
              { x: x4, y: yv },
              { x: x3, y: yu },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { x1, x2, yj, yk, ym, yo } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: yj },
              { x: x2, y: yk },
              { x: x2, y: yo },
              { x: x1, y: ym },
            ],
            color,
          );
          break;
        }

        case 'da': {
          const { x1, x2, y4, y5, y7, y8 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y4 },
              { x: x2, y: y5 },
              { x: x2, y: y8 },
              { x: x1, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'ef': {
          const { xd, xe, xg, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xe, y: y7 },
              { x: xg, y: y9 },
              { x: xe, y: yb },
              { x: xd, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'fg': {
          const { x7, x9, xb, yd, ye, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: yd },
              { x: xb, y: ye },
              { x: x9, y: yg },
              { x: x7, y: ye },
            ],
            color,
          );
          break;
        }

        case 'gh': {
          const { x2, x4, x5, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x4, y: y7 },
              { x: x5, y: y9 },
              { x: x4, y: yb },
              { x: x2, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'he': {
          const { x7, x9, xb, y2, y4, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y2 },
              { x: xb, y: y4 },
              { x: x9, y: y5 },
              { x: x7, y: y4 },
            ],
            color,
          );
          break;
        }

        // Kind 2, 5

        case 'ij': {
          const { x3, x4, y4, y5, y7, y8 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y5 },
              { x: x4, y: y4 },
              { x: x4, y: y7 },
              { x: x3, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'jk': {
          const { x3, x4, yj, yk, ym, yo } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: yk },
              { x: x4, y: yj },
              { x: x4, y: ym },
              { x: x3, y: yo },
            ],
            color,
          );
          break;
        }

        case 'kl': {
          const { x1, x2, yr, ys, yu, yv } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: ys },
              { x: x2, y: yr },
              { x: x2, y: yu },
              { x: x1, y: yv },
            ],
            color,
          );
          break;
        }

        case 'li': {
          const { x1, x2, yb, yd, yf, yg } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: yd },
              { x: x2, y: yb },
              { x: x2, y: yf },
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

  public override drawDoor(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        // Kind 1,3

        case 'a': {
          const { x1, x2, x3, x4, y1, y3, y4, y5, y9, ya, yb, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: x2, y: y3 },
              { x: x2, y: y5 },
              { x: x1, y: y4 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x2, y: y3 },
              { x: x3, y: y9 },
              { x: x3, y: yb },
              { x: x2, y: y5 },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x3, y: y9 },
              { x: x4, y: ya },
              { x: x4, y: yd },
              { x: x3, y: yb },
            ],
            color,
          );
          break;
        }

        case 'b': {
          const { x4, x5, yd, ye, yh, yg, ys, yt, yv, yx } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x4, y: yd },
              { x: x5, y: ye },
              { x: x5, y: yh },
              { x: x4, y: yg },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: yg },
              { x: x5, y: yh },
              { x: x5, y: yt },
              { x: x4, y: ys },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x4, y: ys },
              { x: x5, y: yt },
              { x: x5, y: yx },
              { x: x4, y: yv },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x1, x2, x3, x4, ym, yo, yp, yq, yu, yv, yw, yy } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: ym },
              { x: x2, y: yo },
              { x: x2, y: yq },
              { x: x1, y: yp },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x2, y: yo },
              { x: x3, y: yu },
              { x: x3, y: yw },
              { x: x2, y: yq },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x3, y: yu },
              { x: x4, y: yv },
              { x: x4, y: yy },
              { x: x3, y: yw },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x0, x1, y2, y4, y6, y7, yi, yj, yl, ym } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y2 },
              { x: x1, y: y4 },
              { x: x1, y: y7 },
              { x: x0, y: y6 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x0, y: y6 },
              { x: x1, y: y7 },
              { x: x1, y: yj },
              { x: x0, y: yi },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x0, y: yi },
              { x: x1, y: yj },
              { x: x1, y: ym },
              { x: x0, y: yl },
            ],
            color,
          );
          break;
        }

        // Kind 1, 4

        case 'e': {
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

        case 'f': {
          const { x9, xa, xb, xc, xe, xf, xg, xh, y9, ya, yb, yc, yg, yh, ye, yf } =
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

        case 'g': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y9, ya, yb, yc, yg, yh, ye, yf } =
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

        case 'h': {
          const { x1, x2, x3, x4, x6, x7, x8, x9, y1, y2, y3, y4, y6, y7, y8, y9 } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y9 },
              { x: x4, y: y7 },
              { x: x3, y: y6 },
              { x: x1, y: y8 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: y7 },
              { x: x7, y: y4 },
              { x: x6, y: y3 },
              { x: x3, y: y6 },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x7, y: y4 },
              { x: x9, y: y2 },
              { x: x8, y: y1 },
              { x: x6, y: y3 },
            ],
            color,
          );
          break;
        }

        // Kind 2,5

        case 'i': {
          const { x1, x2, x3, x4, y1, y3, y4, y5, y9, ya, yb, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: ya },
              { x: x2, y: y9 },
              { x: x2, y: yb },
              { x: x1, y: yd },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x2, y: y9 },
              { x: x3, y: y3 },
              { x: x3, y: y5 },
              { x: x2, y: yb },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x3, y: y3 },
              { x: x4, y: y1 },
              { x: x4, y: y4 },
              { x: x3, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'j': {
          const { x4, x5, y2, y4, y6, y7, yi, yj, yl, ym } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x4, y: y4 },
              { x: x5, y: y2 },
              { x: x5, y: y6 },
              { x: x4, y: y7 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: y7 },
              { x: x5, y: y6 },
              { x: x5, y: yi },
              { x: x4, y: yj },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x4, y: yj },
              { x: x5, y: yi },
              { x: x5, y: yl },
              { x: x4, y: ym },
            ],
            color,
          );
          break;
        }

        case 'k': {
          const { x1, x2, x3, x4, ym, yo, yp, yq, yu, yv, yw, yy } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: yv },
              { x: x2, y: yu },
              { x: x2, y: yw },
              { x: x1, y: yy },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x2, y: yu },
              { x: x3, y: yo },
              { x: x3, y: yq },
              { x: x2, y: yw },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x3, y: yo },
              { x: x4, y: ym },
              { x: x4, y: yp },
              { x: x3, y: yq },
            ],
            color,
          );
          break;
        }

        case 'l': {
          const { x0, x1, yd, ye, yg, yh, ys, yt, yv, yx } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: ye },
              { x: x1, y: yd },
              { x: x1, y: yg },
              { x: x0, y: yh },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x0, y: yh },
              { x: x1, y: yg },
              { x: x1, y: ys },
              { x: x0, y: yt },
            ],
            this.cellColor,
          );
          this.drawing.polygon(
            [
              { x: x0, y: yt },
              { x: x1, y: ys },
              { x: x1, y: yv },
              { x: x0, y: yx },
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
        case 0:
        case 3: {
          const { x2, x3, y8, yf, yk, yr } = this.cellOffsets(cell);

          this.drawing.line({ x: x2, y: y8 }, { x: x3, y: yr }, color);
          this.drawing.line({ x: x2, y: yk }, { x: x3, y: yf }, color);
          break;
        }

        case 1:
        case 4: {
          const { x5, x9, xd, y5, y8, yd } = this.cellOffsets(cell);

          this.drawing.line({ x: x5, y: y8 }, { x: xd, y: y8 }, color);
          this.drawing.line({ x: x9, y: y5 }, { x: x9, y: yd }, color);
          break;
        }

        case 2:
        case 5: {
          const { x2, x3, y8, yf, yk, yr } = this.cellOffsets(cell);

          this.drawing.line({ x: x2, y: yf }, { x: x3, y: yk }, color);
          this.drawing.line({ x: x2, y: yr }, { x: x3, y: y8 }, color);
          break;
        }

        // no default
      }
    }
  }

  protected getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0:
      case 3: {
        const { x2, x3, y8, yf, yk, yr } = this.cellOffsets(cell);

        const poly: Polygon = [
          { x: x2, y: y8 },
          { x: x3, y: yf },
          { x: x3, y: yr },
          { x: x2, y: yk },
        ];
        return largestInscribedRectangle(poly, { squareOnly: true });
      }

      case 1:
      case 4: {
        const { x5, x9, xd, y5, y8, yd } = this.cellOffsets(cell);

        const poly: Polygon = [
          { x: x9, y: y5 },
          { x: xd, y: y8 },
          { x: x9, y: yd },
          { x: x5, y: y8 },
        ];
        return largestInscribedRectangle(poly, { squareOnly: true });
      }

      case 2:
      case 5: {
        const { x2, x3, y8, yf, yk, yr } = this.cellOffsets(cell);

        const poly: Polygon = [
          { x: x2, y: yf },
          { x: x3, y: y8 },
          { x: x3, y: yk },
          { x: x2, y: yr },
        ];
        return largestInscribedRectangle(poly, { squareOnly: true });
      }

      default: {
        throw new Error(`Unknown kind: ${this.cellKind(cell)}`);
      }
    }
  }
}
