import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type Direction,
  type DrawingSizes,
  type Kind,
  Maze,
  type MazeProperties,
  type Overrides,
} from './maze.ts';
import {
  directionMatrix,
  edgesMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pathMatrix,
  pillarMatrix,
  rightTurnMatrix,
  straightMatrix,
  wallMatrix,
} from './zeta-matrix.ts';

export class ZetaMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 6, ...props }: MazeProperties) {
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
      edgesMatrix,
      pathMatrix,
    );
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      groupHeight: this.cellSize,
      topPadding: this.wallSize,
      leftPadding: this.wallSize,
      rightPadding: this.wallSize,
      bottomPadding: this.wallSize,
    };
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected cellKind(_cell: Cell): number {
    return 0;
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(cell, cell.x * this.cellSize, cell.y * this.cellSize);
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const x1 = 0;
    const x8 = x1 + this.cellSize;
    const xc = (x1 + x8) / 2;
    const x2 = x1 + this.wallSize / Math.SQRT2;
    const x4 = xc - this.wallSize / 2;
    const x5 = xc + this.wallSize / 2;
    const x3 = x4 - this.wallSize / Math.SQRT2;
    const x6 = x5 + this.wallSize / Math.SQRT2;
    const x7 = x8 - this.wallSize / Math.SQRT2;
    const x0 = x1 - this.wallSize / Math.SQRT2;
    const x9 = x8 + this.wallSize / Math.SQRT2;

    const y1 = 0;
    const y8 = y1 + this.cellSize;
    const yc = (y1 + y8) / 2;
    const y2 = y1 + this.wallSize / Math.SQRT2;
    const y4 = yc - this.wallSize / 2;
    const y5 = yc + this.wallSize / 2;
    const y3 = y4 - this.wallSize / Math.SQRT2;
    const y6 = y5 + this.wallSize / Math.SQRT2;
    const y7 = y8 - this.wallSize / Math.SQRT2;
    const y0 = y1 - this.wallSize / Math.SQRT2;
    const y9 = y8 + this.wallSize / Math.SQRT2;
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
      x9,
      y0,
      y1,
      y2,
      y3,
      y4,
      y5,
      y6,
      y7,
      y8,
      y9,
    };
  }

  public override removeWall(
    cell: Cell,
    direction: Direction,
    { walls = this.walls }: Overrides = {},
  ): void {
    super.removeWall(cell, direction, { walls });

    switch (direction) {
      case 'b': {
        const c1 = this.move(cell, 'a');
        const c2 = this.move(cell, 'c');

        if (c1) {
          delete walls[c1.x][c1.y].d;
          this.drawCell(c1);
        }
        if (c2) {
          delete walls[c2.x][c2.y].h;
          this.drawCell(c2);
        }
        break;
      }

      case 'd': {
        const c1 = this.move(cell, 'c');
        const c2 = this.move(cell, 'e');

        if (c1) {
          delete walls[c1.x][c1.y].f;
          this.drawCell(c1);
        }
        if (c2) {
          delete walls[c2.x][c2.y].b;
          this.drawCell(c2);
        }
        break;
      }

      case 'f': {
        const c1 = this.move(cell, 'e');
        const c2 = this.move(cell, 'g');

        if (c1) {
          delete walls[c1.x][c1.y].h;
          this.drawCell(c1);
        }
        if (c2) {
          delete walls[c2.x][c2.y].d;
          this.drawCell(c2);
        }
        break;
      }

      case 'h': {
        const c1 = this.move(cell, 'a');
        const c2 = this.move(cell, 'g');

        if (c1) {
          delete walls[c1.x][c1.y].f;
          this.drawCell(c1);
        }
        if (c2) {
          delete walls[c2.x][c2.y].b;
          this.drawCell(c2);
        }
        break;
      }

      // no default
    }
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const { x1, x2, x7, x8, y1, y2, y7, y8 } = this.cellOffsets(cell);

      this.drawing.polygon(
        [
          { x: x1, y: y7 },
          { x: x1, y: y2 },
          { x: x2, y: y1 },
          { x: x7, y: y1 },
          { x: x8, y: y2 },
          { x: x8, y: y7 },
          { x: x7, y: y8 },
          { x: x2, y: y8 },
        ],
        color,
      );
      // this.drawing.rect({ x: x1, y: y1 }, { x: x8, y: y8 }, color);
    }
  }

  public override drawCell<T extends Cell>(
    cell: T,
    cellColor = this.cellColor,
    wallColor = this.wallColor,
    { walls = this.walls }: Overrides = {},
  ): T {
    this.drawFloor(
      cell,
      this.isSame(cell, this.entrance) ? this.entranceColor
      : this.isSame(cell, this.exit) ? this.exitColor
      : cellColor,
    );

    const wall = walls[cell.x][cell.y];
    for (const direction of directionMatrix) {
      switch (wall[direction]) {
        case true: {
          this.drawWall({ ...cell, direction }, wallColor);
          break;
        }

        case false: {
          this.drawBridge({ ...cell, direction }, cellColor);
          break;
        }

        case undefined: {
          this.drawShortWall({ ...cell, direction }, wallColor);
        }

        // no default
      }
    }

    for (const pillar of this.pillars) {
      // if (pillar[0] in wall && pillar[1] in wall) {
      this.drawPillar({ ...cell, pillar }, wallColor);
      // }
    }

    return cell;
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      this.cellOffsets(cd);
      switch (cd.direction) {
        case 'a': {
          const { x4, x5, y1, y3 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x4, y: y1 }, { x: x5, y: y3 }, color);
          break;
        }

        case 'b': {
          const { x5, x6, x9, x8, y0, y1, y3, y4 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x5, y: y3 },
              { x: x8, y: y0 },
              { x: x9, y: y1 },
              { x: x6, y: y4 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x6, x8, y4, y5 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x6, y: y4 }, { x: x8, y: y5 }, color);
          break;
        }

        case 'd': {
          const { x5, x6, x8, x9, y5, y6, y8, y9 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x5, y: y6 },
              { x: x6, y: y5 },
              { x: x9, y: y8 },
              { x: x8, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { x4, x5, y6, y8 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x4, y: y6 }, { x: x5, y: y8 }, color);
          break;
        }

        case 'f': {
          const { x0, x1, x3, x4, y5, y6, y8, y9 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x0, y: y8 },
              { x: x3, y: y5 },
              { x: x4, y: y6 },
              { x: x1, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'g': {
          const { x1, x3, y4, y5 } = this.cellOffsets(cd);
          this.drawing.rect({ x: x1, y: y4 }, { x: x3, y: y5 }, color);
          break;
        }

        case 'h': {
          const { x0, x1, x3, x4, y0, y1, y3, y4 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x0, y: y1 },
              { x: x1, y: y0 },
              { x: x4, y: y3 },
              { x: x3, y: y4 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawShortWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      this.cellOffsets(cd);
      switch (cd.direction) {
        case 'a':
        case 'c':
        case 'e':
        case 'g': {
          this.drawWall(cd, color);
          break;
        }

        case 'b': {
          const { x5, x6, x7, x8, y1, y2, y3, y4 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x5, y: y3 },
              { x: x7, y: y1 },
              { x: x8, y: y2 },
              { x: x6, y: y4 },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x5, x6, x7, x8, y5, y6, y7, y8 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x5, y: y6 },
              { x: x6, y: y5 },
              { x: x8, y: y7 },
              { x: x7, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'f': {
          const { x1, x2, x3, x4, y5, y6, y7, y8 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x1, y: y7 },
              { x: x3, y: y5 },
              { x: x4, y: y6 },
              { x: x2, y: y8 },
            ],
            color,
          );

          break;
        }

        case 'h': {
          const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x1, y: y2 },
              { x: x2, y: y1 },
              { x: x4, y: y3 },
              { x: x3, y: y4 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawBridge(cd: CellDirection, color = this.cellColor): void {
    if (this.drawing) {
      this.cellOffsets(cd);
      switch (cd.direction) {
        case 'b': {
          const { x7, x8, x9, y0, y1 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x7, y: y1 },
              { x: x8, y: y0 },
              { x: x9, y: y1 },
            ],
            color,
          );
          break;
        }

        case 'd': {
          const { x7, x8, x9, y7, y8, y9 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x7, y: y8 },
              { x: x8, y: y7 },
              { x: x9, y: y8 },
              { x: x8, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'f': {
          const { x0, x1, x2, y7, y8, y9 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x0, y: y8 },
              { x: x1, y: y7 },
              { x: x2, y: y8 },
              { x: x1, y: y9 },
            ],
            color,
          );

          break;
        }

        case 'h': {
          const { x0, x1, x2, y0, y1, y2 } = this.cellOffsets(cd);
          this.drawing.polygon(
            [
              { x: x0, y: y1 },
              { x: x1, y: y0 },
              { x: x2, y: y1 },
              { x: x1, y: y2 },
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
      switch (cell.pillar) {
        case 'ab': {
          const { x5, x7, y1, y3 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y3 },
              { x: x7, y: y1 },
              { x: x5, y: y1 },
            ],
            color,
          );
          break;
        }

        case 'bc': {
          const { x6, x8, y2, y4 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x6, y: y4 },
              { x: x8, y: y4 },
              { x: x8, y: y2 },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { x6, x8, y5, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x6, y: y5 },
              { x: x8, y: y5 },
              { x: x8, y: y7 },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x5, x7, y6, y8 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y8 },
              { x: x5, y: y6 },
              { x: x7, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'ef': {
          const { x2, x4, y6, y8 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y8 },
              { x: x4, y: y6 },
              { x: x4, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'fg': {
          const { x1, x3, y5, y7 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y7 },
              { x: x1, y: y5 },
              { x: x3, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'gh': {
          const { x1, x3, y2, y4 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y4 },
              { x: x3, y: y4 },
              { x: x1, y: y2 },
            ],
            color,
          );
          break;
        }

        case 'ha': {
          const { x2, x4, y1, y3 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x2, y: y1 },
              { x: x4, y: y1 },
              { x: x4, y: y3 },
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
      const { x3, x4, x5, x6, y3, y4, y5, y6 } = this.cellOffsets(cell);

      this.drawing.line({ x: x4, y: y3 }, { x: x5, y: y6 }, color);
      this.drawing.line({ x: x5, y: y3 }, { x: x4, y: y6 }, color);
      this.drawing.line({ x: x3, y: y5 }, { x: x6, y: y4 }, color);
      this.drawing.line({ x: x6, y: y5 }, { x: x3, y: y4 }, color);
    }
  }

  public getRect(cell: Cell): Rect {
    const { x3, x6, y3, y6 } = this.cellOffsets(cell);

    return { x: x3, y: y3, w: x6 - x3, h: y6 - y3 };
  }

  public override removeInteriorWalls(): void {
    super.removeInteriorWalls();
    this.freezeWalls();
  }

  public override freezeWalls(): void {
    for (let x = 1; x < this.width; ++x) {
      for (let y = 1; y < this.height; ++y) {
        if (this.random() < 0.5) {
          // remove walls on the \ diagonal
          delete this.walls[x][y].h;
          delete this.walls[x - 1][y - 1].d;
        } else {
          // remove walls on the / diagonal
          delete this.walls[x - 1][y].b;
          delete this.walls[x][y - 1].f;
        }
      }
    }
  }
}
