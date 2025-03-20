import range from 'lodash/range';

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

const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
const SIN60 = Math.sin(Math.PI / 3);

export class HexagonMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      ['a', 'b', 'c', 'd', 'e', 'f'],
      ['ab', 'bc', 'cd', 'de', 'ef', 'fa'],
    );
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize * 0.75, this.cellSize * 0.5];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize * SIN60, (this.cellSize * SIN60) / 20];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected cellKind(_cell: Cell): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected initialWalls(): Wall {
    return { a: true, b: true, c: true, d: true, e: true, f: true };
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public opposite(direction: Direction): Direction {
    switch (direction) {
      case 'a': {
        return 'd';
      }
      case 'b': {
        return 'e';
      }
      case 'c': {
        return 'f';
      }
      case 'd': {
        return 'a';
      }
      case 'e': {
        return 'b';
      }
      case 'f': {
        return 'c';
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
        return ['c', 'b', 'a', 'f', 'e', 'd'];
      }
      case 'b': {
        return ['d', 'c', 'b', 'a', 'f', 'e'];
      }
      case 'c': {
        return ['e', 'd', 'c', 'b', 'a', 'f'];
      }
      case 'd': {
        return ['f', 'e', 'd', 'c', 'b', 'a'];
      }
      case 'e': {
        return ['a', 'f', 'e', 'd', 'c', 'b'];
      }
      case 'f': {
        return ['b', 'a', 'f', 'e', 'd', 'c'];
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
        return ['e', 'f', 'a', 'b', 'c', 'd'];
      }
      case 'b': {
        return ['f', 'a', 'b', 'c', 'd', 'e'];
      }
      case 'c': {
        return ['a', 'b', 'c', 'd', 'e', 'f'];
      }
      case 'd': {
        return ['b', 'c', 'd', 'e', 'f', 'a'];
      }
      case 'e': {
        return ['c', 'd', 'e', 'f', 'a', 'b'];
      }
      case 'f': {
        return ['d', 'e', 'f', 'a', 'b', 'c'];
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public move(cell: Cell, direction: Direction): CellDirection {
    if (cell.x % 2 === 0) {
      switch (direction) {
        case 'a': {
          return { x: cell.x, y: cell.y - 1, direction };
        }
        case 'b': {
          return { x: cell.x + 1, y: cell.y - 1, direction };
        }
        case 'c': {
          return { x: cell.x + 1, y: cell.y, direction };
        }
        case 'd': {
          return { x: cell.x, y: cell.y + 1, direction };
        }
        case 'e': {
          return { x: cell.x - 1, y: cell.y, direction };
        }
        case 'f': {
          return { x: cell.x - 1, y: cell.y - 1, direction };
        }
        default: {
          throw new Error(`"${direction}" is not a valid direction`);
        }
      }
    }

    switch (direction) {
      case 'a': {
        return { x: cell.x, y: cell.y - 1, direction };
      }
      case 'b': {
        return { x: cell.x + 1, y: cell.y, direction };
      }
      case 'c': {
        return { x: cell.x + 1, y: cell.y + 1, direction };
      }
      case 'd': {
        return { x: cell.x, y: cell.y + 1, direction };
      }
      case 'e': {
        return { x: cell.x - 1, y: cell.y + 1, direction };
      }
      case 'f': {
        return { x: cell.x - 1, y: cell.y, direction };
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  public isDeadEnd(
    cell: Cell,
    { directions = this.directions, walls = this.walls }: Overrides = {},
  ): boolean {
    return (
      this.sides(cell, { directions, walls }) === 5 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell, { walls = this.walls }: Overrides = {}): string[] {
    return this.neighbors(cell, { directions: ['b', 'c', 'd'], walls }).map((cd) => cd.direction);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
    if (cell1.x === cell2.x) {
      const walls: CellDirection[] = range(cell1.y, cell2.y).flatMap((y) => [
        { x: cell1.x, y, direction: 'b' },
        { x: cell1.x, y, direction: 'c' },
      ]);

      if (cell1.x % 2 === 0) {
        walls.shift();
      } else {
        walls.pop();
      }

      return walls;
    } else if (cell1.y === cell2.y) {
      const walls: CellDirection[] = range(cell1.x, cell2.x).flatMap((x) =>
        x % 2 === 0 ?
          { x, y: cell1.y, direction: 'd' }
        : [
            { x, y: cell1.y, direction: 'e' },
            { x, y: cell1.y, direction: 'd' },
            { x, y: cell1.y, direction: 'c' },
          ],
      );

      if (cell1.x % 2 === 1) {
        walls.shift();
      } else {
        walls.pop();
      }

      return walls;
    }

    throw new Error('Cells must be aligned vertically or horizontally');
  }

  private offsets({ x, y }: Cell): {
    x0: number;
    x1: number;
    x2: number;
    x3: number;
    x4: number;
    x5: number;
    x6: number;
    x7: number;
    x8: number;
    x9: number;
    xA: number;
    xB: number;
    y0: number;
    y1: number;
    y2: number;
    y3: number;
    y4: number;
    y5: number;
    y6: number;
    y7: number;
    y8: number;
  } {
    //const margin = Math.floor(this.cellSize / 8);
    const even = x % 2 === 0;

    const x0 = x * this.cellSize * 0.75;
    const x1 = x0 + (this.wallSize * TAN30) / 2;
    const x2 = x0 + this.wallSize / COS30;
    const x4 = x0 + this.cellSize * 0.25;
    const x5 = x4 + this.wallSize * TAN30;
    const x3 = x4 - (this.wallSize * TAN30) / 2;
    const x7 = x0 + this.cellSize * 0.75;
    const x6 = x7 - this.wallSize * TAN30;
    const x8 = x7 + (this.wallSize * TAN30) / 2;
    const xB = x0 + this.cellSize;
    const xA = xB - (this.wallSize * TAN30) / 2; // corner bc
    const x9 = xB - this.wallSize / COS30;

    const y0 = y * this.cellSize * SIN60 + (even ? 0 : (this.cellSize * SIN60) / 2);
    const y1 = y0 + this.wallSize / 2;
    const y2 = y0 + this.wallSize;

    const y4 = y0 + (this.cellSize * SIN60) / 2;
    const y3 = y4 - this.wallSize / 2;
    const y5 = y4 + this.wallSize / 2;

    const y8 = y0 + this.cellSize * SIN60;
    const y7 = y8 - this.wallSize / 2;
    const y6 = y8 - this.wallSize;

    return { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xA, xB, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x3, x8, xB, y0, y4, y8 } = this.offsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y4 },
          { x: x3, y: y0 },
          { x: x8, y: y0 },
          { x: xB, y: y4 },
          { x: x8, y: y8 },
          { x: x3, y: y8 },
        ],
        color,
      );
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const ctx = this.drawing;

      const { x1, x2, x3, x5, x6, x8, x9, xA, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.offsets(cd);

      switch (cd.direction) {
        case 'a': {
          ctx.polygon(
            [
              { x: x5, y: y0 },
              { x: x6, y: y0 },
              { x: x6, y: y2 },
              { x: x5, y: y2 },
            ],
            color,
          );
          break;
        }
        case 'b': {
          ctx.polygon(
            [
              { x: x6, y: y2 },
              { x: x8, y: y1 },
              { x: x9, y: y4 },
              { x: xA, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          ctx.polygon(
            [
              { x: x9, y: y4 },
              { x: xA, y: y5 },
              { x: x8, y: y7 },
              { x: x6, y: y6 },
            ],
            color,
          );
          break;
        }
        case 'd': {
          ctx.polygon(
            [
              { x: x5, y: y6 },
              { x: x6, y: y6 },
              { x: x6, y: y8 },
              { x: x5, y: y8 },
            ],
            color,
          );
          break;
        }
        case 'e': {
          ctx.polygon(
            [
              { x: x2, y: y4 },
              { x: x1, y: y5 },
              { x: x3, y: y7 },
              { x: x5, y: y6 },
            ],
            color,
          );
          break;
        }
        case 'f': {
          ctx.polygon(
            [
              { x: x2, y: y4 },
              { x: x1, y: y3 },
              { x: x3, y: y1 },
              { x: x5, y: y2 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawPillar(cell: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      const ctx = this.drawing;
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xA, xB, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.offsets(cell);

      switch (cell.corner) {
        case 'ab': {
          ctx.polygon(
            [
              { x: x6, y: y2 },
              { x: x8, y: y1 },
              { x: x7, y: y0 },
              { x: x6, y: y0 },
            ],
            color,
          );
          break;
        }
        case 'bc': {
          ctx.polygon(
            [
              { x: x9, y: y4 },
              { x: xA, y: y3 },
              { x: xB, y: y4 },
              { x: xA, y: y5 },
            ],
            color,
          );
          break;
        }
        case 'cd': {
          ctx.polygon(
            [
              { x: x6, y: y6 },
              { x: x7, y: y8 },
              { x: x8, y: y7 },
              { x: x6, y: y6 },
            ],
            color,
          );
          break;
        }
        case 'de': {
          ctx.polygon(
            [
              { x: x5, y: y6 },
              { x: x4, y: y8 },
              { x: x3, y: y7 },
            ],
            color,
          );
          break;
        }
        case 'ef': {
          ctx.polygon(
            [
              { x: x2, y: y4 },
              { x: x1, y: y3 },
              { x: x0, y: y4 },
              { x: x1, y: y5 },
            ],
            color,
          );
          break;
        }
        case 'fa': {
          ctx.polygon(
            [
              { x: x5, y: y2 },
              { x: x5, y: y0 },
              { x: x4, y: y0 },
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

  public drawPath(cd: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const { x2, x5, x6, x9, y2, y4, y5, y6 } = this.offsets(cd);

      this.drawCell(cd);

      switch (cd.direction) {
        case 'a': {
          this.drawing.polygon(
            [
              { x: x5, y: y6 },
              { x: x6, y: y6 },
              { x: (x5 + x6) / 2, y: y2 },
            ],
            color,
          );
          break;
        }
        case 'b': {
          this.drawing.polygon(
            [
              { x: x2, y: y4 },
              { x: x5, y: y6 },
              { x: (x6 + x9) / 2, y: (y2 + y4) / 2 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          this.drawing.polygon(
            [
              { x: x2, y: y4 },
              { x: x5, y: y2 },
              { x: (x6 + x9) / 2, y: (y4 + y6) / 2 },
            ],
            color,
          );
          break;
        }
        case 'd': {
          this.drawing.polygon(
            [
              { x: x5, y: y2 },
              { x: x6, y: y2 },
              { x: (x5 + x6) / 2, y: y6 },
            ],
            color,
          );
          break;
        }
        case 'e': {
          this.drawing.polygon(
            [
              { x: x6, y: y2 },
              { x: x9, y: y5 },
              { x: (x2 + x5) / 2, y: (y4 + y6) / 2 },
            ],
            color,
          );
          break;
        }
        case 'f': {
          this.drawing.polygon(
            [
              { x: x9, y: y4 },
              { x: x6, y: y6 },
              { x: (x2 + x5) / 2, y: (y2 + y4) / 2 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = 'red', cellColor = this.cellColor): void {
    if (this.drawing) {
      const { x2, x5, x6, x9, y2, y4, y6 } = this.offsets(cell);

      this.drawCell(cell, cellColor);

      this.drawing.line({ x: x2, y: y4 }, { x: x9, y: y4 }, color);
      this.drawing.line({ x: x5, y: y2 }, { x: x6, y: y6 }, color);
      this.drawing.line({ x: x6, y: y2 }, { x: x5, y: y6 }, color);
    }
  }
}
