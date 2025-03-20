import range from 'lodash/range';
import { Maze } from './maze';
import type { Cell, CellDirection, CellCorner, Direction, MazeProperties, Wall } from './maze';

const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
const SIN60 = Math.sin(Math.PI / 3);

export class HexagonMaze extends Maze {
  constructor({ cellSize = 17, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      ['A', 'B', 'C', 'D', 'E', 'F'],
      ['AB', 'BC', 'CD', 'DE', 'EF', 'FA'],
    );
  }

  protected drawingWidth(): [border: number, cell: number] {
    return [this.wallSize * 2 + this.cellSize * 0.25, this.cellSize * 0.75];
  }

  protected drawingHeight(): [border: number, cell: number] {
    return [this.wallSize * 2 + (this.cellSize * SIN60) / 2, this.cellSize * SIN60];
  }

  protected initialWalls(): Wall {
    return { A: true, B: true, C: true, D: true, E: true, F: true };
  }

  public opposite(direction: Direction): Direction {
    switch (direction) {
      case 'A':
        return 'D';
      case 'B':
        return 'E';
      case 'C':
        return 'F';
      case 'D':
        return 'A';
      case 'E':
        return 'B';
      case 'F':
        return 'C';
      default:
        throw new Error(`"${direction}" is not a valid direction`);
    }
  }

