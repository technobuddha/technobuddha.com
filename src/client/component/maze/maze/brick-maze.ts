/* eslint-disable @typescript-eslint/class-methods-use-this */
import { type Rect } from '../drawing/drawing.js';

import {
  cornerMatrix,
  directionMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  rightTurnMatrix,
  wallMatrix,
} from './brick-matrix.js';
import {
  type Cell,
  type CellCorner,
  type CellDirection,
  type Direction,
  type Kind,
  type MazeProperties,
  type Overrides,
  type Wall,
} from './maze.js';
import { Maze } from './maze.js';

export class BrickMaze extends Maze {
  public constructor({ cellSize = 16, wallSize = 1, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, directionMatrix, cornerMatrix);
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize * 2, this.cellSize];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  protected cellKind(cell: Cell): Kind {
    return cell.y % 2;
  }

  protected initialWalls(): Wall {
    return { ...wallMatrix };
  }

  public opposite(direction: Direction): Direction {
    const opposite = oppositeMatrix[direction];
    if (opposite) {
      return opposite;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public rightTurn(direction: Direction): Direction[] {
    const rightTurn = rightTurnMatrix[direction];
    if (rightTurn) {
      return rightTurn;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public leftTurn(direction: Direction): Direction[] {
    const leftTurn = leftTurnMatrix[direction];
    if (leftTurn) {
      return leftTurn;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public move(cell: Cell, direction: Direction): CellDirection {
    const xy = moveMatrix[this.cellKind(cell)][direction];
    if (xy) {
      return { x: cell.x + xy.x, y: cell.y + xy.y, direction };
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public isDeadEnd(cell: Cell, { walls = this.walls }: Overrides = {}): boolean {
    return (
      this.sides(cell, { walls }) === 5 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell): string[] {
    return this.neighbors(cell)
      .filter((cd) => ['e', 'd', 'c'].includes(cd.direction))
      .map((cd) => cd.direction);
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(
      cell,
      cell.x * this.cellSize * 2 + (this.cellKind(cell) === 0 ? 0 : this.cellSize),
      cell.y * this.cellSize,
    );
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;
    const x1 = x0 + this.wallSize;
    const x2 = x0 + this.cellSize - this.wallSize;
    const x3 = x2 + this.wallSize * 2;
    const x5 = x0 + this.cellSize * 2;
    const x4 = x5 - this.wallSize;

    const y0 = 0;
    const y1 = y0 + this.wallSize;
    const y3 = y0 + this.cellSize;
    const y2 = y3 - this.wallSize;

    return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x5, y0, y3 } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y0 },
          { x: x5, y: y0 },
          { x: x5, y: y3 },
          { x: x0, y: y3 },
        ],
        color,
      );
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3 } = this.cellOffsets(cd);

      switch (cd.direction) {
        case 'a': {
          this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y1 }, color);
          break;
        }
        case 'b': {
          this.drawing.rect({ x: x3, y: y0 }, { x: x4, y: y1 }, color);
          break;
        }
        case 'c': {
          this.drawing.rect({ x: x4, y: y1 }, { x: x5, y: y2 }, color);
          break;
        }
        case 'd': {
          this.drawing.rect({ x: x3, y: y2 }, { x: x4, y: y3 }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x1, y: y2 }, { x: x2, y: y3 }, color);
          break;
        }
        case 'f': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3 } = this.cellOffsets({ x, y });

      switch (corner) {
        case 'fa': {
          this.drawing.rect({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
          break;
        }

        case 'ab': {
          this.drawing.rect({ x: x2, y: y0 }, { x: x3, y: y1 }, color);
          break;
        }

        case 'bc': {
          this.drawing.rect({ x: x4, y: y0 }, { x: x5, y: y1 }, color);
          break;
        }

        case 'cd': {
          this.drawing.rect({ x: x4, y: y2 }, { x: x5, y: y3 }, color);
          break;
        }

        case 'de': {
          this.drawing.rect({ x: x2, y: y2 }, { x: x3, y: y3 }, color);
          break;
        }

        case 'ef': {
          this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y3 }, color);
          break;
        }

        // no default
      }
    }
  }

  // public drawPath(cell: CellDirection, color = 'red'): void {
  //   if (this.drawing) {
  //     const { x1, x2, x3, x4, y0, y1, y2, y3 } = this.offsets(cell);

  //     this.drawCell(cell);

  //     switch (cell.direction) {
  //       case 'a': {
  //         this.drawing.polygon(
  //           [
  //             { x: x1, y: y2 },
  //             { x: (x1 + x2) / 2, y: y1 },
  //             { x: x2, y: y2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'b': {
  //         this.drawing.polygon(
  //           [
  //             { x: x3, y: y2 },
  //             { x: (x3 + x4) / 2, y: y1 },
  //             { x: x4, y: y2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'c': {
  //         this.drawing.polygon(
  //           [
  //             { x: x3, y: y1 },
  //             { x: x4, y: (y0 + y3) / 2 },
  //             { x: x3, y: y2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'd': {
  //         this.drawing.polygon(
  //           [
  //             { x: x3, y: y1 },
  //             { x: (x3 + x4) / 2, y: y2 },
  //             { x: x4, y: y1 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'e': {
  //         this.drawing.polygon(
  //           [
  //             { x: x1, y: y1 },
  //             { x: (x1 + x2) / 2, y: y2 },
  //             { x: x2, y: y1 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'f': {
  //         this.drawing.polygon(
  //           [
  //             { x: x2, y: y1 },
  //             { x: x1, y: (y0 + y3) / 2 },
  //             { x: x2, y: y2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }

  //       // no default
  //     }
  //   }
  // }

  public getRect(cell: CellDirection): Rect {
    const { x1, x4, y1, y2 } = this.cellOffsets(cell);

    return { x: x1, y: y1, w: x4 - x1, h: y2 - y1 };
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const angle = { a: 135, b: 45, c: 0, d: 315, e: 225, f: 180 }[cell.direction]!;

      this.drawArrow(this.getRect(cell), angle, color);
    }
  }

  public drawX(cell: Cell, color = 'red', cellColor = this.cellColor): void {
    if (this.drawing) {
      const { x1, x4, y1, y2 } = this.cellOffsets(cell);

      this.drawCell(cell, cellColor);

      this.drawing.line({ x: x1, y: y1 }, { x: x4, y: y2 }, color);
      this.drawing.line({ x: x1, y: y2 }, { x: x4, y: y1 }, color);
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
