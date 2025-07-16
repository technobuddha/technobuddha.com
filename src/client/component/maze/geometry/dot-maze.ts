import { type Cartesian, modulo, type Rect } from '@technobuddha/library';

import { matrix } from './dot-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type Direction,
  type DrawingSizes,
  type Kind,
  Maze,
  type MazeProperties,
  type Pillar,
} from './maze.ts';

export type DotMazeProperties = MazeProperties;

const { SQRT1_2 } = Math;

export class DotMaze extends Maze {
  public constructor({ cellSize = 32, wallSize = 8, voidSize = 2, ...props }: MazeProperties) {
    super({ cellSize, wallSize, voidSize, ...props }, matrix);
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

  public cellKind(_cell: Cell): number {
    return 0;
  }

  protected cellOrigin(cell: Cell): Cartesian {
    return { x: cell.x * this.cellSize, y: cell.y * this.cellSize };
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const c = this.cellSize;
    const w = this.wallSize;
    const v = this.voidSize;

    const x0 = 0;
    const x1 = x0 + v;
    const x3 = x1 + w * SQRT1_2;
    const x2 = x3 - v * SQRT1_2;
    const x4 = x3 + v * SQRT1_2;
    const x7 = x0 + c * 0.5;
    const x6 = x7 - w * 0.5;
    const x5 = x6 - w * SQRT1_2;
    const x8 = x7 + w * 0.5;
    const x9 = x8 + w * SQRT1_2;
    const xe = x0 + c;
    const xd = xe - v;
    const xb = xd - w * SQRT1_2;
    const xa = xb - v * SQRT1_2;
    const xc = xb + v * SQRT1_2;

    const y0 = 0;
    const y1 = y0 + v;
    const y3 = y1 + w * SQRT1_2;
    const y2 = y3 - v * SQRT1_2;
    const y4 = y3 + v * SQRT1_2;
    const y7 = y0 + c * 0.5;
    const y6 = y7 - w * 0.5;
    const y5 = y6 - w * SQRT1_2;
    const y8 = y7 + w * 0.5;
    const y9 = y8 + w * SQRT1_2;
    const ye = y0 + c;
    const yd = ye - v;
    const yb = yd - w * SQRT1_2;
    const ya = yb - v * SQRT1_2;
    const yc = yb + v * SQRT1_2;

    // prettier-ignore
    return {
      x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, xc, xd, xe,
      y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb, yc, yd, ye,
    };
  }

  public override removeWall(cell: Cell, direction: Direction): void {
    super.removeWall(cell, direction);

    const cells = [
      { x: cell.x + 1, y: cell.y + 1 },
      { x: cell.x - 1, y: cell.y + 1 },
      { x: cell.x + 1, y: cell.y - 1 },
      { x: cell.x - 1, y: cell.y - 1 },
    ];
    for (const c of cells) {
      if (this.inMaze(c)) {
        this.drawIntersections(c);
      }
    }
  }

  public override addWall(cell: Cell, direction: Direction): void {
    super.addWall(cell, direction);

    const cells = [
      { x: cell.x + 1, y: cell.y + 1 },
      { x: cell.x - 1, y: cell.y + 1 },
      { x: cell.x + 1, y: cell.y - 1 },
      { x: cell.x - 1, y: cell.y - 1 },
    ];
    for (const c of cells) {
      if (this.inMaze(c)) {
        this.drawIntersections(c);
      }
    }
  }

  public override drawCell<T extends Cell>(cell: T, color = this.color.cell): T {
    if (this.drawing) {
      const { x7, x8, y7, y9 } = this.cellOffsets(cell);

      super.drawCell(cell, color);
      this.drawIntersections(cell);

      const x = x7;
      const y = y7;
      const r = Math.hypot(x8 - x, y9 - y);

      this.drawing.circle({ x, y }, r, this.cellColor(cell, color));
    }

    return cell;
  }

  public override drawFloor(cell: Cell, color = this.color.cell): void {
    if (this.drawing) {
      const { x0, x1, xd, xe, y0, y1, yd, ye } = this.cellOffsets(cell);

      this.drawing.rect({ x: x0, y: y0 }, { x: xe, y: ye }, this.color.void);
      this.drawing.rect({ x: x1, y: y1 }, { x: xd, y: yd }, color);
    }
  }

  // Pillars are always displayed
  public override drawPillars(cell: Cell, color = this.color.wall): void {
    for (const pillar of this.pillars) {
      this.drawPillar(cell, pillar, color);
    }
  }

  public override drawWall(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { x6, x8, y1, y5 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x6, y: y1 }, { x: x8, y: y5 }, color);
          break;
        }

