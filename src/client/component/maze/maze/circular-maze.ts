import { type Direction } from '@mui/material';
import { toCartesian, toRadians } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.ts';

import {
  directionMatrix,
  edgesMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pathMatrix,
  pillarMatrix,
  rightTurnMatrix,
  wallMatrix,
} from './circular-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type Wall,
} from './maze.ts';
import { Maze } from './maze.ts';

type CircularMazeProperties = MazeProperties & {
  centerRadius?: number;
};

export class CircularMaze extends Maze {
  public readonly centerRadius: number;
  public readonly zones: number[] = [];

  public constructor({
    cellSize = 12,
    wallSize = 1,
    centerRadius = 12,
    plugin,
    ...props
  }: CircularMazeProperties) {
    super(
      {
        cellSize,
        wallSize,
        ...props,
        // exit: { x: 0, y: 0 },
        wrapHorizontal: false,
        wrapVertical: false,
      },
      directionMatrix,
      pillarMatrix,
      wallMatrix,
      oppositeMatrix,
      rightTurnMatrix,
      leftTurnMatrix,
      moveMatrix,
      edgesMatrix,
      pathMatrix,
    );

    this.centerRadius = centerRadius;
    this.initialize({ ...props, plugin: this.circularPlugin(plugin) });
  }

  private circularPlugin(plugin?: MazeProperties['plugin']): MazeProperties['plugin'] {
    return (maze: Maze): void => {
      for (let y = 0; y < maze.height; ++y) {
        const cols = this.zones[y];
        for (let x = cols; x < maze.width; ++x) {
          maze.mask[x][y] = true;
        }
      }

      if (plugin) {
        plugin(maze);
      }
    };
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 2,
      groupHeight: this.cellSize * 2,
      topPadding: this.centerRadius / 2,
      leftPadding: this.centerRadius / 2,
      bottomPadding: this.centerRadius / 2,
      rightPadding: this.centerRadius / 2,
      custom: ({ width, height }) => {
        const size = Math.min(width, height);

        let cols = 1;
        for (let y = 0; y < size; ++y) {
          this.zones.push(cols);
          const diameter = (this.centerRadius + y * this.cellSize + this.cellSize) * 2;
          const circumference = diameter * Math.PI;
          const cellWidth = circumference / cols;

          if (cellWidth > this.cellSize * 1.67) {
            cols *= 2;
          }
        }

        return { width: cols, height: size };
      },
    };
  }

  public override clear(color?: string): void {
    if (this.drawing) {
      const {
        topPadding = 0,
        leftPadding = 0,
        bottomPadding = 0,
        rightPadding = 0,
      } = this.drawingSize();

      const actualWidth = this.cellSize * this.height * 2;
      const actualHeight = actualWidth;
      const availableWidth = this.drawing.width - (leftPadding + rightPadding);
      const availableHeight = this.drawing.height - (topPadding + bottomPadding);

      const leftOffset = this.wallSize + (availableWidth - actualWidth) / 2;
      const topOffset = this.wallSize + (availableHeight - actualHeight) / 2;

      this.drawing.clear(color, leftOffset, topOffset);
    }
  }

  public override initialWalls(cell: Cell): Wall {
    const wall = super.initialWalls(cell);

    const z0 = this.zones[cell.y];
    const zp = cell.y === 0 ? z0 : this.zones[cell.y - 1];

    if (z0 !== zp) {
      delete wall.c;
      wall[cell.x % 2 === 0 ? 'g' : 'h'] = true;
    }

    if (z0 === 1) {
      delete wall.b;
      delete wall.d;
      delete wall.c;
    }

    return wall;
  }

  protected cellKind(cell: Cell): number {
    const z0 = this.zones[cell.y];
    const zn = cell.y === this.height - 1 ? z0 : this.zones[cell.y + 1];
    /*
     * Kind 0: Normal
     * Kind 1: End of Zone
     */

    return z0 === zn ? 0 : 1;
  }

  public override move(cell: Cell, direction: Direction): CellDirection | null {
    const next = super.move(cell, direction);

    if (next) {
      const cols = this.zones[next.y];
      if (next.x >= cols) {
        next.x -= cols;
      }
      if (next.x < 0) {
        next.x += cols;
      }
    }

    return next;
  }

  private cellOffsets(cell: Cell): Record<string, number> {
    const cols = this.zones[cell.y];

    const { cx, cy } = this.offsets(this.cellKind(cell));

    const r0 = this.centerRadius / 2 + this.cellSize * cell.y;
    const r1 = r0 + this.wallSize;
    const r3 = r0 + this.cellSize;
    const r2 = r3 - this.wallSize;

    const ap1 = 360 / (Math.PI * 2 * r1);
    const ap2 = 360 / (Math.PI * 2 * r2);

    const a0 = (360 / cols) * cell.x;
    const a1 = a0 + ap1;
    const a2 = a0 + ap2;
    const a6 = (360 / cols) * (cell.x + 1);
    const a5 = a6 - ap1;
    const a4 = a6 - ap2;
    const a3 = (a0 + a6) / 2;

    return { cx, cy, r0, r1, r2, r3, a0, a1, a2, a3, a4, a5, a6 };
  }

  protected offsets(_kind: Kind): Record<string, number> {
    return {
      cx: this.cellSize * this.height + this.centerRadius / 2,
      cy: this.cellSize * this.height + this.centerRadius / 2,
    };
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const cols = this.zones[cell.y];
      if (cols === 1) {
        const { cx, cy } = this.cellOffsets(cell);
        this.drawing.circle({ x: cx, y: cy }, this.cellSize / 2 + this.centerRadius, color);
      } else {
        const { cx, cy, r0, r3, a0, a6 } = this.cellOffsets(cell);

        this.drawing.arc(cx, cy, r0, r3, a0, a6, color);
      }
    }
  }

  public drawWall(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      switch (cell.direction) {
        case 'a': {
          const { cx, cy, r2, r3, a0, a6 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r2, r3, a0, a6, color);
          break;
        }
        case 'c':
        case 'g':
        case 'h': {
          const { cx, cy, r0, r1, a0, a6 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r0, r1, a0, a6, color);
          break;
        }
        case 'd': {
          const { cx, cy, r1, r2, a0, a1 } = this.cellOffsets(cell);

          const { x: x0, y: y0 } = toCartesian({ radius: r1, angle: toRadians(a0) });
          const { x: x1, y: y1 } = toCartesian({ radius: r1, angle: toRadians(a1) });
          const { x: x2, y: y2 } = toCartesian({ radius: r2, angle: toRadians(a1) });
          const { x: x3, y: y3 } = toCartesian({ radius: r2, angle: toRadians(a0) });

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
        case 'b': {
          const { cx, cy, r1, r2, a5, a6 } = this.cellOffsets(cell);

          const { x: x0, y: y0 } = toCartesian({ radius: r1, angle: toRadians(a5) });
          const { x: x1, y: y1 } = toCartesian({ radius: r1, angle: toRadians(a6) });
          const { x: x2, y: y2 } = toCartesian({ radius: r2, angle: toRadians(a6) });
          const { x: x3, y: y3 } = toCartesian({ radius: r2, angle: toRadians(a5) });

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
          const { cx, cy, r2, r3, a0, a3 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r2, r3, a0, a3, color);
          break;
        }

        case 'f': {
          const { cx, cy, r2, r3, a3, a6 } = this.cellOffsets(cell);
          this.drawing.arc(cx, cy, r2, r3, a3, a6, color);
          break;
        }

        // no default
      }
    }
  }

  public drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      switch (pillar) {
        case 'ab':
        case 'fb': {
          const { cx, cy, r2, r3, a5, a6 } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r2, r3, a5, a6, color);
          break;
        }

        case 'bc':
        case 'bh':
        case 'bg': {
          const { cx, cy, r0, r1, a4, a6 } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r0, r1, a4, a6, color);
          break;
        }

        case 'cd':
        case 'gd':
        case 'hd': {
          const { cx, cy, r0, r1, a0, a1 } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r0, r1, a0, a1, color);
          break;
        }

        case 'da':
        case 'de': {
          const { cx, cy, r2, r3, a0, a2 } = this.cellOffsets({ x, y });
          this.drawing.arc(cx, cy, r2, r3, a0, a2, color);
          break;
        }

        // no default
      }
    }
  }

  public drawX(cell: Cell, color = 'red'): void {
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
        const { cx, cy, a1, a2, a4, a5, r1, r2 } = this.cellOffsets(cell);

        const { x: xc, y: yc } = toCartesian({
          radius: (r1 + r2) / 2,
          angle: toRadians((a2 + a4) / 2),
        });
        const { x: x0, y: y0 } = toCartesian({ radius: r1, angle: toRadians(a1) });
        const { x: x1, y: y1 } = toCartesian({ radius: r1, angle: toRadians(a4) });
        const { x: x2, y: y2 } = toCartesian({ radius: r2, angle: toRadians(a2) });
        const { x: x3, y: y3 } = toCartesian({ radius: r2, angle: toRadians(a5) });

        this.drawing.line({ x: cx + x0, y: cy + y0 }, { x: cx + xc, y: cy + yc }, color);
        this.drawing.line({ x: cx + x1, y: cy + y1 }, { x: cx + xc, y: cy + yc }, color);
        this.drawing.line({ x: cx + x2, y: cy + y2 }, { x: cx + xc, y: cy + yc }, color);
        this.drawing.line({ x: cx + x3, y: cy + y3 }, { x: cx + xc, y: cy + yc }, color);
      }
    }
  }

  public getRect(cell: Cell): Rect {
    const { cx, cy, a0, a6, r0, r3 } = this.cellOffsets(cell);

    const { x, y } = toCartesian({ angle: toRadians((a0 + a6) / 2), radius: (r0 + r3) / 2 });

    return {
      x: cx + x - this.cellSize / 2,
      y: cy + y - this.cellSize / 2,
      w: this.cellSize,
      h: this.cellSize,
    };
  }

  public override drawPath(cell: CellDirection, color = 'cyan'): void {
    if (this.drawing) {
      const cols = this.zones[cell.y];

      switch (cols) {
        case 1: {
          const { cx, cy } = this.cellOffsets(cell);
          const rect = {
            x: cx - this.cellSize / 2,
            y: cy - this.cellSize / 2,
            w: this.cellSize,
            h: this.cellSize,
          };
          if (cell.direction === '?') {
            this.drawCircle(rect, color);
          } else {
            const angle = cell.direction === 'e' ? 270 : 90;
            this.drawArrow(rect, angle, color);
          }
          break;
        }

        case 2: {
          const rect = this.cellRect(cell);
          if (cell.direction === '?') {
            this.drawCircle(rect, color);
          } else {
            const angle = pathMatrix[cell.direction] + (cell.x === 0 ? -90 : 90);
            this.drawArrow(rect, angle, color);
          }
          break;
        }

        default: {
          const rect = this.cellRect(cell);
          if (cell.direction === '?') {
            this.drawCircle(rect, color);
          } else {
            const angle = pathMatrix[cell.direction] - (cell.x * (360 / cols) + 360 / cols / 2);
            this.drawArrow(rect, angle, color);
          }
          break;
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override drawMasks(): void {
    // Masks aren't disaplyed in the circular maze
  }
}
