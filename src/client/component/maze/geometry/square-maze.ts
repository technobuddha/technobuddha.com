/* eslint-disable @typescript-eslint/class-methods-use-this */

import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { Maze } from './maze.ts';
import { matrix } from './square-matrix.ts';

export class SquareMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 2, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      groupHeight: this.cellSize,
    };
  }

  public cellKind(_cell: Cell): number {
    return 0;
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(cell, cell.x * this.cellSize, cell.y * this.cellSize);
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;
    const x3 = x0 + this.cellSize;
    const x1 = x0 + this.wallSize;
    const x2 = x3 - this.wallSize;

    const y0 = 0;
    const y3 = y0 + this.cellSize;
    const y1 = y0 + this.wallSize;
    const y2 = y3 - this.wallSize;

    return { x0, x1, x2, x3, y0, y1, y2, y3 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x0, x3, y0, y3 } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x0, y: y0 },
          { x: x3, y: y0 },
          { x: x3, y: y3 },
          { x: x0, y: y3 },
        ],
        color,
      );
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, y0, y1, y2, y3 } = this.cellOffsets(cd);

      switch (cd.direction) {
        case 'n': {
          this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y1 }, color);
          break;
        }
        case 's': {
          this.drawing.rect({ x: x1, y: y2 }, { x: x2, y: y3 }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x2, y: y1 }, { x: x3, y: y2 }, color);
          break;
        }
        case 'w': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPillar({ x, y }: Cell, pillar: Pillar, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, y0, y1, y2, y3 } = this.cellOffsets({ x, y });

      if (pillar === 'nw') {
        this.drawing.rect({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
      }
      if (pillar === 'ne') {
        this.drawing.rect({ x: x2, y: y0 }, { x: x3, y: y1 }, color);
      }
      if (pillar === 'sw') {
        this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y3 }, color);
      }
      if (pillar === 'se') {
        this.drawing.rect({ x: x2, y: y2 }, { x: x3, y: y3 }, color);
      }
    }
  }
  public override drawTunnel(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, y0, y1, y2, y3 } = this.cellOffsets(cd);
      const ww = this.wallSize;

      switch (cd.direction) {
        case 'n': {
          this.drawing.rect({ x: x1, y: y0 }, { x: x1 + ww, y: y0 + ww }, color);
          this.drawing.rect({ x: x2, y: y0 }, { x: x2 - ww, y: y0 + ww }, color);
          break;
        }
        case 's': {
          this.drawing.rect({ x: x1, y: y3 }, { x: x1 + ww, y: y3 - ww }, color);
          this.drawing.rect({ x: x2, y: y3 }, { x: x2 - ww, y: y3 - ww }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x3 - ww, y: y1 }, { x: x3, y: y1 + ww }, color);
          this.drawing.rect({ x: x3 - ww, y: y2 - ww }, { x: x3, y: y3 }, color);
          break;
        }
        case 'w': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x0 + ww, y: y1 + ww }, color);
          this.drawing.rect({ x: x0, y: y2 - ww }, { x: x0 + ww, y: y2 }, color);
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      const { x1, x2, y1, y2 } = this.cellOffsets(cell);

      this.drawing.line({ x: x1, y: y1 }, { x: x2, y: y2 }, color);
      this.drawing.line({ x: x1, y: y2 }, { x: x2, y: y1 }, color);
    }
  }

  public getRect(cell: Cell): Rect {
    const { x1, x2, y1, y2 } = this.cellOffsets(cell);

    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }
}