        case 'b': {
          const { x8, x9, xb, xd, y1, y3, y5, y6 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xb, y: y1 },
              { x: xd, y: y3 },
              { x: x9, y: y6 },
              { x: x8, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { x9, xd, y6, y8 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x9, y: y6 }, { x: xd, y: y8 }, color);
          break;
        }

        case 'd': {
          const { x8, x9, xb, xd, y8, y9, yb, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x9, y: y8 },
              { x: xd, y: yb },
              { x: xb, y: yd },
              { x: x8, y: y9 },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { x6, x8, y9, yd } = this.cellOffsets(cell);
          this.drawing.rect({ x: x6, y: y9 }, { x: x8, y: yd }, color);
          break;
        }

        case 'f': {
          const { x1, x3, x5, x6, y8, y9, yb, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y8 },
              { x: x6, y: y9 },
              { x: x3, y: yd },
              { x: x1, y: yb },
            ],
            color,
          );

          break;
        }

        case 'g': {
          const { x1, x5, y6, y8 } = this.cellOffsets(cell);
          this.drawing.rect({ x: x1, y: y6 }, { x: x5, y: y8 }, color);
          break;
        }

        case 'h': {
          const { x1, x3, x5, x6, y1, y3, y5, y6 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y1 },
              { x: x6, y: y5 },
              { x: x5, y: y6 },
              { x: x1, y: y3 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public override drawPassage(cell: CellDirection, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { x3, x6, x8, xb, y0, y1 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y0 },
              { x: x6, y: y0 },
              { x: x6, y: y1 },
              { x: x3, y: y1 },
            ],
            color,
          );

          this.drawing.rect({ x: x6, y: y0 }, { x: x8, y: y1 }, this.color.cell);

          this.drawing.polygon(
            [
              { x: x8, y: y0 },
              { x: xb, y: y0 },
              { x: xb, y: y1 },
              { x: x8, y: y1 },
            ],
            color,
          );
          break;
        }

        case 'c': {
          const { xd, xe, y3, y6, y8, yb } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: xe, y: y3 },
              { x: xe, y: y6 },
              { x: xd, y: y6 },
              { x: xd, y: y3 },
            ],
            color,
          );

          this.drawing.rect({ x: xd, y: y6 }, { x: xe, y: y8 }, this.color.cell);

          this.drawing.polygon(
            [
              { x: xe, y: y8 },
              { x: xe, y: yb },
              { x: xd, y: yb },
              { x: xd, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'e': {
          const { x3, x6, x8, xb, yd, ye } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x3, y: ye },
              { x: x6, y: ye },
              { x: x6, y: yd },
              { x: x3, y: yd },
            ],
            color,
          );

          this.drawing.rect({ x: x6, y: yd }, { x: x8, y: ye }, this.color.cell);

          this.drawing.polygon(
            [
              { x: x8, y: yd },
              { x: xb, y: yd },
              { x: xb, y: ye },
              { x: x8, y: ye },
            ],
            color,
          );
          break;
        }

        case 'g': {
          const { x0, x1, y3, y6, y8, yb } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y3 },
              { x: x0, y: y6 },
              { x: x1, y: y6 },
              { x: x1, y: y3 },
            ],
            color,
          );

          this.drawing.rect({ x: x0, y: y6 }, { x: x1, y: y8 }, this.color.cell);

          this.drawing.polygon(
            [
              { x: x0, y: y8 },
              { x: x0, y: yb },
              { x: x1, y: yb },
              { x: x1, y: y8 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawIntersections(cell: Cell, tunnels = true): void {
    if (this.drawing) {
      const { walls, barriers } = this.nexus(cell);
      const { x0, x1, x2, x3, xb, xc, xd, xe, y0, y1, y2, y3, yc, yd, yb, ye } =
        this.cellOffsets(cell);

      const nCell = { x: cell.x, y: cell.y - 1 };
      const eCell = { x: cell.x + 1, y: cell.y };
      const wCell = { x: cell.x - 1, y: cell.y };
      const sCell = { x: cell.x, y: cell.y + 1 };

      // b
      const crossedB = this.inMaze(nCell) && this.nexus(nCell).walls.d === false;

      if (walls.b || barriers.b) {
        if (crossedB) {
          this.drawing.polygon(
            [
              { x: xc, y: y0 },
              { x: xe, y: y0 },
              { x: xe, y: y2 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xb, y: y0 },
              { x: xc, y: y0 },
              { x: xe, y: y2 },
              { x: xe, y: y3 },
              { x: xd, y: y3 },
              { x: xb, y: y1 },
            ],
            this.color.wall, // lime
          );
        } else {
          this.drawing.polygon(
            [
              { x: xb, y: y1 },
              { x: xd, y: y1 },
              { x: xd, y: y3 },
            ],
            this.color.wall, // maybe void
          );
        }
      } else {
        this.drawing.polygon(
          [
            { x: xb, y: y1 },
            { x: xc, y: y0 },
            { x: xe, y: y0 },
            { x: xe, y: y2 },
            { x: xd, y: y3 },
          ],
          this.color.cell, // wall extension
        );
        this.drawing.polygon(
          [
            { x: xb, y: y0 },
            { x: xc, y: y0 },
            { x: xb, y: y1 },
          ],
          this.color.wall, // yellow,
        );
        this.drawing.polygon(
          [
            { x: xd, y: y3 },
            { x: xe, y: y3 },
            { x: xe, y: y2 },
          ],
          this.color.wall, // yellow,
        );

        if (tunnels && crossedB && modulo(cell.x + cell.y, 2) === 0) {
          this.drawing.line({ x: xb, y: y1 }, { x: xd, y: y3 }, this.color.tunnel);
        }
      }

      // d
      const crossedD = this.inMaze(eCell) && this.nexus(eCell).walls.f === false;

      if (walls.d || barriers.d) {
        if (crossedD) {
          this.drawing.polygon(
            [
              { x: xc, y: ye },
              { x: xe, y: yc },
              { x: xe, y: ye },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: xb, y: ye },
              { x: xc, y: ye },
              { x: xe, y: yc },
              { x: xe, y: yb },
              { x: xd, y: yb },
              { x: xb, y: yd },
            ],
            this.color.wall, // lime
          );
        } else {
          this.drawing.polygon(
            [
              { x: xb, y: yd },
              { x: xd, y: yb },
              { x: xd, y: yd },
            ],
            this.color.wall, // maybe void
          );
        }
      } else {
        this.drawing.polygon(
          [
            { x: xb, y: yd },
            { x: xd, y: yb },
            { x: xe, y: yc },
            { x: xe, y: ye },
            { x: xc, y: ye },
          ],
          this.color.cell, // wall extension
        );
        this.drawing.polygon(
          [
            { x: xb, y: ye },
            { x: xc, y: ye },
            { x: xb, y: yd },
          ],
          this.color.wall, // yellow,
        );
        this.drawing.polygon(
          [
            { x: xd, y: yb },
            { x: xe, y: yb },
            { x: xe, y: yc },
          ],
          this.color.wall, // yellow,
        );

        if (tunnels && crossedD && modulo(cell.x + cell.y, 2) === 0) {
          this.drawing.line({ x: xb, y: yd }, { x: xd, y: yb }, this.color.tunnel);
        }
      }

      // f
      const crossedF = this.inMaze(sCell) && this.nexus(sCell).walls.h === false;
      if (walls.f || barriers.f) {
        if (crossedF) {
          this.drawing.polygon(
            [
              { x: x0, y: yc },
              { x: x2, y: ye },
              { x: x0, y: ye },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x0, y: yb },
              { x: x1, y: yb },
              { x: x3, y: yd },
              { x: x3, y: ye },
              { x: x2, y: ye },
              { x: x0, y: yc },
            ],
            this.color.wall, // lime
          );
        } else {
          this.drawing.polygon(
            [
              { x: x1, y: yb },
              { x: x3, y: yd },
              { x: x1, y: yd },
            ],
            this.color.wall, // maybe void
          );
        }
      } else {
        this.drawing.polygon(
          [
            { x: x0, y: yc },
            { x: x1, y: yb },
            { x: x3, y: yd },
            { x: x2, y: ye },
            { x: x0, y: ye },
          ],
          this.color.cell, // wall extension
        );
        this.drawing.polygon(
          [
            { x: x3, y: ye },
            { x: x2, y: ye },
            { x: x3, y: yd },
          ],
          this.color.wall, // yellow,
        );
        this.drawing.polygon(
          [
            { x: x1, y: yb },
            { x: x0, y: yb },
            { x: x0, y: yc },
          ],
          this.color.wall, // yellow,
        );

        if (tunnels && crossedF && modulo(cell.x + cell.y, 2) === 0) {
          this.drawing.line({ x: x1, y: yb }, { x: x3, y: yd }, this.color.tunnel);
        }
      }

      // h
      const crossedH = this.inMaze(wCell) && this.nexus(wCell).walls.b === false;
      if (walls.h || barriers.h) {
        if (crossedH) {
          this.drawing.polygon(
            [
              { x: x2, y: y0 },
              { x: x0, y: y2 },
              { x: x0, y: y0 },
            ],
            this.color.cell,
          );
          this.drawing.polygon(
            [
              { x: x3, y: y0 },
              { x: x3, y: y1 },
              { x: x1, y: y3 },
              { x: x0, y: y3 },
              { x: x0, y: y2 },
              { x: x2, y: y0 },
            ],
            this.color.wall, // lime
          );
        } else {
          this.drawing.polygon(
            [
              { x: x3, y: y1 },
              { x: x1, y: y3 },
              { x: x1, y: y1 },
            ],
            this.color.wall, // maybe void
          );
        }
      } else {
        this.drawing.polygon(
          [
            { x: x2, y: y0 },
            { x: x3, y: y1 },
            { x: x1, y: y3 },
            { x: x0, y: y2 },
            { x: x0, y: y0 },
          ],
          this.color.cell, // wall extension
        );
        this.drawing.polygon(
          [
            { x: x3, y: y0 },
            { x: x2, y: y0 },
            { x: x3, y: y1 },
          ],
          this.color.wall, // yellow,
        );
        this.drawing.polygon(
          [
            { x: x1, y: y3 },
            { x: x0, y: y3 },
            { x: x0, y: y2 },
          ],
          this.color.wall, // yellow,
        );

        if (tunnels && crossedH && modulo(cell.x + cell.y, 2) === 0) {
          this.drawing.line({ x: x1, y: y3 }, { x: x3, y: y1 }, this.color.tunnel);
        }
      }
    }
  }

  public drawPillar(cell: Cell, pillar: Pillar, color = this.color.wall): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (pillar) {
        case 'ab': {
          const { x8, xb, y1, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x8, y: y1 },
              { x: xb, y: y1 },
              { x: x8, y: y5 },
            ],
            color,
          );
          break;
        }

        case 'bc': {
          const { x9, xd, y3, y6 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xd, y: y3 },
              { x: xd, y: y6 },
              { x: x9, y: y6 },
            ],
            color,
          );
          break;
        }

        case 'cd': {
          const { x9, xd, y8, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: xd, y: y8 },
              { x: xd, y: yb },
              { x: x9, y: y8 },
            ],
            color,
          );
          break;
        }

        case 'de': {
          const { x8, xb, y9, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x8, y: y9 },
              { x: xb, y: yd },
              { x: x8, y: yd },
            ],
            color,
          );
          break;
        }

        case 'ef': {
          const { x3, x6, y9, yd } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x6, y: y9 },
              { x: x6, y: yd },
              { x: x3, y: yd },
            ],
            color,
          );
          break;
        }

        case 'fg': {
          const { x1, x5, y8, yb } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y8 },
              { x: x5, y: y8 },
              { x: x1, y: yb },
            ],
            color,
          );
          break;
        }

        case 'gh': {
          const { x1, x5, y3, y6 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x1, y: y3 },
              { x: x5, y: y6 },
              { x: x1, y: y6 },
            ],
            color,
          );
          break;
        }

        case 'ha': {
          const { x3, x6, y1, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x3, y: y1 },
              { x: x6, y: y1 },
              { x: x6, y: y5 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = this.color.blocked): void {
    if (this.drawing) {
      const { x5, x6, x8, x9, y5, y6, y8, y9 } = this.cellOffsets(cell);

      this.drawing.line({ x: x5, y: y6 }, { x: x9, y: y8 }, color);
      this.drawing.line({ x: x6, y: y5 }, { x: x8, y: y9 }, color);
      this.drawing.line({ x: x8, y: y5 }, { x: x6, y: y9 }, color);
      this.drawing.line({ x: x9, y: y6 }, { x: x5, y: y8 }, color);
    }
  }

  protected getRect(cell: Cell): Rect {
    const { x5, x9, y5, y9 } = this.cellOffsets(cell);

    return { x: x5, y: y5, width: x9 - x5, height: y9 - y5 };
  }
}
