/* eslint-disable @typescript-eslint/class-methods-use-this */
import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
} from './maze.ts';
import { Maze } from './maze.ts';
import {
  directionMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pathMatrix,
  pillarMatrix,
  preferredMatrix,
  rightTurnMatrix,
  straightMatrix,
  wallMatrix,
} from './octogon-matrix.ts';

export class OctogonMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      directionMatrix,
      pillarMatrix,
      wallMatrix,
      oppositeMatrix,
      rightTurnMatrix,
      leftTurnMatrix,
      straightMatrix,
      moveMatrix,
      preferredMatrix,
      pathMatrix,
    );
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      horizontalCellsPerGroup: 2,
      groupHeight: this.cellSize,
      rightPadding: this.cellSize * 0.25,
      bottomPadding: this.cellSize * 0.25,
    };
  }

  public cellKind(cell: Cell): number {
    return modulo(cell.x, 2);
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    switch (this.cellKind(cell)) {
      case 0: {
        return this.translateOffsets(cell, cell.x * this.cellSize * 0.5, cell.y * this.cellSize);
      }

      default: {
        const ao = this.cellSize / (1 + Math.SQRT2);

        return this.translateOffsets(
          cell,
          ((cell.x - 1) * this.cellSize) / 2 + this.cellSize - Math.sqrt((ao * ao) / 2),
          cell.y * this.cellSize + this.cellSize - Math.sqrt((ao * ao) / 2),
        );
      }
    }
  }

  protected offsets(kind: Kind): Record<string, number> {
    const ao = this.cellSize / (1 + Math.SQRT2);
    const ai = (this.cellSize - this.wallSize * 2) / (1 + Math.SQRT2);

    if (kind === 0) {
      const x0 = 0;
      const x2 = x0 + this.wallSize;
      const x5 = x0 + ao / Math.SQRT2;
      const x3 = x0 + Math.sqrt(2 * this.wallSize ** 2);
      const x1 = x0 + Math.sqrt(2 * this.wallSize ** 2) / 2;

      const x6 = x5 + (ao - ai) / 2;
      const x4 = x6 - Math.sqrt(2 * this.wallSize ** 2) / 2;
      const x7 = x5 + this.wallSize;

      const xf = x0 + this.cellSize;
      const xd = xf - this.wallSize;
      const xa = xf - ao / Math.SQRT2;
      const xc = xf - Math.sqrt(2 * this.wallSize ** 2);
      const xe = xf - Math.sqrt(2 * this.wallSize ** 2) / 2;

      const x9 = xa - (ao - ai) / 2;
      const xb = x9 + Math.sqrt(2 * this.wallSize ** 2) / 2;
      const x8 = x9 - this.wallSize;

      const y0 = 0;
      const y2 = y0 + this.wallSize;
      const y5 = y0 + ao / Math.SQRT2;
      const y3 = y0 + Math.sqrt(2 * this.wallSize ** 2);
      const y1 = y0 + Math.sqrt(2 * this.wallSize ** 2) / 2;

      const y6 = y5 + (ao - ai) / 2;
      const y4 = y6 - Math.sqrt(2 * this.wallSize ** 2) / 2;
      const y7 = y6 + this.wallSize;

      const yf = y0 + this.cellSize;
      const yd = yf - this.wallSize;
      const ya = yf - ao / Math.SQRT2;
      const yc = yf - Math.sqrt(2 * this.wallSize ** 2);
      const ye = yf - Math.sqrt(2 * this.wallSize ** 2) / 2;

      const y9 = ya - (ao - ai) / 2;
      const yb = y9 + Math.sqrt(2 * this.wallSize ** 2) / 2;
      const y8 = y9 - this.wallSize;

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
        xc,
        xd,
        xe,
        xf,
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
        yc,
        yd,
        ye,
        yf,
      };
    }

    const x0 = 0;
    const x1 = x0 + Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const x2 = x1 + Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const x4 = x0 + Math.sqrt(ao ** 2 / 2);
    const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const x5 = x4 + Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const x8 = x0 + Math.sqrt(ao ** 2 / 2) * 2;
    const x7 = x8 - Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const x6 = x7 - Math.sqrt(this.wallSize ** 2 * 2) / 2;

    const y0 = 0;
    const y1 = y0 + Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const y2 = y1 + Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const y4 = y0 + Math.sqrt(ao ** 2 / 2);
    const y3 = y4 - Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const y5 = y4 + Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const y8 = y0 + Math.sqrt(ao ** 2 / 2) * 2;
    const y7 = y8 - Math.sqrt(this.wallSize ** 2 * 2) / 2;
    const y6 = y7 - Math.sqrt(this.wallSize ** 2 * 2) / 2;

    return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      if (this.cellKind(cell) === 0) {
        const { x0, x5, xa, xf, y0, y5, ya, yf } = this.cellOffsets(cell);

        this.drawing.polygon(
          [
            { x: x5, y: y0 },
            { x: xa, y: y0 },
            { x: xf, y: y5 },
            { x: xf, y: ya },
            { x: xa, y: yf },
            { x: x5, y: yf },
            { x: x0, y: ya },
            { x: x0, y: y5 },
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

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      if (this.cellKind(cd) === 0) {
        switch (cd.direction) {
          case 'a': {
            const { x7, x8, y0, y2 } = this.cellOffsets(cd);
            this.drawing.rect({ x: x7, y: y0 }, { x: x8, y: y2 }, color);
            break;
          }

          case 'b': {
            const { xa, xb, xc, xe, y1, y3, y4, y5 } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: xa, y: y3 },
                { x: xb, y: y1 },
                { x: xe, y: y4 },
                { x: xc, y: y5 },
              ],
              color,
            );
            break;
          }

          case 'c': {
            const { xd, xf, y7, y8 } = this.cellOffsets(cd);
            this.drawing.rect({ x: xd, y: y7 }, { x: xf, y: y8 }, color);
            break;
          }

          case 'd': {
            const { xa, xb, xc, xe, ya, yb, yc, ye } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: xa, y: yc },
                { x: xc, y: ya },
                { x: xe, y: yb },
                { x: xb, y: ye },
              ],
              color,
            );
            break;
          }

          case 'e': {
            const { x7, x8, yd, yf } = this.cellOffsets(cd);
            this.drawing.rect({ x: x7, y: yd }, { x: x8, y: yf }, color);
            break;
          }

          case 'f': {
            const { x1, x3, x4, x5, ya, yb, yc, ye } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: x1, y: yb },
                { x: x3, y: ya },
                { x: x5, y: yc },
                { x: x4, y: ye },
              ],
              color,
            );
            break;
          }

          case 'g': {
            const { x0, x2, y7, y8 } = this.cellOffsets(cd);
            this.drawing.rect({ x: x0, y: y7 }, { x: x2, y: y8 }, color);
            break;
          }

          case 'h': {
            const { x1, x3, x4, x5, y1, y3, y4, y5 } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: x1, y: y4 },
                { x: x4, y: y1 },
                { x: x5, y: y3 },
                { x: x3, y: y5 },
              ],
              color,
            );
            break;
          }

          // no default
        }
      } else {
        switch (cd.direction) {
          case 'i': {
            const { x4, x5, x6, x7, y1, y2, y3, y4 } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: x4, y: y2 },
                { x: x5, y: y1 },
                { x: x7, y: y3 },
                { x: x6, y: y4 },
              ],
              color,
            );
            break;
          }

          case 'j': {
            const { x4, x5, x6, x7, y4, y5, y6, y7 } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: x6, y: y4 },
                { x: x7, y: y5 },
                { x: x5, y: y7 },
                { x: x4, y: y6 },
              ],
              color,
            );
            break;
          }

          case 'k': {
            const { x1, x2, x3, x4, y4, y5, y6, y7 } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: x2, y: y4 },
                { x: x4, y: y6 },
                { x: x3, y: y7 },
                { x: x1, y: y5 },
              ],
              color,
            );
            break;
          }

          case 'l': {
            const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);
            this.drawing.polygon(
              [
                { x: x1, y: y3 },
                { x: x3, y: y1 },
                { x: x4, y: y2 },
                { x: x2, y: y4 },
              ],
              color,
            );
            break;
          }

          // no default
        }
      }
    }
  }

  public drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      if (this.cellKind({ x, y }) === 0) {
        switch (pillar) {
          case 'ab': {
            const { x8, x9, xa, xb, y0, y1, y2, y3 } = this.cellOffsets({ x, y });

            this.drawing.polygon(
              [
                { x: x8, y: y0 },
                { x: xa, y: y0 },
                { x: xb, y: y1 },
                { x: xa, y: y3 },
                { x: x9, y: y2 },
                { x: x8, y: y2 },
              ],
              color,
            );
            break;
          }

          case 'bc': {
            const { xc, xd, xe, xf, y4, y5, y6, y7 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: xe, y: y4 },
                { x: xf, y: y5 },
                { x: xf, y: y7 },
                { x: xd, y: y7 },
                { x: xd, y: y6 },
                { x: xc, y: y5 },
              ],
              color,
            );
            break;
          }

          case 'cd': {
            const { xc, xd, xe, xf, y8, y9, ya, yb } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: xd, y: y8 },
                { x: xf, y: y8 },
                { x: xf, y: ya },
                { x: xe, y: yb },
                { x: xc, y: ya },
                { x: xd, y: y9 },
              ],
              color,
            );
            break;
          }

          case 'de': {
            const { x8, x9, xa, xb, yc, yd, ye, yf } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x8, y: yd },
                { x: x9, y: yd },
                { x: xa, y: yc },
                { x: xb, y: ye },
                { x: xa, y: yf },
                { x: x8, y: yf },
              ],
              color,
            );
            break;
          }

          case 'ef': {
            const { x4, x5, x6, x7, yc, yd, ye, yf } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x5, y: yc },
                { x: x6, y: yd },
                { x: x7, y: yd },
                { x: x7, y: yf },
                { x: x5, y: yf },
                { x: x4, y: ye },
              ],
              color,
            );
            break;
          }

          case 'fg': {
            const { x0, x1, x2, x3, y8, y9, ya, yb } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x0, y: y8 },
                { x: x2, y: y8 },
                { x: x2, y: y9 },
                { x: x3, y: ya },
                { x: x1, y: yb },
                { x: x0, y: ya },
              ],
              color,
            );
            break;
          }

          case 'gh': {
            const { x0, x1, x2, y4, y5, y6, y7 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x0, y: y5 },
                { x: x1, y: y4 },
                { x: x2, y: y6 },
                { x: x2, y: y7 },
                { x: x0, y: y7 },
              ],
              color,
            );
            break;
          }

          case 'ha': {
            const { x4, x5, x6, x7, y0, y1, y2, y3 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x6, y: y0 },
                { x: x7, y: y0 },
                { x: x7, y: y2 },
                { x: x6, y: y2 },
                { x: x5, y: y3 },
                { x: x4, y: y1 },
              ],
              color,
            );
            break;
          }

          // no default
        }
      } else {
        switch (pillar) {
          case 'ij': {
            const { x6, x7, x8, y3, y4, y5 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x7, y: y3 },
                { x: x8, y: y4 },
                { x: x7, y: y5 },
                { x: x6, y: y4 },
              ],
              color,
            );
            break;
          }

          case 'jk': {
            const { x3, x4, x5, y6, y7, y8 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x4, y: y6 },
                { x: x5, y: y7 },
                { x: x4, y: y8 },
                { x: x3, y: y7 },
              ],
              color,
            );
            break;
          }

          case 'kl': {
            const { x0, x1, x2, y3, y4, y5 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x1, y: y3 },
                { x: x2, y: y4 },
                { x: x1, y: y5 },
                { x: x0, y: y4 },
              ],
              color,
            );
            break;
          }

          case 'li': {
            const { x3, x4, x5, y0, y1, y2 } = this.cellOffsets({ x, y });
            this.drawing.polygon(
              [
                { x: x4, y: y0 },
                { x: x5, y: y1 },
                { x: x4, y: y2 },
                { x: x3, y: y1 },
              ],
              color,
            );
            break;
          }

          // no default
        }
      }
    }
  }

  public drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      if (this.cellKind(cell) === 0) {
        const { x2, x6, x9, xd, y2, y6, y9, yd } = this.cellOffsets(cell);

        this.drawing.line({ x: x2, y: y9 }, { x: xd, y: y6 }, color);
        this.drawing.line({ x: x2, y: y6 }, { x: xd, y: y9 }, color);
        this.drawing.line({ x: x6, y: y2 }, { x: x9, y: yd }, color);
        this.drawing.line({ x: x6, y: yd }, { x: x9, y: y2 }, color);
      } else {
        const { x2, x4, x6, y2, y4, y6 } = this.cellOffsets(cell);

        this.drawing.line({ x: x2, y: y4 }, { x: x6, y: y4 }, color);
        this.drawing.line({ x: x4, y: y2 }, { x: x4, y: y6 }, color);
      }
    }
  }

  public getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x2, xd, y2, yd } = this.cellOffsets(cell);

        return { x: x2, y: y2, w: xd - x2, h: yd - y2 };
      }
      case 1: {
        const { x2, x6, y2, y6 } = this.cellOffsets(cell);

        return { x: x2, y: y2, w: x6 - x2, h: y6 - y2 };
      }

      default: {
        throw new Error(`"${this.cellKind(cell)}" is not a valid cell kind`);
      }
    }
  }
}
