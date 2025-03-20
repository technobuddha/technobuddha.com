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

export class BrickMaze extends Maze {
  public constructor({ cellSize = 16, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      ['a', 'b', 'c', 'd', 'e', 'f'],
      ['fa', 'ab', 'bc', 'cd', 'de', 'ef'],
    );
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize * 2, this.cellSize];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected cellKind(cell: Cell): number {
    return cell.y % 2;
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

  public move(cell: Cell, direction: Direction): CellDirection {
    if (this.cellKind(cell) === 0) {
      switch (direction) {
        case 'a': {
          return { x: cell.x - 1, y: cell.y - 1, direction };
        }
        case 'b': {
          return { x: cell.x, y: cell.y - 1, direction };
        }
        case 'c': {
          return { x: cell.x + 1, y: cell.y, direction };
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
    } else {
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
          return { x: cell.x + 1, y: cell.y + 1, direction };
        }
        case 'e': {
          return { x: cell.x, y: cell.y + 1, direction };
        }
        case 'f': {
          return { x: cell.x - 1, y: cell.y, direction };
        }
        default: {
          throw new Error(`"${direction}" is not a valid direction`);
        }
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
    return this.neighbors(cell, { directions: ['e', 'd', 'c'], walls }).map((cd) => cd.direction);
  }

  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
    if (cell1.x === cell2.x) {
      const dividers = range(cell1.y, cell2.y).flatMap((y) =>
        this.cellKind({ x: cell1.x, y }) === 0 ?
          [{ x: cell1.x, y, direction: 'c' }]
        : [
            { x: cell1.x, y, direction: 'b' },
            { x: cell1.x, y, direction: 'c' },
            { x: cell1.x, y, direction: 'd' },
          ],
      );

      if (cell2.y >= this.height - 1 && this.cellKind(cell2) === 0) {
        dividers.pop();
      }

      return dividers;
    } else if (cell1.y === cell2.y) {
      const dividers = range(cell1.x, cell2.x).flatMap((x) => [
        { x, y: cell1.y, direction: 'e' },
        { x, y: cell1.y, direction: 'd' },
      ]);

      if (this.cellKind(cell1) === 0) {
        dividers.shift();
      } else {
        dividers.pop();
      }

      return dividers;
    }

    throw new Error('Cells must be aligned vertically or horizontally');
  }

  private offsets({ x, y }: Cell): Record<string, number> {
    const margin = Math.floor(this.cellSize / 8);

    const x0 = x * this.cellSize * 2 + (this.cellKind({ x, y }) === 0 ? 0 : this.cellSize);
    const x1 = x0 + this.wallSize;
    const x2 = x1 + margin;

    const x4 = x0 + this.cellSize - this.wallSize / 2;
    const x5 = x4 + this.wallSize;
    const x3 = x4 - margin;
    const x6 = x5 + margin;

    const x9 = x0 + this.cellSize * 2;
    const x8 = x9 - this.wallSize;
    const x7 = x8 - margin;

    const xc1 = (x1 + x4) / 2;
    const xc2 = (x5 + x8) / 2;

    const y0 = y * this.cellSize;
    const y1 = y0 + this.wallSize;
    const y2 = y1 + margin;
    const y5 = y0 + this.cellSize;
    const y4 = y5 - this.wallSize;
    const y3 = y4 - margin;
    const yc = (y0 + y5) / 2;

    return { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xc1, xc2, y0, y1, y2, yc, y3, y4, y5 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x9, y0, y5 } = this.offsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y0 },
          { x: x9, y: y0 },
          { x: x9, y: y5 },
          { x: x0, y: y5 },
        ],
        color,
      );
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x4, x5, x8, x9, y0, y1, y4, y5 } = this.offsets(cd);

      switch (cd.direction) {
        case 'a': {
          this.drawing.rect({ x: x1, y: y0 }, { x: x4, y: y1 }, color);
          break;
        }
        case 'b': {
          this.drawing.rect({ x: x5, y: y0 }, { x: x8, y: y1 }, color);
          break;
        }
        case 'c': {
          this.drawing.rect({ x: x8, y: y1 }, { x: x9, y: y4 }, color);
          break;
        }
        case 'd': {
          this.drawing.rect({ x: x5, y: y4 }, { x: x8, y: y5 }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x1, y: y4 }, { x: x4, y: y5 }, color);
          break;
        }
        case 'f': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y4 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x4, x5, x8, x9, y0, y1, y4, y5 } = this.offsets({ x, y });

      switch (corner) {
        case 'fa': {
          this.drawing.rect({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
          break;
        }

        case 'ab': {
          this.drawing.rect({ x: x4, y: y0 }, { x: x5, y: y1 }, color);
          break;
        }

        case 'bc': {
          this.drawing.rect({ x: x8, y: y0 }, { x: x9, y: y1 }, color);
          break;
        }

        case 'cd': {
          this.drawing.rect({ x: x8, y: y4 }, { x: x9, y: y5 }, color);
          break;
        }

        case 'de': {
          this.drawing.rect({ x: x4, y: y4 }, { x: x5, y: y5 }, color);
          break;
        }

        case 'ef': {
          this.drawing.rect({ x: x0, y: y4 }, { x: x1, y: y5 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const { x2, x3, x6, xc1, xc2, x7, y2, yc, y3 } = this.offsets(cell);

      this.drawCell(cell);

      switch (cell.direction) {
        case 'a': {
          this.drawing.polygon(
            [
              { x: x2, y: y3 },
              { x: xc1, y: y2 },
              { x: x3, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'b': {
          this.drawing.polygon(
            [
              { x: x6, y: y3 },
              { x: xc2, y: y2 },
              { x: x7, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          this.drawing.polygon(
            [
              { x: x6, y: y2 },
              { x: x7, y: yc },
              { x: x6, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'd': {
          this.drawing.polygon(
            [
              { x: x6, y: y2 },
              { x: xc2, y: y3 },
              { x: x7, y: y2 },
            ],
            color,
          );
          break;
        }
        case 'e': {
          this.drawing.polygon(
            [
              { x: x2, y: y2 },
              { x: xc1, y: y3 },
              { x: x3, y: y2 },
            ],
            color,
          );
          break;
        }
        case 'f': {
          this.drawing.polygon(
            [
              { x: x3, y: y2 },
              { x: x2, y: yc },
              { x: x3, y: y3 },
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
      const { x1, x8, y1, y4 } = this.offsets(cell);

      this.drawCell(cell, cellColor);

      this.drawing.line({ x: x1, y: y1 }, { x: x8, y: y4 }, color);
      this.drawing.line({ x: x1, y: y4 }, { x: x8, y: y1 }, color);
    }
  }

  public override toString(): string {
    let str = '';

    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        str += this.walls[x][y].N ? '+==' : '+  ';
      }
      str += '+\n';
      for (let x = 0; x < this.width; ++x) {
        str += this.walls[x][y].W ? '|  ' : '   ';
      }
      str += this.walls[this.width - 1][y].E ? '|\n' : ' \n';
    }
    for (let x = 0; x < this.width; ++x) {
      str += this.walls[x][this.height - 1].S ? '+==' : '+  ';
    }
    str += '+\n';

    return str;
  }
}
