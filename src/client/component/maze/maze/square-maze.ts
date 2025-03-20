/* eslint-disable @typescript-eslint/class-methods-use-this */

import { type Rect } from '../drawing/drawing.js';

import {
  type Cell,
  type CellCorner,
  type CellDirection,
  type Direction,
  type Kind,
  type MazeProperties,
  type Overrides,
  type Wall,
} from './maze.js';
import { Maze } from './maze.js';
import {
  cornerMatrix,
  directionMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  rightTurnMatrix,
  wallMatrix,
} from './square-matrix.js';

export class SquareMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 1, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, directionMatrix, cornerMatrix);
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  protected cellKind(_cell: Cell): number {
    return 0;
  }

  protected initialWalls(): Wall {
    return { ...wallMatrix };
  }

  public opposite(direction: Direction): Direction {
    const opposite = oppositeMatrix[direction];
    if (opposite) {
      return opposite;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public rightTurn(direction: Direction): Direction[] {
    const rightTurn = rightTurnMatrix[direction];
    if (rightTurn) {
      return rightTurn;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public leftTurn(direction: Direction): Direction[] {
    const leftTurn = leftTurnMatrix[direction];
    if (leftTurn) {
      return leftTurn;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public move(cell: Cell, direction: Direction): CellDirection {
    const move = moveMatrix[direction];
    if (move) {
      return { ...cell, x: cell.x + move.x, y: cell.y + move.y, direction };
    }
    throw new Error(`"${direction}" is not a valid direction`);
  }

  public isDeadEnd(cell: Cell, { walls = this.walls }: Overrides = {}): boolean {
    return (
      this.sides(cell, { walls }) === 3 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell): string[] {
    return this.neighbors(cell)
      .filter((cd) => ['s', 'w'].includes(cd.direction))
      .map((cd) => cd.direction);
  }

  private cellOffsets(cell: Cell): Record<string, number> {
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
          this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y0 }, color);
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

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x1, x2, x3, y0, y1, y2, y3 } = this.cellOffsets({ x, y });

      if (corner === 'nw') {
        this.drawing.rect({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
      }
      if (corner === 'ne') {
        this.drawing.rect({ x: x2, y: y0 }, { x: x3, y: y1 }, color);
      }
      if (corner === 'sw') {
        this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y3 }, color);
      }
      if (corner === 'se') {
        this.drawing.rect({ x: x2, y: y2 }, { x: x3, y: y3 }, color);
      }
    }
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const angle = { n: 90, s: 270, e: 0, w: 180 }[cell.direction]!;

      this.drawArrow(this.getRect(cell), angle, color);
    }
  }

  public drawX(cell: Cell, color = 'red', cellColor = this.cellColor): void {
    if (this.drawing) {
      const { x1, x2, y1, y2 } = this.cellOffsets(cell);

      this.drawCell(cell, cellColor);

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
        str += this.walls[x][y].n ? '+==' : '+  ';
      }
      str += '+\n';
      for (let x = 0; x < this.width; ++x) {
        str += this.walls[x][y].w ? '|  ' : '   ';
      }
      str += this.walls[this.width - 1][y].e ? '|\n' : ' \n';
    }
    for (let x = 0; x < this.width; ++x) {
      str += this.walls[x][this.height - 1].s ? '+==' : '+  ';
    }
    str += '+\n';

    return str;
  }
}
