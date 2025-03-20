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

export class SquareMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 1, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, ['N', 'E', 'W', 'S'], ['NE', 'NW', 'SE', 'SW']);
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected initialWalls(): Wall {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return { N: true, E: true, W: true, S: true };
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public opposite(direction: Direction): Direction {
    switch (direction) {
      case 'N': {
        return 'S';
      }
      case 'E': {
        return 'W';
      }
      case 'W': {
        return 'E';
      }
      case 'S': {
        return 'N';
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public rightTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'N': {
        return ['E', 'N', 'W', 'S'];
      }
      case 'E': {
        return ['S', 'E', 'N', 'W'];
      }
      case 'W': {
        return ['N', 'W', 'S', 'E'];
      }
      case 'S': {
        return ['W', 'S', 'E', 'N'];
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public leftTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'N': {
        return ['W', 'N', 'E', 'S'];
      }
      case 'E': {
        return ['N', 'E', 'S', 'W'];
      }
      case 'W': {
        return ['S', 'W', 'N', 'E'];
      }
      case 'S': {
        return ['E', 'S', 'W', 'N'];
      }
      default: {
        throw new Error(`"${direction}" is not a valid direction`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public move(cell: Cell, direction: Direction): CellDirection {
    switch (direction) {
      case 'N': {
        return { x: cell.x, y: cell.y - 1, direction };
      }
      case 'E': {
        return { x: cell.x + 1, y: cell.y, direction };
      }
      case 'W': {
        return { x: cell.x - 1, y: cell.y, direction };
      }
      case 'S': {
        return { x: cell.x, y: cell.y + 1, direction };
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
      this.sides(cell, { directions, walls }) === 3 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell, { walls = this.walls }: Overrides = {}): string[] {
    return this.neighbors(cell, { directions: ['S', 'W'], walls }).map((cd) => cd.direction);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
    if (cell1.x === cell2.x) {
      return range(cell1.y, cell2.y).map((y) => ({ x: cell1.x, y, direction: 'E' }));
    } else if (cell1.y === cell2.y) {
      return range(cell1.x, cell2.x).map((x) => ({ x, y: cell1.y, direction: 'S' }));
    }

    throw new Error('Cells must be aligned vertically or horizontally');
  }

  private offsets({ x, y }: Cell): Record<string, number> {
    const margin = Math.floor(this.cellSize / 8);

    const x0 = x * this.cellSize;
    const x1 = x0 + this.wallSize;
    const x2 = x1 + margin;
    const x5 = x0 + this.cellSize;
    const x4 = x5 - this.wallSize;
    const x3 = x4 - margin;
    const xc = (x0 + x5) / 2;

    const y0 = y * this.cellSize;
    const y1 = y0 + this.wallSize;
    const y2 = y1 + margin;
    const y5 = y0 + this.cellSize;
    const y4 = y5 - this.wallSize;
    const y3 = y4 - margin;
    const yc = (y0 + y5) / 2;

    return { x0, x1, x2, xc, x3, x4, x5, y0, y1, y2, yc, y3, y4, y5 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x5, y0, y5 } = this.offsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y0 },
          { x: x5, y: y0 },
          { x: x5, y: y5 },
          { x: x0, y: y5 },
        ],
        color,
      );
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x4, x5, y0, y1, y4, y5 } = this.offsets(cd);

      switch (cd.direction) {
        case 'N': {
          this.drawing.rect({ x: x1, y: y0 }, { x: x4, y: y0 }, color);
          break;
        }
        case 'S': {
          this.drawing.rect({ x: x1, y: y4 }, { x: x4, y: y5 }, color);
          break;
        }
        case 'E': {
          this.drawing.rect({ x: x4, y: y1 }, { x: x5, y: y4 }, color);
          break;
        }
        case 'W': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y4 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x4, x5, y0, y1, y4, y5 } = this.offsets({ x, y });

      if (corner === 'NW') {
        this.drawing.rect({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
      }
      if (corner === 'NE') {
        this.drawing.rect({ x: x4, y: y0 }, { x: x5, y: y1 }, color);
      }
      if (corner === 'SW') {
        this.drawing.rect({ x: x0, y: y4 }, { x: x1, y: y5 }, color);
      }
      if (corner === 'SE') {
        this.drawing.rect({ x: x4, y: y4 }, { x: x5, y: y5 }, color);
      }
    }
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const { x2, xc, x3, y2, yc, y3 } = this.offsets(cell);

      this.drawCell(cell);

      switch (cell.direction) {
        case 'N': {
          this.drawing.polygon(
            [
              { x: x2, y: y3 },
              { x: xc, y: y2 },
              { x: x3, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'S': {
          this.drawing.polygon(
            [
              { x: x2, y: y2 },
              { x: xc, y: y3 },
              { x: x3, y: y2 },
            ],
            color,
          );
          break;
        }
        case 'E': {
          this.drawing.polygon(
            [
              { x: x2, y: y2 },
              { x: x3, y: yc },
              { x: x2, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'W': {
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
      const { x1, x4, y1, y4 } = this.offsets(cell);

      this.drawCell(cell, cellColor);

      this.drawing.line({ x: x1, y: y1 }, { x: x4, y: y4 }, color);
      this.drawing.line({ x: x1, y: y4 }, { x: x4, y: y1 }, color);
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
