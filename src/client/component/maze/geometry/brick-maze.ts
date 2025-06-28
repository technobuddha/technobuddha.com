import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.ts';

import { matrix } from './brick-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { Maze } from './maze.ts';

export type BrickMazeProperties = MazeProperties;

export class BrickMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 1, gapSize = 2, ...props }: BrickMazeProperties) {
    super({ cellSize, wallSize, gapSize, ...props }, matrix);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 2,
      groupHeight: this.cellSize * 2,
      verticalCellsPerGroup: 2,
      rightPadding: this.cellSize,
    };
  }

  public cellKind(cell: Cell): Kind {
    return modulo(cell.y, 2);
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
    const x1 = x0 + this.gapSize;
    const x2 = x1 + this.wallSize;
    const cx = x0 + this.cellSize;
    const x4 = cx - this.gapSize;
    const x3 = x4 - this.wallSize;
    const x5 = cx + this.gapSize;
    const x6 = x5 + this.wallSize;
    const x9 = x0 + this.cellSize * 2;
    const x8 = x9 - this.gapSize;
    const x7 = x8 - this.wallSize;

    const y0 = 0;
    const y1 = y0 + this.gapSize;
    const y2 = y1 + this.wallSize;
    const y5 = y0 + this.cellSize;
    const y4 = y5 - this.gapSize;
    const y3 = y4 - this.wallSize;

    return { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, y0, y1, y2, y3, y4, y5 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x1, x8, y1, y4 } = this.cellOffsets(cell);

      this.drawing.rect({ x: x1, y: y1 }, { x: x8, y: y4 }, color);
    }
  }

  public drawWall(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { x2, x3, y1, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: y1 }, { x: x3, y: y2 }, color);
          break;
        }
        case 'b': {
          const { x6, x7, y1, y2 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x6, y: y1 }, { x: x7, y: y2 }, color);
          break;
        }
        case 'c': {
          const { x7, x8, y2, y3 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x7, y: y2 }, { x: x8, y: y3 }, color);
          break;
        }
        case 'd': {
          const { x6, x7, y3, y4 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x6, y: y3 }, { x: x7, y: y4 }, color);
          break;
        }
        case 'e': {
          const { x2, x3, y3, y4 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x2, y: y3 }, { x: x3, y: y4 }, color);
          break;
        }
        case 'f': {
          const { x1, x2, y2, y3 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y2 }, { x: x2, y: y3 }, color);
          break;
        }

        // no default
      }
    }
  }

  public override drawDoor(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { x1, x2, x3, x4, y0, y1 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y1 }, color);
          this.drawing.rect({ x: x3, y: y0 }, { x: x4, y: y1 }, color);
          break;
        }

        case 'b': {
          const { x5, x6, x7, x8, y0, y1 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x5, y: y0 }, { x: x6, y: y1 }, color);
          this.drawing.rect({ x: x7, y: y0 }, { x: x8, y: y1 }, color);
          break;
        }

        case 'c': {
          const { x8, x9, y1, y2, y3, y4 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x8, y: y1 }, { x: x9, y: y2 }, color);
          this.drawing.rect({ x: x8, y: y3 }, { x: x9, y: y4 }, color);
          break;
        }

        case 'd': {
          const { x5, x6, x7, x8, y4, y5 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x5, y: y4 }, { x: x6, y: y5 }, color);
          this.drawing.rect({ x: x7, y: y4 }, { x: x8, y: y5 }, color);
          break;
        }

        case 'e': {
          const { x1, x2, x3, x4, y4, y5 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y4 }, { x: x2, y: y5 }, color);
          this.drawing.rect({ x: x3, y: y4 }, { x: x4, y: y5 }, color);
          break;
        }

        case 'f': {
          const { x0, x1, y1, y2, y3, y4 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          this.drawing.rect({ x: x0, y: y3 }, { x: x1, y: y4 }, color);
          break;
        }

        // no default
      }
    }
  }

  public override drawBridge(cell: CellDirection, _color = this.wallColor): void {
    if (this.drawing) {
      super.drawBridge(cell, this.wallColor);
      this.drawDoor(cell, this.wallColor);
    }
  }

  public override drawTunnel(cell: CellDirection, color = this.wallColor): void {
    this.drawDoor(cell, color);
  }

  public drawPillar({ x, y }: Cell, pillar: Pillar, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (pillar) {
        case 'ab': {
          const { x3, x6, y1, y2 } = this.cellOffsets({ x, y });
          this.drawing.rect({ x: x3, y: y1 }, { x: x6, y: y2 }, color);
          break;
        }
        case 'bc': {
          const { x7, x8, y1, y2 } = this.cellOffsets({ x, y });
          this.drawing.rect({ x: x7, y: y1 }, { x: x8, y: y2 }, color);
          break;
        }
        case 'cd': {
          const { x7, x8, y3, y4 } = this.cellOffsets({ x, y });
          this.drawing.rect({ x: x7, y: y3 }, { x: x8, y: y4 }, color);
          break;
        }
        case 'de': {
          const { x3, x6, y3, y4 } = this.cellOffsets({ x, y });
          this.drawing.rect({ x: x3, y: y3 }, { x: x6, y: y4 }, color);
          break;
        }
        case 'ef': {
          const { x1, x2, y3, y4 } = this.cellOffsets({ x, y });
          this.drawing.rect({ x: x1, y: y3 }, { x: x2, y: y4 }, color);
          break;
        }
        case 'fa': {
          const { x1, x2, y1, y2 } = this.cellOffsets({ x, y });
          this.drawing.rect({ x: x1, y: y1 }, { x: x2, y: y2 }, color);
          break;
        }
        // no default
      }
    }
  }

  public getRect(cell: CellDirection): Rect {
    const { x2, x7, y2, y3 } = this.cellOffsets(cell);

    return { x: x2, y: y2, width: x7 - x2, height: y3 - y2 };
  }

  public drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      const { x2, x7, y2, y3 } = this.cellOffsets(cell);

      this.drawing.line({ x: x2, y: y2 }, { x: x7, y: y3 }, color);
      this.drawing.line({ x: x2, y: y3 }, { x: x7, y: y2 }, color);
    }
  }
}
