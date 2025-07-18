import { type Cartesian, largestInscribedRectangle, type Rect } from '@technobuddha/library';

import { type Cell, type CellDirection, type Kind, type Pillar } from '../geometry.ts';
import { type DrawingSizes, Maze, type MazeProperties } from '../maze.ts';

import { matrix } from './square-matrix.ts';

export type SquareMazeProperties = MazeProperties;

export class SquareMaze extends Maze {
  public constructor({
    cellSize = 28,
    wallSize = 2,
    voidSize = 1,
    ...props
  }: SquareMazeProperties) {
    super({ cellSize, wallSize, voidSize, ...props }, matrix);
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

  protected cellOrigin(cell: Cell): Cartesian {
    return { x: cell.x * this.cellSize, y: cell.y * this.cellSize };
  }

  protected override offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;
    const x1 = x0 + this.voidSize;
    const x2 = x1 + this.wallSize;
    const x5 = x0 + this.cellSize;
    const x4 = x5 - this.voidSize;
    const x3 = x4 - this.wallSize;

    const y0 = 0;
    const y1 = y0 + this.voidSize;
    const y2 = y1 + this.wallSize;
    const y5 = y0 + this.cellSize;
    const y4 = y5 - this.voidSize;
    const y3 = y4 - this.wallSize;

    return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 };
  }

  public override drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      const { x0, x1, x4, x5, y0, y1, y4, y5 } = this.cellOffsets(cell);
      this.drawing.rect({ x: x0, y: y0 }, { x: x5, y: y5 }, this.color.void);
      this.drawing.rect({ x: x1, y: y1 }, { x: x4, y: y4 }, color);
    }
  }

  public override drawWall(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cell);

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'n': {
          this.drawing.rect({ x: x2, y: y1 }, { x: x3, y: y2 }, color);
          break;
        }
        case 's': {
          this.drawing.rect({ x: x2, y: y3 }, { x: x3, y: y4 }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x3, y: y2 }, { x: x4, y: y3 }, color);
          break;
        }
        case 'w': {
          this.drawing.rect({ x: x1, y: y2 }, { x: x2, y: y3 }, color);
          break;
        }

        // no default
      }
    }
  }

  public override drawPassage(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 } = this.cellOffsets(cell);

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'n': {
          this.drawing.rect({ x: x1, y: y1 }, { x: x2, y: y0 }, color);
          this.drawing.rect({ x: x2, y: y1 }, { x: x3, y: y0 }, this.color.cell);
          this.drawing.rect({ x: x3, y: y1 }, { x: x4, y: y0 }, color);
          break;
        }
        case 's': {
          this.drawing.rect({ x: x1, y: y4 }, { x: x2, y: y5 }, color);
          this.drawing.rect({ x: x2, y: y4 }, { x: x3, y: y5 }, this.color.cell);
          this.drawing.rect({ x: x3, y: y4 }, { x: x4, y: y5 }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x4, y: y1 }, { x: x5, y: y2 }, color);
          this.drawing.rect({ x: x4, y: y2 }, { x: x5, y: y3 }, this.color.cell);
          this.drawing.rect({ x: x4, y: y3 }, { x: x5, y: y4 }, color);
          break;
        }
        case 'w': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y3 }, this.color.cell);
          this.drawing.rect({ x: x0, y: y3 }, { x: x1, y: y4 }, color);
          break;
        }

        // no default
      }
    }
  }

  public override drawPillar({ x, y }: Cell, pillar: Pillar, color = this.color.wall): void {
    if (this.drawing) {
      const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets({ x, y });

      if (pillar === 'nw') {
        this.drawing.rect({ x: x1, y: y1 }, { x: x2, y: y2 }, color);
      }
      if (pillar === 'ne') {
        this.drawing.rect({ x: x3, y: y1 }, { x: x4, y: y2 }, color);
      }
      if (pillar === 'sw') {
        this.drawing.rect({ x: x1, y: y3 }, { x: x2, y: y4 }, color);
      }
      if (pillar === 'se') {
        this.drawing.rect({ x: x3, y: y3 }, { x: x4, y: y4 }, color);
      }
    }
  }

  public override drawX(cell: Cell, color = this.color.blocked): void {
    if (this.drawing) {
      const { x2, x3, y2, y3 } = this.cellOffsets(cell);

      this.drawing.line({ x: x2, y: y2 }, { x: x3, y: y3 }, color);
      this.drawing.line({ x: x2, y: y3 }, { x: x3, y: y2 }, color);
    }
  }

  protected getRect(cell: Cell): Rect {
    const { x1, x4, y1, y4 } = this.cellOffsets(cell);

    const polygon = [
      { x: x1, y: y1 },
      { x: x4, y: y1 },
      { x: x4, y: y4 },
      { x: x1, y: y4 },
    ];

    return largestInscribedRectangle(polygon, { squareOnly: true });
  }
}
