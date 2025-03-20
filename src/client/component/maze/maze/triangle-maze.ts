import { Maze } from './maze';
import type { Cell, CellDirection, CellCorner, Direction, MazeProperties, Wall } from './maze';

const SIN60 = Math.sin(Math.PI / 3);

export class TriangleMaze extends Maze {
  constructor({ cellSize = 17, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      ['A', 'B', 'C', 'D', 'E', 'F'],
      ['AC', 'CE', 'EA', 'BD', 'DF', 'FB'],
    );
  }

  protected drawingWidth(): [border: number, cell: number] {
    return [this.wallSize * 2 + this.cellSize / 2, this.cellSize / 2];
  }

  protected drawingHeight(): [border: number, cell: number] {
    return [this.wallSize * 2, this.cellSize * SIN60];
  }

  protected initialWalls(x: number, y: number): Wall {
    return (x + y) % 2 === 0 ? { B: true, D: true, F: true } : { A: true, C: true, E: true };
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
        return ['B', 'F', 'D'];
      case 'B':
        return ['C', 'A', 'E'];
      case 'C':
        return ['D', 'B', 'F'];
      case 'D':
        return ['E', 'C', 'A'];
      case 'E':
        return ['F', 'D', 'B'];
      case 'F':
        return ['A', 'E', 'C'];
      default:
        throw new Error(`"${direction}" is not a valid direction`);
    }
  }

  public leftTurn(direction: Direction): Direction[] {
    switch (direction) {
      case 'A':
        return ['F', 'B', 'D'];
      case 'B':
        return ['A', 'C', 'E'];
      case 'C':
        return ['B', 'D', 'F'];
      case 'D':
        return ['C', 'E', 'A'];
      case 'E':
        return ['D', 'F', 'B'];
      case 'F':
        return ['E', 'A', 'C'];
      default:
        throw new Error(`"${direction}" is not a valid direction`);
    }
  }

  public move(cell: Cell, direction: Direction): CellDirection | null {
    if ((cell.x + cell.y) % 2 === 1) {
      switch (direction) {
        case 'A':
          return { x: cell.x, y: cell.y - 1, direction };
        case 'C':
          return { x: cell.x + 1, y: cell.y, direction };
        case 'E':
          return { x: cell.x - 1, y: cell.y, direction };
      }
    } else {
      switch (direction) {
        case 'B':
          return { x: cell.x + 1, y: cell.y, direction };
        case 'D':
          return { x: cell.x, y: cell.y + 1, direction };
        case 'F':
          return { x: cell.x - 1, y: cell.y, direction };
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

  public edges(cell: Cell): string[] {
    return this.neighbors(cell, { dirs: (cell.x + cell.y) % 2 === 1 ? ['C'] : ['B', 'D'] }).map(
      (cd) => cd.direction,
    );
  }

  public divider(_cell1: Cell, _cell2: Cell): CellDirection[] {
    throw new Error('divider is not implemented for Triangle Mazes');
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
    if (this.context) {
      const { x0, x4, x8, y0, y5 } = this.offsets(cell);

      this.context.fillStyle = color;
      this.context.beginPath();
      this.context.moveTo(x0, y5);
      this.context.lineTo(x4, y0);
      this.context.lineTo(x8, y5);
      this.context.fill();
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.context) {
      const ctx = this.context;

      const { x1, x2, x3, x4, x5, x6, x7, y1, y2, y3, y4, y5 } = this.offsets(cd);

      ctx.fillStyle = color;
      switch (cd.direction) {
        case 'A':
        case 'D':
          ctx.beginPath();
          ctx.moveTo(x2, y4);
          ctx.lineTo(x6, y4);
          ctx.lineTo(x6, y5);
          ctx.lineTo(x2, y5);
          ctx.fill();
          break;
        case 'F':
        case 'E':
          ctx.beginPath();
          ctx.moveTo(x3, y1);
          ctx.lineTo(x4, y2);
          ctx.lineTo(x2, y4);
          ctx.lineTo(x1, y3);
          ctx.fill();
          break;
        case 'C':
        case 'B':
          ctx.beginPath();
          ctx.moveTo(x4, y2);
          ctx.lineTo(x5, y1);
          ctx.lineTo(x7, y3);
          ctx.lineTo(x6, y4);
          ctx.fill();
          break;
      }
    }
  }

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.context) {
      const ctx = this.context;
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5 } = this.offsets({ x, y });

      ctx.fillStyle = color;
      switch (corner) {
        case 'AC':
        case 'BD':
          ctx.beginPath();
          ctx.moveTo(x6, y5);
          ctx.lineTo(x6, y4);
          ctx.lineTo(x7, y3);
          ctx.lineTo(x8, y5);
          ctx.fill();
          break;
        case 'CE':
        case 'FB':
          ctx.beginPath();
          ctx.moveTo(x4, y0);
          ctx.lineTo(x3, y1);
          ctx.lineTo(x4, y2);
          ctx.lineTo(x5, y1);
          ctx.fill();
          break;
        case 'EA':
        case 'DF':
          ctx.beginPath();
          ctx.moveTo(x0, y5);
          ctx.lineTo(x1, y3);
          ctx.lineTo(x2, y4);
          ctx.lineTo(x2, y5);
          ctx.fill();
          break;
      }
    }
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.context) {
      const ctx = this.context;

      const { x2, x4, x6, y2, y4 } = this.offsets(cell);

      this.drawCell(cell);

      this.context.strokeStyle = color;
      ctx.beginPath();
      switch (cell.direction) {
        case 'A':
        case 'D':
          ctx.moveTo(x4, y2);
          ctx.lineTo(x4, y4);
          ctx.lineTo((x4 + x6) / 2, (y2 + y4) / 2);
          ctx.moveTo(x4, y4);
          ctx.lineTo((x4 + x2) / 2, (y2 + y4) / 2);
          break;
        case 'E':
        case 'F':
          ctx.moveTo(x6, y4);
          ctx.lineTo((x4 + x2) / 2, (y2 + y4) / 2);
          ctx.lineTo((x4 + x6) / 2, (y2 + y4) / 2);
          ctx.moveTo((x4 + x2) / 2, (y2 + y4) / 2);
          ctx.lineTo(x4, y4);
          break;
        case 'C':
        case 'B':
          ctx.moveTo(x2, y4);
          ctx.lineTo((x4 + x6) / 2, (y2 + y4) / 2);
          ctx.lineTo((x4 + x2) / 2, (y2 + y4) / 2);
          ctx.moveTo((x4 + x6) / 2, (y2 + y4) / 2);
          ctx.lineTo(x4, y4);
          break;
      }
      ctx.stroke();
    }
  }

  public drawX(cell: Cell, color = 'black', cellColor = this.cellColor): void {
    if (this.context) {
      const { x2, x4, x6, y2, y4 } = this.offsets(cell);
      const yc = (y2 + y4) / 2;

      this.drawCell(cell, cellColor);

      this.context.strokeStyle = color;
      this.context.beginPath();
      this.context.moveTo(x2, y4);
      this.context.lineTo(x4, yc);
      this.context.moveTo(x6, y4);
      this.context.lineTo(x4, yc);
      this.context.moveTo(x4, y2);
      this.context.lineTo(x4, yc);
      this.context.stroke();
    }
  }
}
