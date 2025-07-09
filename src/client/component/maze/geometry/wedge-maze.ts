/* eslint-disable @typescript-eslint/switch-exhaustiveness-check */
import { type Cartesian, modulo, type Rect } from '@technobuddha/library';

import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  Maze,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { matrix } from './wedge-matrix.ts';

const { SQRT2, SQRT1_2 } = Math;

export type WedgeMazeProperties = MazeProperties;

export class WedgeMaze extends Maze {
  public constructor({ cellSize = 32, wallSize = 1, voidSize = 1, ...props }: WedgeMazeProperties) {
    super({ cellSize, wallSize, voidSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 2,
      horizontalCellsPerGroup: 4,
      groupHeight: this.cellSize * 2,
      verticalCellsPerGroup: 2,
    };
  }

  public cellKind(cell: Cell): number {
    return modulo(cell.x + modulo(cell.y, 2) * 2, 4);
  }

  protected cellOrigin(cell: Cell): Cartesian {
    return {
      x: Math.floor(cell.x * 0.5) * this.cellSize,
      y: cell.y * this.cellSize,
    };
  }

  protected offsets(kind: Kind): Record<string, number> {
    const v = this.voidSize;
    const w = this.wallSize;
    const c = this.cellSize;

    const x0 = 0;
    const x1 = x0 + v;
    const x2 = x1 + w;
    const x3 = x2 + v * SQRT1_2;
    const x4 = x2 + w * SQRT1_2;
    const x5 = x3 + w * SQRT1_2;
    const xd = x0 + c;
    const xc = xd - (v + v * SQRT2);
    const xa = xc - w;
    const xb = xa + v * SQRT1_2;
    const x8 = xb - w * SQRT1_2;
    const x7 = xa - w * SQRT1_2;
    const x6 = x7 - w * SQRT1_2;
    const x9 = x6 + w;

    const y0 = 0;
    const y1 = y0 + v;
    const y2 = y1 + w;
    const y3 = y2 + v * SQRT1_2;
    const y4 = y2 + w * SQRT1_2;
    const y5 = y3 + w * SQRT1_2;
    const yd = y0 + c;
    const yc = yd - (v + v * SQRT2);
    const ya = yc - w;
    const yb = ya + v * SQRT1_2;
    const y8 = yb - w * SQRT1_2;
    const y7 = ya - w * SQRT1_2;
    const y6 = y7 - w * SQRT1_2;
    const y9 = y6 + w;

    const normalX = { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd };
    const normalY = { y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd };

    // prettier-ignore
    const invertX = {
      x0: xd-xd, x1: xd-xc, x2: xd-xb, x3: xd-xa, x4: xd-x9, x5: xd-x8, x6: xd-x7,
      x7: xd-x6, x8: xd-x5, x9: xd-x4, xa: xd-x3, xb: xd-x2, xc: xd-x1, xd: xd-x0
    };
    // prettier-ignore
    const invertY = {
      y0: yd-yd, y1: yd-yc, y2: yd-yb, y3: yd-ya, y4: yd-y9, y5: yd-y8, y6: yd-y7,
      y7: yd-y6, y8: yd-y5, y9: yd-y4, ya: yd-y3, yb: yd-y2, yc: yd-y1, yd: yd-y0
    };

    switch (kind) {
      case 0: {
        return { ...normalX, ...normalY };
      }

      case 1: {
        return { ...invertX, ...invertY };
      }

      case 2: {
        return { ...normalX, ...invertY };
      }

      case 3: {
        return { ...invertX, ...normalY };
      }

      default: {
        throw new Error(`Invalid kind: ${kind}`);
      }
    }
  }

  public drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x1, xc, xd, y0, y1, yc, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: xd, y: y0 },
              { x: x0, y: yd },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: xc, y: y1 },
              { x: x1, y: yc },
            ],
            color,
          );
          break;
        }

        case 1: {
          const { x0, x1, xc, xd, y0, y1, yc, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: yd },
              { x: xd, y: y0 },
              { x: xd, y: yd },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: yc },
              { x: xc, y: yc },
              { x: xc, y: y1 },
            ],
            color,
          );
          break;
        }

        case 2: {
          const { x0, x1, xc, xd, y0, y1, yc, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x0, y: yd },
              { x: xd, y: yd },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: yc },
              { x: xc, y: yc },
              { x: x1, y: y1 },
            ],
            color,
          );
          break;
        }

        case 3: {
          const { x0, x1, xc, xd, y0, y1, yc, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: xd, y: y0 },
              { x: xd, y: yd },
            ],
            this.color.background,
          );
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: xc, y: y1 },
              { x: xc, y: yc },
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
      switch (cell.direction) {
        case 'a': {
          const { x2, x6, y1, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: y1 }, { x: x6, y: y2 }, color);
          break;
        }
        case 'b': {
          const { x2, x4, x6, x7, y2, y4, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x6, y: y2 },
              { x: x7, y: y4 },
              { x: x4, y: y7 },
              { x: x2, y: y6 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          const { x1, x2, y2, y6 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y2 }, { x: x2, y: y6 }, color);
          break;
        }

        case 'd': {
          const { x6, x7, x9, xb, y6, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y6 },
              { x: xb, y: y7 },
              { x: x7, y: yb },
              { x: x6, y: y9 },
            ],
            color,
          );
          break;
        }
        case 'e': {
          const { xb, xc, y7, yb } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: y7 }, { x: xc, y: yb }, color);
          break;
        }

        case 'f': {
          const { x7, xb, yb, yc } = this.cellOffsets(cell);
          this.drawing.rect({ x: x7, y: yb }, { x: xb, y: yc }, color);
          break;
        }

        case 'g': {
          const { x2, x4, x6, x7, y6, y7, y9, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y7 },
              { x: x4, y: y6 },
              { x: x7, y: y9 },
              { x: x6, y: yb },
            ],
            color,
          );
          break;
        }

        case 'h': {
          const { x2, x6, yb, yc } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: yb }, { x: x6, y: yc }, color);
          break;
        }

        case 'i': {
          const { x1, x2, y7, yb } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y7 }, { x: x2, y: yb }, color);
          break;
        }

        case 'j': {
          const { x7, xb, y1, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x7, y: y1 }, { x: xb, y: y2 }, color);
          break;
        }

        case 'k': {
          const { xb, xc, y2, y6 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: y2 }, { x: xc, y: y6 }, color);
          break;
        }

        case 'l': {
          const { x6, x7, x9, xb, y2, y4, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x7, y: y2 },
              { x: xb, y: y6 },
              { x: x9, y: y7 },
              { x: x6, y: y4 },
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
      switch (cell.direction) {
        case 'a': {
          const { x1, x2, x6, x7, y0, y1 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y1 }, color);
          this.drawing.rect({ x: x2, y: y0 }, { x: x6, y: y1 }, this.color.cell);
          this.drawing.rect({ x: x6, y: y0 }, { x: x7, y: y1 }, color);
          break;
        }

        case 'b': {
          const { x2, x3, x4, x5, x7, x8, xa, xb, y2, y3, y4, y5, y7, y8, ya, yb } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: ya },
              { x: x4, y: y7 },
              { x: x5, y: y8 },
              { x: x3, y: yb },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x8, y: y5 },
              { x: x5, y: y8 },
              { x: x4, y: y7 },
              { x: x7, y: y4 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x7, y: y4 },
              { x: xb, y: y3 },
              { x: xa, y: y2 },
              { x: x8, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x0, x1, y1, y2, y6, y7 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y6 }, this.color.cell);
          this.drawing.rect({ x: x0, y: y6 }, { x: x1, y: y7 }, color);
          break;
        }

        case 'd': {
          const { x2, x3, x5, x6, x8, x9, xa, xb, y2, y3, y5, y6, y8, y9, ya, yb } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: ya },
              { x: x5, y: y8 },
              { x: x6, y: y9 },
              { x: x3, y: yb },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x8, y: y5 },
              { x: x5, y: y8 },
              { x: x6, y: y9 },
              { x: x9, y: y6 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x8, y: y5 },
              { x: xa, y: y2 },
              { x: xb, y: y3 },
              { x: x9, y: y6 },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { xc, xd, y4, y7, yb, yc } = this.cellOffsets(cell);
          this.drawing.rect({ x: xc, y: y4 }, { x: xd, y: y7 }, color);
          this.drawing.rect({ x: xc, y: y7 }, { x: xd, y: yb }, this.color.cell);
          this.drawing.rect({ x: xc, y: yb }, { x: xd, y: yc }, color);
          break;
        }

        case 'f': {
          const { x4, x7, xb, xc, yc, yd } = this.cellOffsets(cell);
          this.drawing.rect({ x: x4, y: yc }, { x: x7, y: yd }, color);
          this.drawing.rect({ x: x7, y: yc }, { x: xb, y: yd }, this.color.cell);
          this.drawing.rect({ x: xb, y: yc }, { x: xc, y: yd }, color);
          break;
        }

        case 'g': {
          const { x2, x3, x4, x5, x7, x8, xa, xb, y2, y3, y5, y6, y8, y9, ya, yb } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y3 },
              { x: x3, y: y2 },
              { x: x5, y: y5 },
              { x: x4, y: y6 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x4, y: y6 },
              { x: x7, y: y9 },
              { x: x8, y: y8 },
              { x: x5, y: y5 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x8, y: y8 },
              { x: xb, y: ya },
              { x: xa, y: yb },
              { x: x7, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'h': {
          const { x1, x2, x6, x7, yc, yd } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: yc }, { x: x2, y: yd }, color);
          this.drawing.rect({ x: x2, y: yc }, { x: x6, y: yd }, this.color.cell);
          this.drawing.rect({ x: x6, y: yc }, { x: x7, y: yd }, color);
          break;
        }

        case 'i': {
          const { x0, x1, y4, y7, yb, yc } = this.cellOffsets(cell);
          this.drawing.rect({ x: x0, y: y4 }, { x: x1, y: y7 }, color);
          this.drawing.rect({ x: x0, y: y7 }, { x: x1, y: yb }, this.color.cell);
          this.drawing.rect({ x: x0, y: yb }, { x: x1, y: yc }, color);
          break;
        }

        case 'j': {
          const { x4, x7, xb, xc, y0, y1 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x4, y: y0 }, { x: x7, y: y1 }, color);
          this.drawing.rect({ x: x7, y: y0 }, { x: xb, y: y1 }, this.color.cell);
          this.drawing.rect({ x: xb, y: y0 }, { x: xc, y: y1 }, color);
          break;
        }

        case 'k': {
          const { xc, xd, y1, y2, y6, y7 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xc, y: y1 }, { x: xd, y: y2 }, color);
          this.drawing.rect({ x: xc, y: y2 }, { x: xd, y: y6 }, this.color.cell);
          this.drawing.rect({ x: xc, y: y6 }, { x: xd, y: y7 }, color);
          break;
        }

        case 'l': {
          const { x2, x3, x5, x6, x8, x9, xa, xb, y2, y3, y4, y5, y7, y8, ya, yb } =
            this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y2 },
              { x: x6, y: y4 },
              { x: x5, y: y5 },
              { x: x2, y: y3 },
            ],
            color,
          );
          this.drawing.polygon(
            [
              { x: x6, y: y4 },
              { x: x9, y: y7 },
              { x: x8, y: y8 },
              { x: x5, y: y5 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x9, y: y7 },
              { x: xb, y: ya },
              { x: xa, y: yb },
              { x: x8, y: y8 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }
  public drawPillar(cell: Cell, pillar: Pillar, color = this.color.wall): void {
    if (this.drawing) {
      switch (pillar) {
        case 'ab': {
          const { x6, x7, xc, y1, y2, y4 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x6, y: y1 },
              { x: xc, y: y1 },
              { x: x7, y: y4 },
              { x: x6, y: y2 },
            ],
            color,
          );
          break;
        }
        case 'bc': {
          const { x1, x2, x4, y6, y7, yc } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y6 },
              { x: x2, y: y6 },
              { x: x4, y: y7 },
              { x: x1, y: yc },
            ],
            color,
          );
          break;
        }
        case 'ca': {
          const { x1, x2, y1, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y1 }, { x: x2, y: y2 }, color);
          break;
        }
        case 'de': {
          // const { x6, x7, x8, xb, y6, y7, y9, yb } = this.cellOffsets(cell);

          const { x9, xb, xc, y1, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y6 },
              { x: xc, y: y1 },
              { x: xc, y: y7 },
              { x: xb, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'ef': {
          const { xb, xc, yb, yc } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: yb }, { x: xc, y: yc }, color);
          break;
        }
        case 'fd': {
          const { x1, x6, x7, y9, yb, yc } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: yc },
              { x: x6, y: y9 },
              { x: x7, y: yb },
              { x: x7, y: yc },
            ],
            color,
          );
          break;
        }
        case 'ig': {
          const { x1, x2, x4, y1, y6, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y7 },
              { x: x1, y: y1 },
              { x: x4, y: y6 },
              { x: x2, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'gh': {
          const { x6, x7, xc, y9, yb, yc } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x6, y: yc },
              { x: x6, y: yb },
              { x: x7, y: y9 },
              { x: xc, y: yc },
            ],
            color,
          );
          break;
        }
        case 'hi': {
          const { x1, x2, yb, yc } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: yb }, { x: x2, y: yc }, color);
          break;
        }
        case 'jk': {
          const { xb, xc, y1, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: xb, y: y1 }, { x: xc, y: y2 }, color);
          break;
        }
        case 'kl': {
          const { x9, xb, xc, y6, y7, yc } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y7 },
              { x: xb, y: y6 },
              { x: xc, y: y6 },
              { x: xc, y: yc },
            ],
            color,
          );
          break;
        }
        case 'lj': {
          const { x1, x6, x7, y1, y2, y4 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y1 },
              { x: x7, y: y1 },
              { x: x7, y: y2 },
              { x: x6, y: y4 },
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
          const { x2, x6, y2, y6 } = this.cellOffsets(cell);
          this.drawing.line({ x: x2, y: y2 }, { x: (x2 + x6) / 2, y: (y2 + y6) / 2 }, color);
          this.drawing.line({ x: x6, y: y2 }, { x: x2, y: (y2 + y6) / 2 }, color);
          this.drawing.line({ x: x2, y: y6 }, { x: (x2 + x6) / 2, y: y2 }, color);
          break;
        }

        case 1: {
          const { x7, xb, y7, yb } = this.cellOffsets(cell);
          this.drawing.line({ x: x7, y: yb }, { x: xb, y: (y7 + yb) / 2 }, color);
          this.drawing.line({ x: xb, y: yb }, { x: (x7 + xb) / 2, y: (y7 + yb) / 2 }, color);
          this.drawing.line({ x: xb, y: y7 }, { x: (x7 + xb) / 2, y: yb }, color);
          break;
        }

        case 2: {
          const { x2, x8, y7, yb } = this.cellOffsets(cell);
          this.drawing.line({ x: x2, y: y7 }, { x: (x2 + x8) / 2, y: yb }, color);
          this.drawing.line({ x: x2, y: yb }, { x: (x2 + x8) / 2, y: (y7 + yb) / 2 }, color);
          this.drawing.line({ x: x8, y: yb }, { x: x2, y: (y7 + yb) / 2 }, color);
          break;
        }

        case 3: {
          const { x7, xb, y2, y6 } = this.cellOffsets(cell);
          this.drawing.line({ x: x7, y: y2 }, { x: xb, y: (y2 + y6) / 2 }, color);
          this.drawing.line({ x: xb, y: y2 }, { x: (x7 + xb) / 2, y: (y2 + y6) / 2 }, color);
          this.drawing.line({ x: xb, y: y6 }, { x: (x7 + xb) / 2, y: y2 }, color);
          break;
        }

        // no default
      }
    }
  }

  protected getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x2, x6, y2, y6 } = this.cellOffsets(cell);

        return { x: x2, y: y2, width: (x6 - x2) * 0.5, height: (y6 - y2) * 0.5 };
      }

      case 1: {
        const { x2, xb, y2, yb } = this.cellOffsets(cell);

        return {
          x: x2 + (xb - x2) * 0.5,
          y: y2 + (yb - y2) * 0.5,
          width: (xb - x2) * 0.5,
          height: (yb - y2) * 0.5,
        };
      }

      case 2: {
        const { x2, x6, y7, yb } = this.cellOffsets(cell);

        return { x: x2, y: y7 + (yb - y7) * 0.5, width: (x6 - x2) * 0.5, height: (yb - y7) * 0.5 };
      }

      case 3: {
        const { x7, xb, y2, y6 } = this.cellOffsets(cell);

        return { x: x7 + (xb - x7) * 0.5, y: y2, width: (xb - x7) * 0.5, height: (y6 - y2) * 0.5 };
      }

      // no default
      default: {
        throw new Error(`Invalid kind: ${this.cellKind(cell)}`);
      }
    }
  }
}
