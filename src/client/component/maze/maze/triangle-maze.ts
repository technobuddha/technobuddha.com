/* eslint-disable @typescript-eslint/class-methods-use-this */
import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.js';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type Kind,
  type MazeProperties,
} from './maze.js';
import { Maze } from './maze.js';
import {
  directionMatrix,
  edgesMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pillarMatrix,
  rightTurnMatrix,
  sidesMatrix,
  wallMatrix,
} from './triangle-matrix.js';

const SIN60 = Math.sin(Math.PI / 3);

export class TriangleMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      directionMatrix,
      pillarMatrix,
      wallMatrix,
      oppositeMatrix,
      rightTurnMatrix,
      leftTurnMatrix,
      moveMatrix,
      sidesMatrix,
      edgesMatrix,
    );
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize / 2, this.cellSize / 4];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize * SIN60, 0];
  }

  protected cellKind(cell: Cell): number {
    return modulo(cell.x + cell.y, 2);
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(
      cell,
      cell.x * this.cellSize * 0.5,
      cell.y * this.cellSize * SIN60,
    );
  }

  protected offsets(kind: Kind): Record<string, number> {
    const x0 = 0;
    const x1 = x0 + this.wallSize * SIN60;
    const x2 = x1 + this.wallSize * SIN60;
    const x8 = x0 + this.cellSize;
    const x7 = x8 - this.wallSize * SIN60;
    const x6 = x7 - this.wallSize * SIN60;
    const x4 = (x0 + x8) / 2;
    const x3 = x4 - this.wallSize * SIN60;
    const x5 = x4 + this.wallSize * SIN60;

    const y5 = 0;
    const y4 = y5 + this.wallSize;
    const y3 = y4 + this.wallSize * 0.5;
    const y0 = y5 + this.cellSize * SIN60;
    const y1 = y0 - this.wallSize * 1.5;
    const y2 = y1 - this.wallSize * 0.5;

    const sx0 = x0 + this.cellSize * 0.375;
    const sx1 = sx0 + this.cellSize / 4;

    if (kind === 1) {
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
      const { x0, x4, x8, y0, y5 } = this.cellOffsets(cell);

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

      const { x1, x2, x3, x4, x5, x6, x7, y1, y2, y3, y4, y5 } = this.cellOffsets(cd);

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

  public drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      const ctx = this.drawing;
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5 } = this.cellOffsets({
        x,
        y,
      });

      switch (pillar) {
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

  // public drawPath(cell: CellDirection, color = 'red'): void {
  //   if (this.drawing) {
  //     const { x2, x4, x6, y2, y4 } = this.cellOffsets(cell);

  //     this.drawCell(cell);

  //     switch (cell.direction) {
  //       case 'a':
  //       case 'd': {
  //         this.drawing.line({ x: x4, y: y2 }, { x: x4, y: y4 }, color);
  //         this.drawing.line({ x: x4, y: y4 }, { x: (x4 + x6) / 2, y: (y2 + y4) / 2 }, color);
  //         this.drawing.line({ x: x4, y: y4 }, { x: (x4 + x2) / 2, y: (y2 + y4) / 2 }, color);
  //         break;
  //       }
  //       case 'e':
  //       case 'f': {
  //         this.drawing.line({ x: x6, y: y4 }, { x: (x4 + x2) / 2, y: (y2 + y4) / 2 }, color);
  //         this.drawing.line(
  //           { x: (x4 + x2) / 2, y: (y2 + y4) / 2 },
  //           { x: (x4 + x6) / 2, y: (y2 + y4) / 2 },
  //           color,
  //         );
  //         this.drawing.line({ x: (x4 + x2) / 2, y: (y2 + y4) / 2 }, { x: x4, y: y4 }, color);
  //         break;
  //       }
  //       case 'c':
  //       case 'b': {
  //         this.drawing.line({ x: x2, y: y4 }, { x: (x4 + x6) / 2, y: (y2 + y4) / 2 }, color);
  //         this.drawing.line(
  //           { x: (x4 + x6) / 2, y: (y2 + y4) / 2 },
  //           { x: (x4 + x2) / 2, y: (y2 + y4) / 2 },
  //           color,
  //         );
  //         this.drawing.line({ x: (x4 + x6) / 2, y: (y2 + y4) / 2 }, { x: x4, y: y4 }, color);
  //         break;
  //       }

  //       // no default
  //     }
  //   }
  // }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const angle = { a: 270, b: 30, c: 150, d: 270, e: 30, f: 150 }[cell.direction]!;
      this.drawCell(cell);
      this.drawArrow(this.getRect(cell), angle, color);
    }
  }

  public drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      const { x2, x4, x6, y2, y4 } = this.cellOffsets(cell);
      const yc = (y2 + y4) / 2;

      this.drawing.line({ x: x2, y: y4 }, { x: x4, y: yc }, color);
      this.drawing.line({ x: x6, y: y4 }, { x: x4, y: yc }, color);
      this.drawing.line({ x: x4, y: y2 }, { x: x4, y: yc }, color);
    }
  }

  public getRect(cell: Cell): Rect {
    const { x2, x6, y2, y4 } = this.cellOffsets(cell);

    return {
      x: x2 + this.wallSize,
      y: y2 + this.wallSize,
      w: x6 - x2 - this.wallSize * 2,
      h: y4 - y2 - this.wallSize * 2,
    };
  }
}
