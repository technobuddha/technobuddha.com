/* eslint-disable @typescript-eslint/class-methods-use-this */

import { type Direction } from '@mui/material';
import { toCartesian, toPolar, toRadians } from '@technobuddha/library';

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
  sidesMatrix,
  wallMatrix,
} from './circular-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
  type XY,
} from './maze.ts';
import { Maze } from './maze.ts';

const ROWS_PER_ZONE = 10;
const COLS = 48;

function circularPlugin(plugin?: MazeProperties['plugin']): MazeProperties['plugin'] {
  return (maze: Maze): void => {
    for (let y = 0; y < maze.height; ++y) {
      const cols = COLS * 2 ** Math.floor(y / ROWS_PER_ZONE);
      for (let x = cols; x < maze.width; ++x) {
        maze.mask[x][y] = true;
      }
    }

    if (plugin) {
      plugin(maze);
    }
  };
}

type CircularMazeProperties = MazeProperties & {
  centerRadius?: number;
};

export class CircularMaze extends Maze {
  public readonly centerRadius: number;

  public constructor({
    cellSize = 14,
    wallSize = 1,
    centerRadius = 120,
    width,
    height,
    plugin,
    ...props
  }: CircularMazeProperties) {
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

    this.centerRadius = centerRadius;
    this.initialize({ width, height, plugin: circularPlugin(plugin) });
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
        const zones = Math.ceil(this.height / ROWS_PER_ZONE);

        return { width: COLS * 2 ** zones, height: Math.min(width, height) };
      },
    };
  }

  protected cellKind(cell: Cell): number {
    /*
     * Kind 0: Normal
     * Kind 1: End of Zone
     * Kind 2: Start of Zone (right)
     * Kind 2: Start of Zone (left)
     */

    if (cell.y % ROWS_PER_ZONE === ROWS_PER_ZONE - 1) {
      return 1;
    }
    if (cell.y % ROWS_PER_ZONE === 0 && cell.y !== 0 && cell.x % 2 === 0) {
      return 2;
    }
    if (cell.y % ROWS_PER_ZONE === 0 && cell.y !== 0 && cell.x % 2 === 1) {
      return 3;
    }

    return 0;
  }

  private cellOffsets(cell: Cell): Record<string, number> {
    const zone = Math.floor(cell.y / ROWS_PER_ZONE);
    const width = COLS * 2 ** zone;

    const { cx, cy } = this.offsets(this.cellKind(cell));

    const r0 = this.centerRadius / 2 + this.cellSize * cell.y;
    const r1 = r0 + this.wallSize;
    const r3 = r0 + this.cellSize;
    const r2 = r3 - this.wallSize;

    const ap1 = 360 / (Math.PI * 2 * r1);
    const ap2 = 360 / (Math.PI * 2 * r2);

    const a0 = (360 / width) * cell.x;
    const a1 = a0 + ap1;
    const a2 = a0 + ap2;
    const a6 = (360 / width) * (cell.x + 1);
    const a5 = a6 - ap1;
    const a4 = a6 - ap2;
    const a3 = (a0 + a6) / 2;

    // a0, a1,  a2,  a3, a4,  a5,  a6
    // a0, a01, a02, a1, a22, a21, a2

    const x0 = cx + Math.cos(toRadians(a0)) * r1;
    const y0 = cy + Math.sin(toRadians(a0)) * r1;
    const x1 = cx + Math.cos(toRadians(a1)) * r1;
    const y1 = cy + Math.sin(toRadians(a1)) * r1;
    const x2 = cx + Math.cos(toRadians(a0)) * r2;
    const y2 = cy + Math.sin(toRadians(a0)) * r2;
    const x3 = cx + Math.cos(toRadians(a2)) * r2;
    const y3 = cy + Math.sin(toRadians(a2)) * r2;

    const x4 = cx + Math.cos(toRadians(a5)) * r1;
    const y4 = cy + Math.sin(toRadians(a5)) * r1;
    const x5 = cx + Math.cos(toRadians(a6)) * r1;
    const y5 = cy + Math.sin(toRadians(a6)) * r1;
    const x6 = cx + Math.cos(toRadians(a4)) * r2;
    const y6 = cy + Math.sin(toRadians(a4)) * r2;
    const x7 = cx + Math.cos(toRadians(a6)) * r2;
    const y7 = cy + Math.sin(toRadians(a6)) * r2;

    return {
      cx,
      cy,
      r0,
      r1,
      r2,
      r3,
      a0,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      x0,
      x1,
      x2,
      x3,
      x4,
      x5,
      x6,
      x7,
      y0,
      y1,
      y2,
      y3,
      y4,
      y5,
      y6,
      y7,
    };
  }

  protected offsets(_kind: Kind): Record<string, number> {
    const { width, height } = this.drawing ?? { width: 1, height: 1 };

    return { cx: width / 2, cy: height / 2 };
  }

  public override drawCell(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const zone = Math.floor(cell.y / ROWS_PER_ZONE);
      const cols = COLS * 2 ** zone;
      if (cell.x < cols) {
        super.drawCell(cell, color);
      }
    }
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      const zone = Math.floor(cell.y / ROWS_PER_ZONE);
      const cols = COLS * 2 ** zone;
      if (cell.x < cols) {
        const { cx, cy, r0, r3, a0, a6 } = this.cellOffsets(cell);

        this.drawing.arc(cx, cy, r0, r3, a0, a6, color);
      }
    }
  }

  public drawWall(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      const zone = Math.floor(cell.y / ROWS_PER_ZONE);
      const cols = COLS * 2 ** zone;
      if (cell.x < cols) {
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
            this.drawing.arc(cx, cy, r1, r2, a0, a1, color);
            break;
          }
          case 'b': {
            const { cx, cy, r1, r2, a5, a6 } = this.cellOffsets(cell);
            this.drawing.arc(cx, cy, r1, r2, a5, a6, color);
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
      const zone = Math.floor(cell.y / ROWS_PER_ZONE) + 1;
      const cols = COLS * 2 ** zone;
      if (cell.x < cols) {
        const { x1, x3, x4, x6, y1, y3, y4, y6 } = this.cellOffsets(cell);
        this.drawing.line({ x: x1, y: y1 }, { x: x6, y: y6 }, color);
        this.drawing.line({ x: x3, y: y3 }, { x: x4, y: y4 }, color);
      }
    }
  }

  public getRect(cell: Cell): Rect {
    let { x1, x3, x4, x6, y1, y3, y4, y6 } = this.cellOffsets(cell);

    if (x3 < x1) {
      [x1, x3] = [x3, x1];
    }
    if (x6 < x4) {
      [x4, x6] = [x6, x4];
    }

    if (y3 < y1) {
      [y1, y3] = [y3, y1];
    }
    if (y6 < y4) {
      [y4, y6] = [y6, y4];
    }

    return { x: x1, y: y1, w: x4 - x1, h: y4 - y1 };
  }

  public override drawPath(cell: CellDirection, color = 'cyan'): void {
    if (this.drawing) {
      const zone = Math.floor(cell.y / ROWS_PER_ZONE);
      const cols = COLS * 2 ** zone;
      if (cell.x < cols) {
        const { x1, y1, x6, y6 } = this.cellOffsets(cell);

        const mx = (x1 + x6) / 2;
        const my = (y1 + y6) / 2;

        if (cell.direction === '?') {
          this.drawing.circle({ x: mx, y: my }, this.cellSize / 4, color);
        } else {
          const angle = pathMatrix[cell.direction] - (cell.x * (360 / cols) + 360 / cols / 2);

          const coords: XY[] = [
            { x: 1, y: 0 },
            { x: -1, y: 2 / 3 },
            { x: 0, y: 0 },
            { x: -1, y: -2 / 3 },
          ];

          // scale
          for (const c of coords) {
            c.x = (c.x * this.cellSize) / 2;
            c.y = (c.y * this.cellSize) / 2;
          }

          // rotate
          for (const c of coords) {
            const pc = toPolar(c);
            pc.angle += (angle / 180) * Math.PI;
            const { x, y } = toCartesian(pc);
            c.x = x;
            c.y = y;
          }

          this.drawing.polygon(
            coords.map((c) => ({ x: mx + c.x, y: my - c.y })),
            color,
          );
        }
      }
    }
  }
}
