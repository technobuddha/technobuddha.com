import { range } from 'lodash-es';

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

const SIN60 = Math.sin(Math.PI / 3);

export class TriangleMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 2, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      ['a', 'b', 'c', 'd', 'e', 'f'],
      ['ac', 'ce', 'ea', 'bd', 'df', 'fb'],
    );
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize / 2, this.cellSize / 4];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize * SIN60, 0];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected initialWalls(x: number, y: number): Wall {
    return (x + y) % 2 === 0 ? { b: true, d: true, f: true } : { a: true, c: true, e: true };
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
        return ['b', 'f', 'd'];
      }
      case 'b': {
        return ['c', 'a', 'e'];
      }
      case 'c': {
        return ['d', 'b', 'f'];
      }
      case 'd': {
        return ['e', 'c', 'a'];
      }
      case 'e': {
        return ['f', 'd', 'b'];
      }
      case 'f': {
        return ['a', 'e', 'c'];
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
        return ['f', 'b', 'd'];
      }
      case 'b': {
        return ['a', 'c', 'e'];
      }
      case 'c': {
        return ['b', 'd', 'f'];
      }
      case 'd': {
        return ['c', 'e', 'a'];
      }
      case 'e': {
        return ['d', 'f', 'b'];
      }
      case 'f': {
        return ['e', 'a', 'c'];
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public move(cell: Cell, direction: Direction): CellDirection | null {
    if ((cell.x + cell.y) % 2 === 1) {
      switch (direction) {
        case 'a': {
          return { x: cell.x, y: cell.y - 1, direction };
        }
        case 'c': {
          return { x: cell.x + 1, y: cell.y, direction };
        }
        case 'e': {
          return { x: cell.x - 1, y: cell.y, direction };
        }

        // no default
      }
    } else {
      switch (direction) {
        case 'b': {
          return { x: cell.x + 1, y: cell.y, direction };
        }
        case 'd': {
          return { x: cell.x, y: cell.y + 1, direction };
        }
        case 'f': {
          return { x: cell.x - 1, y: cell.y, direction };
        }

        // no default
      }
    }
    return null;
  }

  public isDeadEnd(cell: Cell): boolean {
    return (
      this.sides(cell) === 2 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell, { walls = this.walls }: Overrides = {}): string[] {
    return this.neighbors(cell, {
      directions: (cell.x + cell.y) % 2 === 1 ? ['c'] : ['b', 'd'],
      walls,
    }).map((cd) => cd.direction);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
    if (cell1.x === cell2.x) {
      const dividers = range(cell1.y, cell2.y).map((y) =>
        cell1.x % 2 === 0 ?
          y % 2 === 0 ?
            { x: cell1.x, y, direction: 'f' }
          : { x: cell1.x, y, direction: 'e' }
        : y % 2 === 1 ? { x: cell1.x, y, direction: 'b' }
        : { x: cell1.x, y, direction: 'c' },
      );

      // if (cell1.y === 0) {
      //   dividers.unshift();
      // }
      // if (cell2.y === this.height) {
      //   dividers.pop();
      // }

      return dividers;
    } else if (cell1.y === cell2.y) {
      const dividers = range(cell1.x, cell2.x).flatMap(
        (x) => ((x + cell1.y) % 2 === 1 ? { x, y: cell1.y, direction: 'a' } : []), //{ x, y: cell1.y, direction: 'a' },
      );

      if ((cell1.x + cell1.y) % 2 === 0) {
        // dividers.pop();
      } else {
        // dividers.shift();
      }

      return dividers;
    }

    throw new Error('Cells must be aligned vertically or horizontally');
  }

  private offsets({ x, y }: Cell): Record<string, number> {
    //const margin = Math.floor(this.cellSize / 8);

    const x0 = (x / 2) * this.cellSize;
    const x1 = x0 + this.wallSize * SIN60;
    const x2 = x1 + this.wallSize * SIN60;
    const x8 = x0 + this.cellSize;
    const x7 = x8 - this.wallSize * SIN60;
    const x6 = x7 - this.wallSize * SIN60;
    const x4 = (x0 + x8) / 2;
    const x3 = x4 - this.wallSize * SIN60;
    const x5 = x4 + this.wallSize * SIN60;

    const y5 = y * this.cellSize * SIN60;
    const y4 = y5 + this.wallSize;
    const y3 = y4 + this.wallSize * 0.5;
    const y0 = y5 + this.cellSize * SIN60;
    const y1 = y0 - this.wallSize * 1.5;
    const y2 = y1 - this.wallSize * 0.5;

    const sx0 = x0 + this.cellSize * 0.375;
    const sx1 = sx0 + this.cellSize / 4;

    if ((x + y) % 2 === 1) {
      const sy1 = y5 + (this.cellSize * SIN60) / 2;
      const sy0 = sy1 - (this.cellSize * SIN60) / 4;
      return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, sx0, sx1, sy0, sy1 };
    }

    const sy0 = y0 - (this.cellSize * SIN60) / 2;
    const sy1 = sy0 + (this.cellSize * SIN60) / 4;
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
      y0: y5,
      y1: y4,
      y2: y3,
      y3: y2,
      y4: y1,
      y5: y0,
      sx0,
      sx1,
      sy0,
      sy1,
    };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x4, x8, y0, y5 } = this.offsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y5 },
          { x: x4, y: y0 },
          { x: x8, y: y5 },
        ],
        color,
      );
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const ctx = this.drawing;

      const { x1, x2, x3, x4, x5, x6, x7, y1, y2, y3, y4, y5 } = this.offsets(cd);

      switch (cd.direction) {
        case 'a':
        case 'd': {
          ctx.polygon(
            [
              { x: x2, y: y4 },
              { x: x6, y: y4 },
              { x: x6, y: y5 },
              { x: x2, y: y5 },
            ],
            color,
          );
          break;
        }
        case 'f':
        case 'e': {
          ctx.polygon(
            [
              { x: x3, y: y1 },
              { x: x4, y: y2 },
              { x: x2, y: y4 },
              { x: x1, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'c':
        case 'b': {
          ctx.polygon(
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

        // no default
      }
    }
  }

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      const ctx = this.drawing;
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5 } = this.offsets({ x, y });

      switch (corner) {
        case 'ac':
        case 'bd': {
          ctx.polygon(
            [
              { x: x6, y: y5 },
              { x: x6, y: y4 },
              { x: x7, y: y3 },
              { x: x8, y: y5 },
            ],
            color,
          );
          break;
        }
        case 'ce':
        case 'fb': {
          ctx.polygon(
            [
              { x: x4, y: y0 },
              { x: x3, y: y1 },
              { x: x4, y: y2 },
              { x: x5, y: y1 },
            ],
            color,
          );
          break;
        }
        case 'ea':
        case 'df': {
          ctx.polygon(
            [
              { x: x0, y: y5 },
              { x: x1, y: y3 },
              { x: x2, y: y4 },
              { x: x2, y: y5 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const { x2, x4, x6, y2, y4 } = this.offsets(cell);

      this.drawCell(cell);

      switch (cell.direction) {
        case 'a':
        case 'd': {
          this.drawing.line({ x: x4, y: y2 }, { x: x4, y: y4 }, color);
          this.drawing.line({ x: x4, y: y4 }, { x: (x4 + x6) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: x4, y: y4 }, { x: (x4 + x2) / 2, y: (y2 + y4) / 2 }, color);
          break;
        }
        case 'e':
        case 'f': {
          this.drawing.line({ x: x6, y: y4 }, { x: (x4 + x2) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line(
            { x: (x4 + x2) / 2, y: (y2 + y4) / 2 },
            { x: (x4 + x6) / 2, y: (y2 + y4) / 2 },
            color,
          );
          this.drawing.line({ x: (x4 + x2) / 2, y: (y2 + y4) / 2 }, { x: x4, y: y4 }, color);
          break;
        }
        case 'c':
        case 'b': {
          this.drawing.line({ x: x2, y: y4 }, { x: (x4 + x6) / 2, y: (y2 + y4) / 2 }, color);
          this.drawing.line(
            { x: (x4 + x6) / 2, y: (y2 + y4) / 2 },
            { x: (x4 + x2) / 2, y: (y2 + y4) / 2 },
            color,
          );
          this.drawing.line({ x: (x4 + x6) / 2, y: (y2 + y4) / 2 }, { x: x4, y: y4 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = 'red', cellColor = this.cellColor): void {
    if (this.drawing) {
      const { x2, x4, x6, y2, y4 } = this.offsets(cell);
      const yc = (y2 + y4) / 2;

      this.drawCell(cell, cellColor);

      this.drawing.line({ x: x2, y: y4 }, { x: x4, y: yc }, color);
      this.drawing.line({ x: x6, y: y4 }, { x: x4, y: yc }, color);
      this.drawing.line({ x: x4, y: y2 }, { x: x4, y: yc }, color);
    }
  }
}
