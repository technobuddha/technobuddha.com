import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type Kind,
  type MazeProperties,
  type Pillar,
} from './maze.ts';
import { SquareMaze } from './square-maze.ts';

type WeaveMazeProperties = MazeProperties & {
  gapSize?: number;
};

export class WeaveMaze extends SquareMaze {
  public gapSize: number;

  public constructor({ cellSize = 22, wallSize = 2, gapSize = 2, ...props }: WeaveMazeProperties) {
    super({ cellSize, wallSize, ...props });
    this.gapSize = gapSize;
  }

  protected override offsets(_kind: Kind): Record<string, number> {
    const x0 = 0;
    const x1 = x0 + this.gapSize;
    const x2 = x1 + this.wallSize;
    const x5 = x0 + this.cellSize;
    const x4 = x5 - this.gapSize;
    const x3 = x4 - this.wallSize;

    const y0 = 0;
    const y1 = y0 + this.gapSize;
    const y2 = y1 + this.wallSize;
    const y5 = y0 + this.cellSize;
    const y4 = y5 - this.gapSize;
    const y3 = y4 - this.wallSize;

    return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 };
  }

  public override drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x1, x4, y1, y4 } = this.cellOffsets(cell);

      this.drawing.rect({ x: x1, y: y1 }, { x: x4, y: y4 }, color);
    }
  }

  public override drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);

      switch (cd.direction) {
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

  public override drawOutsideWall(_cd: CellDirection, _color = this.wallColor): void {
    // no-op
  }

  public override drawDoor(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 } = this.cellOffsets(cd);

      switch (cd.direction) {
        case 'n': {
          this.drawing.rect({ x: x1, y: y1 }, { x: x2, y: y0 }, color);
          this.drawing.rect({ x: x3, y: y1 }, { x: x4, y: y0 }, color);
          break;
        }
        case 's': {
          this.drawing.rect({ x: x1, y: y4 }, { x: x2, y: y5 }, color);
          this.drawing.rect({ x: x3, y: y4 }, { x: x4, y: y5 }, color);
          break;
        }
        case 'e': {
          this.drawing.rect({ x: x4, y: y1 }, { x: x5, y: y2 }, color);
          this.drawing.rect({ x: x4, y: y3 }, { x: x5, y: y4 }, color);
          break;
        }
        case 'w': {
          this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
          this.drawing.rect({ x: x0, y: y3 }, { x: x1, y: y4 }, color);
          break;
        }

        // no default
      }
    }
  }

  public override drawPillar({ x, y }: Cell, pillar: Pillar, color = this.wallColor): void {
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

  public override drawOutsidePillar(_cell: Cell, _pillar: Pillar, _color = this.wallColor): void {
    // no-op
  }

  public override drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      const { x2, x3, y2, y3 } = this.cellOffsets(cell);

      this.drawing.line({ x: x2, y: y2 }, { x: x3, y: y3 }, color);
      this.drawing.line({ x: x2, y: y3 }, { x: x3, y: y2 }, color);
    }
  }

  public override getRect(cell: Cell): Rect {
    const { x2, x3, y2, y3 } = this.cellOffsets(cell);

    return { x: x2, y: y2, w: x3 - x2, h: y3 - y2 };
  }
}
