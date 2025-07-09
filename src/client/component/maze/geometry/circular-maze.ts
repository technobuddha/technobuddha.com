import { type Cartesian, type Rect, toCartesian, toRadians } from '@technobuddha/library';

import { matrix } from './circular-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type MoveOffset,
  type Pillar,
  type Wall,
} from './maze.ts';
import { Maze } from './maze.ts';

export type CircularMazeProperties = MazeProperties & {
  readonly centerRadius?: number;
  readonly centerSegments?: number;
};

export class CircularMaze extends Maze {
  protected readonly centerRadius: number;
  protected readonly centerSegments: number;
  protected readonly zones: number[] = [];

  public constructor({
    cellSize = 28,
    wallSize = 2,
    centerRadius = 18,
    centerSegments = 1,
    plugin,
    ...props
  }: CircularMazeProperties) {
    super(
      {
        cellSize,
        wallSize,
        voidSize: 2,
        ...props,
        wrapHorizontal: false,
        wrapVertical: false,
      },
      matrix,
    );

    this.centerRadius = centerRadius;
    this.centerSegments = centerSegments;
    this.plugin = this.circularPlugin(plugin);
  }

  private circularPlugin(plugin?: MazeProperties['plugin']): MazeProperties['plugin'] {
    return (maze: Maze): void => {
      for (let y = 0; y < maze.height; ++y) {
        const cols = this.zones[y];
        for (let x = cols; x < maze.width; ++x) {
          maze.nexus({ x, y }).mask = true;
        }
      }

      if (plugin) {
        plugin(maze);
      }
    };
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      groupHeight: this.cellSize,
      topPadding: this.centerRadius / 2,
      leftPadding: this.centerRadius / 2,
      bottomPadding: this.centerRadius / 2,
      rightPadding: this.centerRadius / 2,
      custom: (params: {
        width: number;
        height: number;
        actualWidth: number;
        actualHeight: number;
      }) => {
        let { width, height, actualWidth, actualHeight } = params;

        height = Math.floor(Math.min(width / 2, height / 2));
        width = this.centerSegments;
        for (let y = 0; y < height; ++y) {
          this.zones.push(width);
          const diameter = (this.centerRadius + y * this.cellSize + this.cellSize) * 2;
          const circumference = diameter * Math.PI;
          const cellWidth = circumference / width;

          if (cellWidth > this.cellSize * 1.67) {
            width *= 2;
          }
        }

        actualHeight = this.centerRadius + height * this.cellSize * 2 + this.wallSize * 2;
        actualWidth = actualHeight;

        return { width, height, actualWidth, actualHeight };
      },
    };
  }

  public override initialWalls(cell: Cell): Wall {
    const wall = super.initialWalls(cell);

    const z0 = this.zones[cell.y];
    const zp = cell.y === 0 ? z0 : this.zones[cell.y - 1];

    if (z0 !== zp) {
      wall[cell.x % 2 === 0 ? 'g' : 'h'] = true;
      delete wall.c;
    }

    if (z0 === 1) {
      delete wall.b;
      delete wall.d;
      delete wall.c;
    }

    return wall;
  }

  public cellKind(cell: Cell): number {
    const z0 = this.cellZone(cell);
    const zp = cell.y === 0 ? z0 : this.cellZone({ ...cell, y: cell.y - 1 });
    const zn = cell.y === this.height - 1 ? z0 : this.cellZone({ ...cell, y: cell.y + 1 });

    if (z0 === 1) {
      return 6;
    }

    if (z0 === zp && z0 === zn) {
      return 0;
    }

    if (z0 === zp && z0 !== zn) {
      return 3;
    }

    if (z0 !== zp && z0 === zn) {
      return cell.x % 2 === 0 ? 1 : 2;
    }

    return cell.x % 2 === 0 ? 4 : 5;
  }

  public override cellZone(cell: Cell): number {
    return this.zones[cell.y];
  }

  public override resolveMove(cell: Cell, move: MoveOffset): Cell {
    let { x, y } = cell;

    if (move.zone) {
      switch (move.zone) {
        case 'up': {
          x *= 2;
          break;
        }

        case 'down': {
          x = Math.floor(x / 2);
          break;
        }

        // no default
      }
    }

    x += move.x;
    y += move.y;

    const cols = this.zones[y];
    if (x >= cols) {
      x -= cols;
    }
    if (x < 0) {
      x += cols;
    }
    return { x, y };
  }

  protected cellOrigin(_cell: Cell): Cartesian {
    throw new Error('not used by circular maze');
  }

  protected override cellOffsets(cell: Cell): Record<string, number> {
    let { cx, cy, r0, r1, r2, r3, r4, r5 } = this.offsets(this.cellKind(cell));

    const cols = this.zones[cell.y];

    r0 += this.cellSize * cell.y;
    r1 += this.cellSize * cell.y;
    r2 += this.cellSize * cell.y;
    r3 += this.cellSize * cell.y;
    r4 += this.cellSize * cell.y;
    r5 += this.cellSize * cell.y;

    const circum1 = r1 * 2 * Math.PI;
    const circum2 = r2 * 2 * Math.PI;
    const circum3 = r3 * 2 * Math.PI;
    const circum4 = r4 * 2 * Math.PI;

    const g1 = (this.voidSize * 360) / circum1;
    const g2 = (this.voidSize * 360) / circum2;
    const g3 = (this.voidSize * 360) / circum3;
    const g4 = (this.voidSize * 360) / circum4;

    const w2 = (this.wallSize * 360) / circum2;
    const w3 = (this.wallSize * 360) / circum3;
    const w4 = (this.wallSize * 360) / circum4;

    const cellAngle = 360 / cols;

    const a0 = cellAngle * cell.x;
    const ag = a0 + cellAngle;

    const a1 = a0 + g4;
    const a2 = a0 + g2;
    const a3 = a0 + g1;
    const a4 = a0 + (g3 + w3);
    const a5 = a0 + (g2 + w2);

    const a8 = (a0 + ag) / 2;
    const a6 = a8 - (g4 + w4);
    const a7 = a8 - g3;
    const a9 = a8 + g3;
    const aa = a8 + (g4 + w4);
    const ab = ag - (g2 + w2);
    const ac = ag - (g3 + w3);
    const ad = ag - g1;
    const ae = ag - g2;
    const af = ag - g4;

    // prettier-ignore
    return { cx, cy, r0, r1, r2, r3, r4, r5, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, aa, ab, ac, ad, ae, af, ag };
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const cx = this.cellSize * this.height + this.centerRadius / 2;
    const cy = this.cellSize * this.height + this.centerRadius / 2;

    const r0 = this.centerRadius / 2;
    const r1 = r0 + this.voidSize;
    const r2 = r1 + this.wallSize;
    const r5 = r0 + this.cellSize;
    const r4 = r5 - this.voidSize;
    const r3 = r4 - this.wallSize;

    return { cx, cy, r0, r1, r2, r3, r4, r5 };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const cols = this.zones[cell.y];
      if (cols === 1) {
        const { cx, cy, r5 } = this.cellOffsets(cell);
        this.drawing.circle({ x: cx, y: cy }, r5, color);
      } else {
        const { cx, cy, r0, r1, r4, r5, a0, a1, af, ag } = this.cellOffsets(cell);

        this.drawing.arc(cx, cy, r0, r5, a0, ag, this.backgroundColor);
        this.drawing.arc(cx, cy, r1, r4, a1, af, color);
      }
    }
  }

  public drawWall(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (cell.direction) {
        case 'a': {
          const { cx, cy, r3, r4, a4, ac } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r3, r4, a4, ac, color);
          break;
        }
        case 'b': {
          const { cx, cy, r2, r3, ab, ac, ae, af } = this.cellOffsets(cell);

          const { x: x0, y: y0 } = toCartesian({ radius: r2, angle: toRadians(ab) });
          const { x: x1, y: y1 } = toCartesian({ radius: r2, angle: toRadians(ae) });
          const { x: x2, y: y2 } = toCartesian({ radius: r3, angle: toRadians(af) });
          const { x: x3, y: y3 } = toCartesian({ radius: r3, angle: toRadians(ac) });

          this.drawing.polygon(
            [
              { x: cx + x0, y: cy + y0 },
              { x: cx + x1, y: cy + y1 },
              { x: cx + x2, y: cy + y2 },
              { x: cx + x3, y: cy + y3 },
            ],
            color,
          );
          break;
        }
        case 'c':
        case 'g':
        case 'h': {
          const { cx, cy, r1, r2, a5, ab } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r1, r2, a5, ab, color);
          break;
        }
        case 'd': {
          const { cx, cy, r2, r3, a1, a2, a4, a5 } = this.cellOffsets(cell);

          const { x: x0, y: y0 } = toCartesian({ radius: r2, angle: toRadians(a5) });
          const { x: x1, y: y1 } = toCartesian({ radius: r2, angle: toRadians(a2) });
          const { x: x2, y: y2 } = toCartesian({ radius: r3, angle: toRadians(a1) });
          const { x: x3, y: y3 } = toCartesian({ radius: r3, angle: toRadians(a4) });

          this.drawing.polygon(
            [
              { x: cx + x0, y: cy + y0 },
              { x: cx + x1, y: cy + y1 },
              { x: cx + x2, y: cy + y2 },
              { x: cx + x3, y: cy + y3 },
            ],
            color,
          );
          break;
        }
        case 'e': {
          const { cx, cy, r3, r4, a4, a6 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r3, r4, a4, a6, color);
          break;
        }

        case 'f': {
          const { cx, cy, r3, r4, aa, ac } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r3, r4, aa, ac, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPillar({ x, y }: Cell, pillar: Pillar, color = this.wallColor): void {
    if (this.drawing) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (pillar) {
        case 'ab':
        case 'fb': {
          const { cx, cy, r3, r4, a1, a4 } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r3, r4, a1, a4, color);
          break;
        }

        case 'bc':
        case 'bh':
        case 'bg': {
          const { cx, cy, r1, r2, a3, a5 } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r1, r2, a3, a5, color);
          break;
        }

        case 'cd':
        case 'gd':
        case 'hd': {
          const { cx, cy, r1, r2, ab, ad } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r1, r2, ab, ad, color);
          break;
        }

        case 'da':
        case 'de': {
          const { cx, cy, r3, r4, ac, af } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r3, r4, ac, af, color);
          break;
        }

        case 'ef': {
          const { cx, cy, r3, r4, a6, aa } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r3, r4, a6, aa, color);
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
          const { cx, cy, r4, r5, a1, a4, ac, af } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r4, r5, a1, a4, color);
          this.drawing.arc(cx, cy, r4, r5, a4, ac, this.cellColor);
          this.drawing.arc(cx, cy, r4, r5, ac, af, color);

          break;
        }
        case 'b': {
          const { cx, cy, r1, r2, r3, r4, ae, af, ag } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r1, r2, ae, ag, color);
          this.drawing.arc(cx, cy, r2, r4, af, ag, this.cellColor);
          this.drawing.arc(cx, cy, r3, r4, af, ag, color);
          break;
        }
        case 'c':
        case 'g':
        case 'h': {
          const { cx, cy, r0, r1, a3, a5, ab, ad } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r0, r1, a3, a5, color);
          this.drawing.arc(cx, cy, r0, r1, a5, ab, this.cellColor);
          this.drawing.arc(cx, cy, r0, r1, ab, ad, color);
          break;
        }
        case 'd': {
          const { cx, cy, r1, r2, r3, r4, a0, a2, a5 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r1, r2, a0, a5, color);
          this.drawing.arc(cx, cy, r2, r3, a0, a2, this.cellColor);
          this.drawing.arc(cx, cy, r3, r4, a0, a2, color);
          break;
        }
        case 'e': {
          const { cx, cy, r4, r5, a1, a4, a6, a7 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r4, r5, a1, a4, color);
          this.drawing.arc(cx, cy, r4, r5, a4, a6, this.cellColor);
          this.drawing.arc(cx, cy, r4, r5, a6, a7, color);
          break;
        }
        case 'f': {
          const { cx, cy, r4, r5, a9, aa, ac, af } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r4, r5, a9, aa, color);
          this.drawing.arc(cx, cy, r4, r5, aa, ac, this.cellColor);
          this.drawing.arc(cx, cy, r4, r5, ac, af, color);
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = this.blockedColor): void {
    if (this.drawing) {
      if (this.zones[cell.y] === 1) {
        const { cx, cy } = this.cellOffsets(cell);

        this.drawing.line(
          { x: cx, y: cy - (this.cellSize - this.wallSize) },
          { x: cx, y: cy + (this.cellSize - this.wallSize) },
          color,
        );
        this.drawing.line(
          { x: cx - (this.cellSize - this.wallSize), y: cy },
          { x: cx + (this.cellSize - this.wallSize), y: cy },
          color,
        );
      } else {
        const { cx, cy, a5, a4, ab, ac, r2, r3 } = this.cellOffsets(cell);

        const { x: xc, y: yc } = toCartesian({
          radius: (r2 + r3) / 2,
          angle: toRadians((a4 + ac) / 2),
        });

        const { x: x0, y: y0 } = toCartesian({ radius: r2, angle: toRadians(a5) });
        const { x: x1, y: y1 } = toCartesian({ radius: r2, angle: toRadians(ab) });
        const { x: x2, y: y2 } = toCartesian({ radius: r3, angle: toRadians(ac) });
        const { x: x3, y: y3 } = toCartesian({ radius: r3, angle: toRadians(a4) });

        this.drawing.line({ x: cx + x0, y: cy + y0 }, { x: cx + xc, y: cy + yc }, color);
        this.drawing.line({ x: cx + x1, y: cy + y1 }, { x: cx + xc, y: cy + yc }, color);
        this.drawing.line({ x: cx + x2, y: cy + y2 }, { x: cx + xc, y: cy + yc }, color);
        this.drawing.line({ x: cx + x3, y: cy + y3 }, { x: cx + xc, y: cy + yc }, color);
      }
    }
  }

  protected getRect(cell: Cell): Rect {
    const { cx, cy, a4, ac, r2, r3 } = this.cellOffsets(cell);

    const { x, y } = toCartesian({ angle: toRadians((a4 + ac) / 2), radius: (r2 + r3) / 2 });

    const c = this.cellSize - this.wallSize * 2 - this.voidSize * 2;

    return {
      x: cx + x - c / 2,
      y: cy + y - c / 2,
      width: c,
      height: c,
    };
  }

  public override drawPath(cell: CellDirection, color = this.pathColor): void {
    if (this.drawing) {
      const cols = this.zones[cell.y];

      switch (cols) {
        case 1: {
          const { cx, cy } = this.cellOffsets(cell);
          const rect = {
            x: cx - this.cellSize / 2,
            y: cy - this.cellSize / 2,
            width: this.cellSize,
            height: this.cellSize,
          };
          if (cell.direction === '?') {
            this.renderCircle(rect, color);
          } else {
            const angle = cell.direction === 'e' ? 90 : 270;
            this.renderArrow(rect, angle, color);
          }
          break;
        }

        case 2: {
          const { rect } = this.nexus(cell);
          if (cell.direction === '?') {
            this.renderCircle(rect, color);
          } else {
            const angle = this.angleMatrix[cell.direction]! + (cell.x === 0 ? 90 : -90);
            this.renderArrow(rect, angle, color);
          }
          break;
        }

        default: {
          const { rect } = this.nexus(cell);
          if (cell.direction === '?') {
            this.renderCircle(rect, color);
          } else {
            const angle =
              this.angleMatrix[cell.direction]! + (cell.x * (360 / cols) + 360 / cols / 2);
            this.renderArrow(rect, angle, color);
          }
          break;
        }
      }
    }
  }

  public override drawMasks(): void {
    // Masks aren't disaplyed in the circular maze
  }
}
