/* eslint-disable no-implicit-coercion */
import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type Kind,
  type MazeProperties,
} from './maze.ts';
import { OctogonMaze } from './octogon-maze.ts';

const SQ2 = Math.SQRT2;

export class ZetaMaze extends OctogonMaze {
  public constructor({ ...props }: MazeProperties) {
    super({ ...props, cellSize: 30, cellColor: '#B6B6B4', wallColor: 'black' });
  }

  protected override offsets(kind: Kind): Record<string, number> {
    const ao = this.cellSize / Math.sqrt(4 + SQ2 * 2);

    if (kind === 0) {
      const x0 = 0;
      const x1 = x0 + (SQ2 * this.wallSize) / 2;
      const x3 = x0 + this.cellSize / 4;
      const x4 = x0 + (this.cellSize - ao) / 2;
      const x2 = x4 - (SQ2 * this.wallSize) / 2;
      const x5 = x4 + this.wallSize;
      const xb = x0 + this.cellSize;
      const xa = xb - (SQ2 * this.wallSize) / 2;
      const x8 = xb - this.cellSize / 4;
      const x7 = xb - (this.cellSize - ao) / 2;
      const x9 = x7 + (SQ2 * this.wallSize) / 2;
      const x6 = x7 - this.wallSize;

      const y0 = 0;
      const y1 = y0 + (SQ2 * this.wallSize) / 2;
      const y3 = y0 + this.cellSize / 4;
      const y4 = y0 + (this.cellSize - ao) / 2;
      const y2 = y4 - (SQ2 * this.wallSize) / 2;
      const y5 = y4 + this.wallSize;
      const yb = y0 + this.cellSize;
      const ya = yb - (SQ2 * this.wallSize) / 2;
      const y8 = yb - this.cellSize / 4;
      const y7 = yb - (this.cellSize - ao) / 2;
      const y9 = y7 + (SQ2 * this.wallSize) / 2;
      const y6 = y7 - this.wallSize;

      return {
        x0,
        x1,
        x2,
        x3,
        x4,
        x5,
        x6,
        x7,
        x8,
        x9,
        xa,
        xb,
        y0,
        y1,
        y2,
        y3,
        y4,
        y5,
        y6,
        y7,
        y8,
        y9,
        ya,
        yb,
      };
    }

    const x0 = 0;
    const x1 = x0 + Math.sqrt(this.wallSize / 2);
    const x2 = x1 + Math.sqrt(this.wallSize / 2);
    const x4 = x0 + 1 * Math.sqrt((ao * ao) / 2);
    const x3 = x4 - Math.sqrt(this.wallSize / 2);
    const x5 = x4 + Math.sqrt(this.wallSize / 2);
    const x8 = x0 + 2 * Math.sqrt((ao * ao) / 2);
    const x7 = x8 - Math.sqrt(this.wallSize / 2);
    const x6 = x7 - Math.sqrt(this.wallSize / 2);

    const y0 = 0;
    const y1 = y0 + Math.sqrt(this.wallSize / 2);
    const y2 = y1 + Math.sqrt(this.wallSize / 2);
    const y4 = y0 + 1 * Math.sqrt((ao * ao) / 2);
    const y3 = y4 - Math.sqrt(this.wallSize / 2);
    const y5 = y4 + Math.sqrt(this.wallSize / 2);
    const y8 = y0 + 2 * Math.sqrt((ao * ao) / 2);
    const y7 = y8 - Math.sqrt(this.wallSize / 2);
    const y6 = y7 - Math.sqrt(this.wallSize / 2);

    return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
  }

