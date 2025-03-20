/* eslint-disable no-implicit-coercion */
import {
  type Cell,
  type CellCorner,
  type CellDirection,
  type Direction,
  type MazeProperties,
  type Overrides,
  type Wall,
} from './maze.js';
import { Maze } from './maze.js';

const SQ2 = Math.SQRT2;

export class OctogonMaze extends Maze {
  public constructor({ cellSize = 30, wallSize = 3, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
      ['ab', 'bc', 'cd', 'de', 'ef', 'fg', 'gh', 'ha', 'ij', 'jk', 'kl', 'li'],
    );
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize / 2, this.cellSize / 2];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, this.cellSize / 2];
  }

  // eslint--next-line @typescript-eslint/class-methods-use-this
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected cellKind(cell: Cell): number {
    return cell.x % 2;
  }

  protected initialWalls(x: number, y: number): Wall {
    return this.cellKind({ x, y }) === 0 ?
        { a: true, b: true, c: true, d: true, e: true, f: true, g: true, h: true }
      : { i: true, j: true, k: true, l: true };
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public opposite(direction: Direction): Direction {
    switch (direction) {
      case 'a': {
        return 'e';
      }
      case 'b': {
        return 'k';
      }
      case 'c': {
        return 'g';
      }
      case 'd': {
        return 'l';
      }
      case 'e': {
        return 'a';
      }
      case 'f': {
        return 'i';
      }
      case 'g': {
        return 'c';
      }
      case 'h': {
        return 'j';
      }
      case 'i': {
        return 'f';
      }
      case 'j': {
        return 'h';
      }
      case 'k': {
        return 'b';
      }
      case 'l': {
        return 'd';
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public rightTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'a': {
        return ['d', 'c', 'b', 'a', 'h', 'g', 'f', 'e'];
      }
      case 'b': {
        return ['j', 'i', 'l', 'k'];
      }
      case 'c': {
        return ['f', 'e', 'd', 'c', 'b', 'a', 'h', 'g'];
      }
      case 'd': {
        return ['k', 'j', 'i', 'l'];
      }
      case 'e': {
        return ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
      }
      case 'f': {
        return ['l', 'k', 'j', 'i'];
      }
      case 'g': {
        return ['b', 'a', 'h', 'g', 'f', 'e', 'd', 'c'];
      }
      case 'h': {
        return ['i', 'l', 'k', 'j'];
      }
      case 'i': {
        return ['e', 'd', 'c', 'b', 'a', 'h', 'g', 'f'];
      }
      case 'j': {
        return ['g', 'f', 'e', 'd', 'c', 'b', 'a', 'h'];
      }
      case 'k': {
        return ['a', 'h', 'g', 'f', 'e', 'd', 'c', 'b'];
      }
      case 'l': {
        return ['c', 'b', 'a', 'h', 'g', 'f', 'e', 'd'];
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public leftTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'a': {
        return ['f', 'g', 'h', 'a', 'b', 'c', 'd', 'e'];
      }
      case 'b': {
        return ['l', 'i', 'j', 'k'];
      }
      case 'c': {
        return ['h', 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
      }
      case 'd': {
        return ['i', 'j', 'k', 'l'];
      }
      case 'e': {
        return ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'a'];
      }
      case 'f': {
        return ['j', 'k', 'l', 'i'];
      }
      case 'g': {
        return ['d', 'e', 'f', 'g', 'h', 'a', 'b', 'c'];
      }
      case 'h': {
        return ['k', 'l', 'i', 'j'];
      }
      case 'i': {
        return ['g', 'h', 'a', 'b', 'c', 'd', 'e', 'f'];
      }
      case 'j': {
        return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      }
      case 'k': {
        return ['c', 'd', 'e', 'f', 'g', 'h', 'a', 'b'];
      }
      case 'l': {
        return ['e', 'f', 'g', 'h', 'a', 'b', 'c', 'd'];
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  public move(cell: Cell, direction: Direction): CellDirection | null {
    if (this.cellKind(cell) === 0) {
      switch (direction) {
        case 'a': {
          return { x: cell.x, y: cell.y - 1, direction };
        }
        case 'b': {
          return { x: cell.x + 1, y: cell.y - 1, direction };
        }
        case 'c': {
          return { x: cell.x + 2, y: cell.y, direction };
        }
        case 'd': {
          return { x: cell.x + 1, y: cell.y, direction };
        }
        case 'e': {
          return { x: cell.x, y: cell.y + 1, direction };
        }
        case 'f': {
          return { x: cell.x - 1, y: cell.y, direction };
        }
        case 'g': {
          return { x: cell.x - 2, y: cell.y, direction };
        }

        case 'h': {
          return { x: cell.x - 1, y: cell.y - 1, direction };
        }

        // no default
      }
    } else {
      switch (direction) {
        case 'i': {
          return { x: cell.x + 1, y: cell.y, direction };
        }
        case 'j': {
          return { x: cell.x + 1, y: cell.y + 1, direction };
        }
        case 'k': {
          return { x: cell.x - 1, y: cell.y + 1, direction };
        }
        case 'l': {
          return { x: cell.x - 1, y: cell.y, direction };
        }

        // no default
      }
    }
    return null;
  }

  public isDeadEnd(cell: Cell): boolean {
    return (
      this.sides(cell) === (this.cellKind(cell) === 0 ? 7 : 3) &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell, { walls = this.walls }: Overrides = {}): string[] {
    return this.neighbors(cell, {
      directions: this.cellKind(cell) === 0 ? ['c', 'd', 'e'] : ['j'],
      walls,
    }).map((cd) => cd.direction);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public divider(_cell1: Cell, _cell2: Cell): CellDirection[] {
    throw new Error('not implemented for zeta');
  }

  protected offsets({ x, y }: Cell): Record<string, number> {
    const ao = this.cellSize / Math.sqrt(4 + SQ2 * 2);
    const ai = (this.cellSize - this.wallSize * 2) / Math.sqrt(4 + SQ2 * 2);

    if (this.cellKind({ x, y }) === 0) {
      const x0 = (x * this.cellSize) / 2;
      const x1 = x0 + (SQ2 * this.wallSize) / 2;
      const x2 = x0 + this.wallSize;
      const x3 = x0 + SQ2 * this.wallSize;
      const x5 = x0 + Math.sqrt((ao * ao) / 2);
      const x6 = x5 + (ao - ai) / 2;
      const x4 = x6 - (this.wallSize * SQ2) / 2;
      const x7 = x6 + this.wallSize;

      const xf = x0 + this.cellSize;
      const xe = xf - (SQ2 * this.wallSize) / 2;
      const xd = xf - this.wallSize;
      const xc = xf - SQ2 * this.wallSize;
      const xa = xf - Math.sqrt((ao * ao) / 2);
      const x9 = xa - (ao - ai) / 2;
      const xb = x9 + (this.wallSize * SQ2) / 2;
      const x8 = x9 - this.wallSize;

      const y0 = y * this.cellSize;
      const y1 = y0 + (SQ2 * this.wallSize) / 2;
      const y2 = y0 + this.wallSize;
      const y3 = y0 + SQ2 * this.wallSize;
      const y5 = y0 + Math.sqrt((ao * ao) / 2);
      const y6 = y5 + (ao - ai) / 2;
      const y4 = y6 - (this.wallSize * SQ2) / 2;
      const y7 = y6 + this.wallSize;

      const yf = y0 + this.cellSize;
      const ye = yf - (SQ2 * this.wallSize) / 2;
      const yd = yf - this.wallSize;
      const yc = yf - SQ2 * this.wallSize;
      const ya = yf - Math.sqrt((ao * ao) / 2);
      const y9 = ya - (ao - ai) / 2;
      const yb = y9 + (this.wallSize * SQ2) / 2;
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

    const x0 = ((x - 1) * this.cellSize) / 2 + this.cellSize - Math.sqrt((ao * ao) / 2);
    const x1 = x0 + Math.sqrt(this.wallSize / 2);
    const x2 = x1 + Math.sqrt(this.wallSize / 2);
    const x4 = x0 + 1 * Math.sqrt((ao * ao) / 2);
    const x3 = x4 - Math.sqrt(this.wallSize / 2);
    const x5 = x4 + Math.sqrt(this.wallSize / 2);
    const x8 = x0 + 2 * Math.sqrt((ao * ao) / 2);
    const x7 = x8 - Math.sqrt(this.wallSize / 2);
    const x6 = x7 - Math.sqrt(this.wallSize / 2);

    const y0 = y * this.cellSize + this.cellSize - Math.sqrt((ao * ao) / 2);
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

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      if (this.cellKind(cell) === 0) {
        const { x0, x5, x6, xa, xf, y0, y5, ya, yf } = this.offsets(cell);

        this.drawing.polygon(
          [
            { x: x5, y: y0 },
            { x: xa, y: y0 },
            { x: xf, y: y5 },
            { x: xf, y: ya },
            { x: xa, y: yf },
            { x: x6, y: yf },
            { x: x0, y: ya },
            { x: x0, y: y5 },
          ],
          color,
        );
      } else {
        const { x0, x4, x8, y0, y4, y8 } = this.offsets(cell);

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
            const { x5, x9, xa, y0, y2 } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x5, y: y0 },
                { x: xa, y: y0 },
                { x: x9, y: y2 },
                { x: x5, y: y2 },
              ],
              color,
            );
            break;
          }

          case 'b': {
            const { x9, xa, xd, xf, y0, y2, y5, y6 } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: xa, y: y0 },
                { x: xf, y: y5 },
                { x: xd, y: y6 },
                { x: x9, y: y2 },
              ],
              color,
            );
            break;
          }

          case 'c': {
            const { xd, xf, y5, y6, y9, ya } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: xd, y: y6 },
                { x: xf, y: y5 },
                { x: xf, y: ya },
                { x: xd, y: y9 },
              ],
              color,
            );
            break;
          }

          case 'd': {
            const { x9, xa, xd, xf, y9, ya, yd, yf } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: xd, y: y9 },
                { x: xf, y: ya },
                { x: xa, y: yf },
                { x: x9, y: yd },
              ],
              color,
            );
            break;
          }

          case 'e': {
            const { x5, x6, x9, xa, yd, yf } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x6, y: yd },
                { x: x9, y: yd },
                { x: xa, y: yf },
                { x: x5, y: yf },
              ],
              color,
            );
            break;
          }

          case 'f': {
            const { x0, x2, x5, x6, y9, ya, yd, yf } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x2, y: y9 },
                { x: x6, y: yd },
                { x: x5, y: yf },
                { x: x0, y: ya },
              ],
              color,
            );
            break;
          }

          case 'g': {
            const { x0, x2, y5, y6, y9, ya } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x0, y: y5 },
                { x: x2, y: y6 },
                { x: x2, y: y9 },
                { x: x0, y: ya },
              ],
              color,
            );
            break;
          }

          case 'h': {
            const { x0, x2, x5, x6, y0, y2, y5, y6 } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x5, y: y0 },
                { x: x6, y: y2 },
                { x: x2, y: y6 },
                { x: x0, y: y5 },
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
            const { x4, x5, x6, x7, y1, y3 } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x5, y: y1 },
                { x: x7, y: y3 },
                { x: x6, y: y3 },
                { x: x4, y: y1 },
              ],
              color,
            );
            break;
          }

          case 'j': {
            const { x4, x5, x6, x7, y4, y5, y6, y7 } = this.offsets(cd);
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
            const { x1, x2, x3, x4, y4, y5, y6, y7 } = this.offsets(cd);
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
            const { x1, x2, x3, x4, y1, y2, y3, y5 } = this.offsets(cd);
            this.drawing.polygon(
              [
                { x: x3, y: y1 },
                { x: x4, y: y2 },
                { x: x2, y: y5 },
                { x: x1, y: y3 },
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

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      if (this.cellKind({ x, y }) === 0) {
        switch (corner) {
          case 'ab': {
            const { x8, x9, xa, xb, y0, y1, y2, y3 } = this.offsets({ x, y });

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
            const { xc, xd, xe, xf, y4, y5, y6, y7 } = this.offsets({ x, y });
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
            const { xc, xd, xe, xf, y8, y9, ya, yb } = this.offsets({ x, y });
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
            const { x8, x9, xa, xb, yc, yd, ye, yf } = this.offsets({ x, y });
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
            const { x4, x5, x6, x7, yc, yd, ye, yf } = this.offsets({ x, y });
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
            const { x0, x1, x2, x3, y8, y9, ya, yb } = this.offsets({ x, y });
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
            const { x0, x1, x2, y4, y5, y6, y7 } = this.offsets({ x, y });
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
            const { x4, x5, x6, x7, y0, y1, y2, y3 } = this.offsets({ x, y });
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
        switch (corner) {
          case 'ij': {
            const { x6, x7, x8, y3, y4, y5 } = this.offsets({ x, y });
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
            const { x3, x4, x5, y6, y7, y8 } = this.offsets({ x, y });
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
            const { x0, x1, x2, y3, y4, y5 } = this.offsets({ x, y });
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
            const { x3, x4, x5, y0, y1, y2 } = this.offsets({ x, y });
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

  public drawPath(cell: CellDirection, color = 'deepSkyBlue'): void {
    if (this.drawing) {
      this.drawCell(cell);

      if (this.cellKind(cell) === 0) {
        switch (cell.direction) {
          case 'a': {
            const { x6, x9, y2, yd } = this.offsets(cell);

            this.drawing.polygon(
              [
                { x: x6, y: yd },
                { x: (x6 + x9) / 2, y: y2 },
                { x: x9, y: yd },
              ],
              color,
            );
            break;
          }
          case 'b': {
            const { x3, x5, xa, xc, y3, y5, ya, yc } = this.offsets(cell);
            this.drawing.polygon(
              [
                { x: x3, y: ya },
                { x: (xa + xc) / 2, y: (y3 + y5) / 2 },
                { x: x5, y: yc },
              ],
              color,
            );

            break;
          }

          case 'c': {
            const { x2, xd, y7, y8 } = this.offsets(cell);

            this.drawing.polygon(
              [
                { x: x2, y: y7 },
                { x: xd, y: (y7 + y8) / 2 },
                { x: x2, y: y8 },
              ],
              color,
            );
            break;
          }

          case 'd': {
            const { x3, x6, xa, xc, y3, y5, ya, yc } = this.offsets(cell);

            this.drawing.polygon(
              [
                { x: x3, y: y5 },
                { x: (xa + xc) / 2, y: (ya + yc) / 2 },
                { x: x6, y: y3 },
              ],
              color,
            );
            break;
          }

          case 'e': {
            const { x6, x9, y2, yd } = this.offsets(cell);

            this.drawing.polygon(
              [
                { x: x6, y: y2 },
                { x: (x6 + x9) / 2, y: yd },
                { x: x9, y: y2 },
              ],
              color,
            );
            break;
          }

          case 'f': {
            const { x3, x5, xa, xc, y3, y5, ya, yc } = this.offsets(cell);
            this.drawing.polygon(
              [
                { x: xa, y: y3 },
                { x: (x3 + x5) / 2, y: (ya + yc) / 2 },
                { x: xc, y: y5 },
              ],
              color,
            );

            break;
          }

          case 'g': {
            const { x2, xd, y7, y8 } = this.offsets(cell);

            this.drawing.polygon(
              [
                { x: xd, y: y7 },
                { x: x2, y: (y7 + y8) / 2 },
                { x: xd, y: y8 },
              ],
              color,
            );
            break;
          }

          case 'h': {
            const { x3, x6, xa, xc, y3, y5, ya, yc } = this.offsets(cell);

            this.drawing.polygon(
              [
                { x: xa, y: yc },
                { x: (x3 + x6) / 2, y: (y3 + y5) / 2 },
                { x: xc, y: ya },
              ],
              color,
            );
            break;
          }

          // no default
        }
      } else {
        const { x2, x4, x6, y2, y4, y6 } = this.offsets(cell);

        switch (cell.direction) {
          case 'i': {
            this.drawing.polygon(
              [
                { x: x2, y: y4 },
                { x: (x4 + x6) / 2, y: (y2 + y4) / 2 },
                { x: x4, y: y6 },
              ],
              color,
            );
            break;
          }

          case 'j': {
            this.drawing.polygon(
              [
                { x: x4, y: y2 },
                { x: (x4 + x6) / 2, y: (y4 + y6) / 2 },
                { x: x2, y: y4 },
              ],
              color,
            );

            break;
          }

          case 'k': {
            this.drawing.polygon(
              [
                { x: x4, y: y2 },
                { x: (x2 + x4) / 2, y: (y4 + y6) / 2 },
                { x: x6, y: y4 },
              ],
              color,
            );
            break;
          }

          case 'l': {
            this.drawing.polygon(
              [
                { x: x4, y: y6 },
                { x: (x2 + x4) / 2, y: (y2 + y4) / 2 },
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
  }

  public drawX(cell: Cell, color = 'red', cellColor = this.cellColor): void {
    if (this.drawing) {
      if (this.cellKind(cell) === 0) {
        this.drawCell(cell, cellColor);
        const { x2, x6, x9, xd, y2, y6, y9, yd } = this.offsets(cell);

        this.drawing.line({ x: x2, y: y9 }, { x: xd, y: y6 }, color);
        this.drawing.line({ x: x2, y: y6 }, { x: xd, y: y9 }, color);
        this.drawing.line({ x: x6, y: y2 }, { x: x9, y: yd }, color);
        this.drawing.line({ x: x6, y: yd }, { x: x9, y: y2 }, color);
      } else {
        this.drawCell(cell, cellColor);
        const { x2, x4, x6, y2, y4, y6 } = this.offsets(cell);

        this.drawing.line({ x: x2, y: y4 }, { x: x6, y: y4 }, color);
        this.drawing.line({ x: x4, y: y2 }, { x: x4, y: y6 }, color);
      }
    }
  }
}
