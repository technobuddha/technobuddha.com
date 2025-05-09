/* eslint-disable @typescript-eslint/class-methods-use-this */

import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
} from './maze.ts';
import { Maze } from './maze.ts';
import {
  directionMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pathMatrix,
  pillarMatrix,
  preferredMatrix,
  rightTurnMatrix,
  straightMatrix,
  wallMatrix,
} from './square-matrix.ts';

export class SquareMaze extends Maze {
  public constructor({ cellSize = 16, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
      directionMatrix,
      pillarMatrix,
      wallMatrix,
      oppositeMatrix,
      rightTurnMatrix,
      leftTurnMatrix,
      straightMatrix,
      moveMatrix,
      preferredMatrix,
      pathMatrix,
    );
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

  public drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
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

  public drawX(cell: Cell, color = 'red'): void {
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

  public override toString(): string {
    let str = '';

    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        str += this.nexus({ x: x, y: y }).walls.n ? '+==' : '+  ';
      }
      str += '+\n';
      for (let x = 0; x < this.width; ++x) {
        str += this.nexus({ x: x, y: y }).walls.w ? '|  ' : '   ';
      }
      str += this.nexus({ x: this.width - 1, y: y }).walls.e ? '|\n' : ' \n';
    }
    for (let x = 0; x < this.width; ++x) {
      str += this.nexus({ x: x, y: this.height - 1 }).walls.s ? '+==' : '+  ';
    }
    str += '+\n';

    return str;
  }
}