  public rightTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'A':
        return ['C', 'B', 'A', 'F', 'E', 'D'];
      case 'B':
        return ['D', 'C', 'B', 'A', 'F', 'E'];
      case 'C':
        return ['E', 'D', 'C', 'B', 'A', 'F'];
      case 'D':
        return ['F', 'E', 'D', 'C', 'B', 'A'];
      case 'E':
        return ['A', 'F', 'E', 'D', 'C', 'B'];
      case 'F':
        return ['B', 'A', 'F', 'E', 'D', 'C'];
      default:
        throw new Error(`"${direction}" is not a valid direction`);
    }
  }

  public leftTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'A':
        return ['E', 'F', 'A', 'B', 'C', 'D'];
      case 'B':
        return ['F', 'A', 'B', 'C', 'D', 'E'];
      case 'C':
        return ['A', 'B', 'C', 'D', 'E', 'F'];
      case 'D':
        return ['B', 'C', 'D', 'E', 'F', 'A'];
      case 'E':
        return ['C', 'D', 'E', 'F', 'A', 'B'];
      case 'F':
        return ['D', 'E', 'F', 'A', 'B', 'C'];
      default:
        throw new Error(`"${direction}" is not a valid direction`);
    }
  }

  public move(cell: Cell, direction: Direction): CellDirection {
    if (cell.x % 2 === 0) {
      switch (direction) {
        case 'A':
          return { x: cell.x, y: cell.y - 1, direction };
        case 'B':
          return { x: cell.x + 1, y: cell.y - 1, direction };
        case 'C':
          return { x: cell.x + 1, y: cell.y, direction };
        case 'D':
          return { x: cell.x, y: cell.y + 1, direction };
        case 'E':
          return { x: cell.x - 1, y: cell.y, direction };
        case 'F':
          return { x: cell.x - 1, y: cell.y - 1, direction };
        default:
          throw new Error(`"${direction}" is not a valid direction`);
      }
    }

    switch (direction) {
      case 'A':
        return { x: cell.x, y: cell.y - 1, direction };
      case 'B':
        return { x: cell.x + 1, y: cell.y, direction };
      case 'C':
        return { x: cell.x + 1, y: cell.y + 1, direction };
      case 'D':
        return { x: cell.x, y: cell.y + 1, direction };
      case 'E':
        return { x: cell.x - 1, y: cell.y + 1, direction };
      case 'F':
        return { x: cell.x - 1, y: cell.y, direction };
      default:
        throw new Error(`"${direction}" is not a valid direction`);
    }
  }

  public isDeadEnd(cell: Cell): boolean {
    return (
      this.sides(cell) === 5 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell): string[] {
    return this.neighbors(cell, { dirs: ['B', 'C', 'D'] }).map((cd) => cd.direction);
  }

  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
    if (cell1.x === cell2.x) {
      const walls: CellDirection[] = range(cell1.y, cell2.y).flatMap((y) => [
        { x: cell1.x, y, direction: 'B' },
        { x: cell1.x, y, direction: 'C' },
      ]);

      if (cell1.x % 2 === 0) walls.shift();
      else walls.pop();

      return walls;
    } else if (cell1.y === cell2.y) {
      const walls: CellDirection[] = range(cell1.x, cell2.x).flatMap((x) =>
        x % 2 === 0 ?
          { x, y: cell1.y, direction: 'D' }
        : [
            { x, y: cell1.y, direction: 'E' },
            { x, y: cell1.y, direction: 'D' },
            { x, y: cell1.y, direction: 'C' },
          ],
      );

      if (cell1.x % 2 === 1) walls.shift();

      if (cell2.x % 2 === 0) walls.pop();

      return walls;
    }

    throw new Error('Cells must be aligned vertically or horizontally');
  }

  private offsets({ x, y }: Cell) {
    //const margin = Math.floor(this.cellSize / 8);
    const even = x % 2 === 0;

    // Corner EF
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
    const xA = xB - (this.wallSize * TAN30) / 2; // corner BC
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
    if (this.context) {
      const { x0, x3, x8, xB, y0, y4, y8 } = this.offsets(cell);

      this.context.fillStyle = color;
      this.context.beginPath();
      this.context.moveTo(x0, y4);
      this.context.lineTo(x3, y0);
      this.context.lineTo(x8, y0);
      this.context.lineTo(xB, y4);
      this.context.lineTo(x8, y8);
      this.context.lineTo(x3, y8);
      this.context.fill();
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.context) {
      const ctx = this.context;

      const { x1, x2, x3, x5, x6, x8, x9, xA, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.offsets(cd);

      ctx.fillStyle = color;
      switch (cd.direction) {
        case 'A':
          ctx.beginPath();
          ctx.moveTo(x5, y0);
          ctx.lineTo(x6, y0);
          ctx.lineTo(x6, y2);
          ctx.lineTo(x5, y2);
          ctx.fill();
          break;
        case 'B':
          ctx.beginPath();
          ctx.moveTo(x6, y2);
          ctx.lineTo(x8, y1);
          ctx.lineTo(x9, y4);
          ctx.lineTo(xA, y3);
          ctx.fill();
          break;
        case 'C':
          ctx.beginPath();
          ctx.moveTo(x9, y4);
          ctx.lineTo(xA, y5);
          ctx.lineTo(x8, y7);
          ctx.lineTo(x6, y6);
          ctx.fill();
          break;
        case 'D':
          ctx.beginPath();
          ctx.moveTo(x5, y6);
          ctx.lineTo(x6, y6);
          ctx.lineTo(x6, y8);
          ctx.lineTo(x5, y8);
          ctx.fill();
          break;
        case 'E':
          ctx.beginPath();
          ctx.moveTo(x5, y6);
          ctx.lineTo(x3, y7);
          ctx.lineTo(x1, y5);
          ctx.lineTo(x2, y4);
          ctx.fill();
          break;
        case 'F':
          ctx.beginPath();
          ctx.moveTo(x2, y4);
          ctx.lineTo(x1, y3);
          ctx.lineTo(x3, y1);
          ctx.lineTo(x5, y2);
          ctx.fill();
          break;
      }
    }
  }

  public drawPillar(cell: CellCorner, color = this.wallColor): void {
    if (this.context) {
      const ctx = this.context;
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xA, xB, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.offsets(cell);

      ctx.fillStyle = color;
      ctx.beginPath();
      switch (cell.corner) {
        case 'AB':
          ctx.moveTo(x6, y2);
          ctx.lineTo(x8, y1);
          ctx.lineTo(x7, y0);
          ctx.lineTo(x6, y0);
          break;
        case 'BC':
          ctx.moveTo(x9, y4);
          ctx.lineTo(xA, y3);
          ctx.lineTo(xB, y4);
          ctx.lineTo(xA, y5);
          break;
        case 'CD':
          ctx.moveTo(x6, y6);
          ctx.lineTo(x6, y8);
          ctx.lineTo(x7, y8);
          ctx.lineTo(x8, y7);
          break;
        case 'DE':
          ctx.moveTo(x5, y6);
          ctx.lineTo(x5, y8);
          ctx.lineTo(x4, y8);
          ctx.lineTo(x3, y7);
          break;
        case 'EF':
          ctx.moveTo(x2, y4);
          ctx.lineTo(x1, y3);
          ctx.lineTo(x0, y4);
          ctx.lineTo(x1, y5);
          break;
        case 'FA':
          ctx.moveTo(x5, y2);
          ctx.lineTo(x5, y0);
          ctx.lineTo(x4, y0);
          ctx.lineTo(x3, y1);
          break;
      }
      ctx.fill();
    }
  }

  public drawPath(cd: CellDirection, color = 'red'): void {
    if (this.context) {
      const ctx = this.context;

      const { x2, x5, x6, x9, y2, y4, y5, y6 } = this.offsets(cd);

      this.drawCell(cd);

      this.context.fillStyle = color;
      ctx.beginPath();
      switch (cd.direction) {
        case 'A':
          ctx.moveTo(x5, y6);
          ctx.lineTo(x6, y6);
          ctx.lineTo((x5 + x6) / 2, y2);
          break;
        case 'B':
          ctx.moveTo(x2, y4);
          ctx.lineTo(x5, y6);
          ctx.lineTo((x6 + x9) / 2, (y2 + y4) / 2);
          break;
        case 'C':
          ctx.moveTo(x2, y4);
          ctx.lineTo(x5, y2);
          ctx.lineTo((x6 + x9) / 2, (y4 + y6) / 2);
          break;
        case 'D':
          ctx.moveTo(x5, y2);
          ctx.lineTo(x6, y2);
          ctx.lineTo((x5 + x6) / 2, y6);
          break;
        case 'E':
          ctx.moveTo(x6, y2);
          ctx.lineTo(x9, y5);
          ctx.lineTo((x2 + x5) / 2, (y4 + y6) / 2);
          break;
        case 'F':
          ctx.moveTo(x9, y4);
          ctx.lineTo(x6, y6);
          ctx.lineTo((x2 + x5) / 2, (y2 + y4) / 2);
          break;
      }
      ctx.fill();
    }
  }

  public drawX(cell: Cell, color = 'black', cellColor = this.cellColor): void {
    if (this.context) {
      const { x2, x5, x6, x9, y2, y4, y6 } = this.offsets(cell);

      this.drawCell(cell, cellColor);

      this.context.strokeStyle = color;
      this.context.beginPath();
      this.context.moveTo(x2, y4);
      this.context.lineTo(x9, y4);
      this.context.moveTo(x5, y2);
      this.context.lineTo(x6, y6);
      this.context.moveTo(x6, y2);
      this.context.lineTo(x5, y6);
      this.context.stroke();
    }
  }
}
