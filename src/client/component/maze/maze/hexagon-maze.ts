/* eslint-disable @typescript-eslint/class-methods-use-this */
import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.js';

import {
  cornerMatrix,
  directionMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  rightTurnMatrix,
  wallMatrix,
} from './hexagon-matrix.js';
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

const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
const SIN60 = Math.sin(Math.PI / 3);

export class HexagonMaze extends Maze {
  public constructor({ cellSize = 25, wallSize = 1, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, directionMatrix, cornerMatrix);
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize * 0.75, this.cellSize * 0.5];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize * SIN60, this.cellSize * SIN60];
  }

  protected cellKind(cell: Cell): number {
    return modulo(cell.x, 2);
  }

  protected initialWalls(): Wall {
    return { ...wallMatrix };
  }

  public opposite(direction: Direction): Direction {
    const opp = oppositeMatrix[direction];

    if (opp) {
      return opp;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public rightTurn(direction: Direction): Direction[] {
    const rt = rightTurnMatrix[direction];

    if (rt) {
      return rt;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public leftTurn(direction: Direction): Direction[] {
    const lt = leftTurnMatrix[direction];

    if (lt) {
      return lt;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public move(cell: Cell, direction: Direction): CellDirection {
    const mv = moveMatrix[this.cellKind(cell)][direction];

    if (mv) {
      return { x: cell.x + mv.x, y: cell.y + mv.y, direction };
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
      .filter((cd) => ['b', 'c', 'd'].includes(cd.direction))
      .map((cd) => cd.direction);
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(
      cell,
      cell.x * this.cellSize * 0.75,
      cell.y * this.cellSize * SIN60 +
        (this.cellKind(cell) === 0 ? 0 : (this.cellSize * SIN60) / 2),
    );
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;
    const x1 = x0 + (this.wallSize * TAN30) / 2;
    const x2 = x0 + this.wallSize / COS30;
    const x4 = x0 + this.cellSize * 0.25;
    const x5 = x4 + this.wallSize * TAN30;
    const x3 = x4 - (this.wallSize * TAN30) / 2;
    const x7 = x0 + this.cellSize * 0.75;
    const x6 = x7 - this.wallSize * TAN30;
    const x8 = x7 + (this.wallSize * TAN30) / 2;
    const xb = x0 + this.cellSize;
    const xa = xb - (this.wallSize * TAN30) / 2;
    const x9 = xb - this.wallSize / COS30;

    const y0 = 0;
    const y1 = y0 + this.wallSize / 2;
    const y2 = y0 + this.wallSize;
    const y4 = y0 + (this.cellSize * SIN60) / 2;
    const y3 = y4 - this.wallSize / 2;
    const y5 = y4 + this.wallSize / 2;
    const y8 = y0 + this.cellSize * SIN60;
    const y7 = y8 - this.wallSize / 2;
    const y6 = y8 - this.wallSize;

    return { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x3, x8, xb, y0, y4, y8 } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y4 },
          { x: x3, y: y0 },
          { x: x8, y: y0 },
          { x: xb, y: y4 },
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

      const { x1, x2, x3, x5, x6, x8, x9, xa, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.cellOffsets(cd);

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
              { x: xa, y: y3 },
            ],
            color,
          );
          break;
        }
        case 'c': {
          ctx.polygon(
            [
              { x: x9, y: y4 },
              { x: xa, y: y5 },
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
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.cellOffsets(cell);

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
              { x: xa, y: y3 },
              { x: xb, y: y4 },
              { x: xa, y: y5 },
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

  // public drawPath(cd: CellDirection, color = 'red'): void {
  //   if (this.drawing) {
  //     const { x2, x5, x6, x9, y2, y4, y5, y6 } = this.offsets(cd);

  //     this.drawCell(cd);

  //     switch (cd.direction) {
  //       case 'a': {
  //         this.drawing.polygon(
  //           [
  //             { x: x5, y: y6 },
  //             { x: x6, y: y6 },
  //             { x: (x5 + x6) / 2, y: y2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'b': {
  //         this.drawing.polygon(
  //           [
  //             { x: x2, y: y4 },
  //             { x: x5, y: y6 },
  //             { x: (x6 + x9) / 2, y: (y2 + y4) / 2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'c': {
  //         this.drawing.polygon(
  //           [
  //             { x: x2, y: y4 },
  //             { x: x5, y: y2 },
  //             { x: (x6 + x9) / 2, y: (y4 + y6) / 2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'd': {
  //         this.drawing.polygon(
  //           [
  //             { x: x5, y: y2 },
  //             { x: x6, y: y2 },
  //             { x: (x5 + x6) / 2, y: y6 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'e': {
  //         this.drawing.polygon(
  //           [
  //             { x: x6, y: y2 },
  //             { x: x9, y: y5 },
  //             { x: (x2 + x5) / 2, y: (y4 + y6) / 2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }
  //       case 'f': {
  //         this.drawing.polygon(
  //           [
  //             { x: x9, y: y4 },
  //             { x: x6, y: y6 },
  //             { x: (x2 + x5) / 2, y: (y2 + y4) / 2 },
  //           ],
  //           color,
  //         );
  //         break;
  //       }

  //       // no default
  //     }
  //   }
  // }

  public drawPath(cd: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const angle = { a: 90, b: 30, c: 330, d: 270, e: 210, f: 150 }[cd.direction]!;
      this.drawArrow(this.getRect(cd), angle, color);
    }
  }

  public drawX(cell: Cell, color = 'red', cellColor = this.cellColor): void {
    if (this.drawing) {
      const { x2, x5, x6, x9, y2, y4, y6 } = this.cellOffsets(cell);

      this.drawCell(cell, cellColor);

      this.drawing.line({ x: x2, y: y4 }, { x: x9, y: y4 }, color);
      this.drawing.line({ x: x5, y: y2 }, { x: x6, y: y6 }, color);
      this.drawing.line({ x: x6, y: y2 }, { x: x5, y: y6 }, color);
    }
  }

  public getRect(cell: Cell): Rect {
    const { x2, x9, y2, y6 } = this.cellOffsets(cell);

    return { x: x2, y: y2, w: x9 - x2, h: y6 - y2 };
  }
}
