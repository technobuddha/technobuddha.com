/* eslint-disable @typescript-eslint/class-methods-use-this */
import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.js';

import {
  directionMatrix,
  edgesMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pathMatrix,
  pillarMatrix,
  rightTurnMatrix,
  sidesMatrix,
  wallMatrix,
} from './hexagon-matrix.js';
import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
} from './maze.js';
import { Maze } from './maze.js';

const COS30 = Math.cos(Math.PI / 6);
const TAN30 = Math.tan(Math.PI / 6);
const SIN60 = Math.sin(Math.PI / 3);

export class HexagonMaze extends Maze {
  public constructor({ cellSize = 25, wallSize = 1, ...props }: MazeProperties) {
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
      pathMatrix,
    );
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 0.75,
      groupHeight: this.cellSize * SIN60,
      leftPadding: this.cellSize * 0.25,
      rightPadding: this.cellSize * 0.25,
      topPadding: (this.cellSize * SIN60) / 2,
      bottomPadding: (this.cellSize * SIN60) / 2,
    };
  }

  protected cellKind(cell: Cell): number {
    return modulo(cell.x, 2);
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

  public drawPillar(cell: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      const ctx = this.drawing;
      const { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, y0, y1, y2, y3, y4, y5, y6, y7, y8 } =
        this.cellOffsets(cell);

      switch (cell.pillar) {
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

  public drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      const { x2, x5, x6, x9, y2, y4, y6 } = this.cellOffsets(cell);

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