  public override drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      if (this.cellKind(cell) === 0) {
        const { x0, x4, x7, xb, y0, y4, y7, yb } = this.cellOffsets(cell);

        this.drawing.polygon(
          [
            { x: x4, y: y0 },
            { x: x7, y: y0 },
            { x: xb, y: y4 },
            { x: xb, y: y7 },
            { x: x7, y: yb },
            { x: x4, y: yb },
            { x: x0, y: y7 },
            { x: x0, y: y4 },
          ],
          color,
        );
      } else {
        const { x0, x4, x8, y0, y4, y8 } = this.cellOffsets(cell);

        this.drawing.polygon(
          [
            { x: x4, y: y0 },
            { x: x8, y: y4 },
            { x: x4, y: y8 },
            { x: x0, y: y4 },
          ],
          color,
        );
      }
    }
  }

  public override drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      if (this.cellKind(cd) === 0) {
        const { x0, x1, x2, x3, x5, x6, x8, x9, xa, xb, y0, y1, y2, y3, y5, y6, y8, y9, ya, yb } =
          this.cellOffsets(cd);
        switch (cd.direction) {
          case 'a': {
            this.drawing.polygon(
              [
                { x: x5, y: y0 },
                { x: x6, y: y0 },
                { x: x6, y: y3 },
                { x: x5, y: y3 },
              ],
              color,
            );
            break;
          }

          case 'b': {
            this.drawing.polygon(
              [
                { x: x9, y: y1 },
                { x: xa, y: y2 },
                { x: x9, y: y5 },
                { x: x6, y: y3 },
              ],
              color,
            );
            break;
          }

          case 'c': {
            this.drawing.polygon(
              [
                { x: x8, y: y5 },
                { x: xb, y: y5 },
                { x: xb, y: y6 },
                { x: x8, y: y6 },
              ],
              color,
            );
            break;
          }

          case 'd': {
            this.drawing.polygon(
              [
                { x: x8, y: y6 },
                { x: xa, y: y9 },
                { x: x9, y: ya },
                { x: x6, y: y8 },
              ],
              color,
            );
            break;
          }

          case 'e': {
            this.drawing.polygon(
              [
                { x: x5, y: y8 },
                { x: x6, y: y8 },
                { x: x6, y: yb },
                { x: x5, y: yb },
              ],
              color,
            );
            break;
          }

          case 'f': {
            this.drawing.polygon(
              [
                { x: x3, y: y6 },
                { x: x5, y: y8 },
                { x: x2, y: ya },
                { x: x1, y: y9 },
              ],
              color,
            );
            break;
          }

          case 'g': {
            this.drawing.polygon(
              [
                { x: x0, y: y5 },
                { x: x3, y: y5 },
                { x: x3, y: y6 },
                { x: x0, y: y6 },
              ],
              color,
            );
            break;
          }

          case 'h': {
            this.drawing.polygon(
              [
                { x: x2, y: y1 },
                { x: x5, y: y3 },
                { x: x3, y: y5 },
                { x: x1, y: y3 },
              ],
              color,
            );
            break;
          }

          // no default
        }
      } else {
        super.drawWall(cd, color);
      }
    }
  }

  public override drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      if (this.cellKind({ x, y }) === 0) {
        switch (pillar) {
          case 'ab': {
            const { x6, x7, x9, y0, y1, y3 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x6, y: y0 },
                { x: x7, y: y0 },
                { x: x9, y: y1 },
                { x: x6, y: y3 },
              ],
              color,
            );
            break;
          }
          case 'bc': {
            const { x8, xa, xb, y2, y4, y5 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: xa, y: y2 },
                { x: xb, y: y4 },
                { x: xb, y: y5 },
                { x: x8, y: y5 },
              ],
              color,
            );
            break;
          }
          case 'cd': {
            const { x8, xa, xb, y6, y7, y9 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x8, y: y6 },
                { x: xb, y: y6 },
                { x: xb, y: y7 },
                { x: xa, y: y9 },
              ],
              color,
            );
            break;
          }
          case 'de': {
            const { x6, x7, x9, y9, ya, yb } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x6, y: y9 },
                { x: x9, y: ya },
                { x: x7, y: yb },
                { x: x6, y: yb },
              ],
              color,
            );
            break;
          }
          case 'ef': {
            const { x2, x4, x5, y8, ya, yb } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x5, y: y8 },
                { x: x5, y: yb },
                { x: x4, y: yb },
                { x: x2, y: ya },
              ],
              color,
            );
            break;
          }
          case 'fg': {
            const { x0, x1, x3, y6, y7, y9 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x0, y: y6 },
                { x: x3, y: y6 },
                { x: x1, y: y9 },
                { x: x0, y: y7 },
              ],
              color,
            );
            break;
          }
          case 'gh': {
            const { x0, x1, x3, y2, y4, y5 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x1, y: y2 },
                { x: x3, y: y5 },
                { x: x0, y: y5 },
                { x: x0, y: y4 },
              ],
              color,
            );
            break;
          }
          case 'ha': {
            const { x2, x4, x5, y0, y1, y2 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x4, y: y0 },
                { x: x5, y: y0 },
                { x: x5, y: y2 },
                { x: x2, y: y1 },
              ],
              color,
            );
            break;
          }

          // no default
        }
      } else {
        super.drawPillar({ x, y, pillar }, color);
      }
    }
  }

  public override drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      if (this.cellKind(cell) === 0) {
        const { x3, x5, x6, x8, y3, y5, y6, y8 } = this.cellOffsets(cell);

        this.drawing.line({ x: x5, y: y3 }, { x: x6, y: y8 }, color);
        this.drawing.line({ x: x6, y: y3 }, { x: x5, y: y8 }, color);
        this.drawing.line({ x: x3, y: y5 }, { x: x8, y: y6 }, color);
        this.drawing.line({ x: x3, y: y6 }, { x: x8, y: y5 }, color);
      } else {
        super.drawX(cell, color);
      }
    }
  }

  public override getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x3, x8, y3, y8 } = this.cellOffsets(cell);

        return { x: x3, y: y3, w: x8 - x3, h: y8 - y3 };
      }
      case 1: {
        const { x2, x6, y2, y6 } = this.cellOffsets(cell);

        return { x: x2, y: y2, w: x6 - x2, h: y6 - y2 };
      }

      default: {
        throw new Error(`Invalid cell kind: ${this.cellKind(cell)}`);
      }
    }
  }
}
