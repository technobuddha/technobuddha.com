/* eslint-disable @typescript-eslint/class-methods-use-this */

import { modulo } from '@technobuddha/library';

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
} from './cubic-matrix.ts';
import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
} from './maze.ts';
import { Maze } from './maze.ts';

export class CubicMaze extends Maze {
  public constructor({ cellSize = 18, wallSize = 1, ...props }: MazeProperties) {
    super(
      { cellSize, wallSize, ...props },
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

    this.initialize(props);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 4,
      horizontalCellsPerGroup: 9,
      groupHeight: this.cellSize * 12,
      verticalCellsPerGroup: 8,
      leftPadding: this.cellSize / 2,
      rightPadding: this.cellSize / 2,
      topPadding: this.cellSize / 2,
      bottomPadding: this.cellSize / 2,
    };
  }

  protected cellKind(cell: Cell): number {
    return modulo(cell.x, 9);
  }

  private cellOffsets(cell: Cell): Record<string, number> {
    const x =
      Math.floor(cell.x / 9) * this.cellSize * 4 +
      (modulo(cell.x, 9) * this.cellSize +
        [
          [+0.0, -0.5, +0.5, +0.0, -0.5, +0.5, +0.0, -0.5],
          [-1.0, -1.5, -0.5, -1.0, -1.5, -0.5, -1.0, -1.5],
          [-1.0, -1.5, -0.5, -1.0, -1.5, -0.5, -1.0, -1.5],
          [-1.5, -2.0, -1.0, -1.5, -2.0, -1.5, -2.0, -2.5],
          [-2.5, -3.0, -2.0, -2.5, -3.0, -2.5, -3.0, -3.5],
          [-2.5, -3.0, -2.0, -2.5, -3.0, -2.5, -3.0, -3.5],
          [-3.0, -3.5, -3.0, -3.5, -4.0, -3.0, -3.5, -4.0],
          [-4.0, -4.5, -4.0, -4.5, -5.0, -4.0, -4.5, -5.0],
          [-4.0, -4.5, -4.0, -4.5, -5.0, -4.0, -4.5, -5.0],
        ][modulo(cell.x, 9)][modulo(cell.y, 8)] *
          this.cellSize);

    const y =
      Math.floor(cell.y / 8) * this.cellSize * 12 +
      modulo(cell.y, 8) * this.cellSize +
      [
        [+0.5, +1.0, +1.0, +1.5, +2.0, +2.0, +2.5, +3.0],
        [-0.0, +0.5, +0.5, +1.0, +1.5, +1.5, +2.0, +2.5],
        [-0.0, +0.5, +0.5, +1.0, +1.5, +1.5, +2.0, +2.5],
        [-0.0, +0.5, +0.5, +1.0, +1.5, +3.0, +3.5, +4.0],
        [-0.5, +0.0, +0.0, +0.5, +1.0, +2.5, +3.0, +3.5],
        [-0.5, +0.0, +0.0, +0.5, +1.0, +2.5, +3.0, +3.5],
        [-0.5, +0.0, +1.5, +2.0, +2.5, +2.5, +3.0, +3.5],
        [-1.0, -0.5, +1.0, +1.5, +2.0, +2.0, +2.5, +3.0],
        [-1.0, -0.5, +1.0, +1.5, +2.0, +2.0, +2.5, +3.0],
      ][modulo(cell.x, 9)][modulo(cell.y, 8)] *
        this.cellSize;

    return this.translateOffsets(cell, x, y);
  }

  protected offsets(kind: Kind): Record<string, number> {
    switch (kind) {
      case 0:
      case 3:
      case 6: {
        const x0 = 0;
        const x1 = x0 + this.wallSize;
        const x3 = x0 + this.cellSize;
        const x2 = x3 - this.wallSize;

        const y0 = 0;
        const y1 = y0 + this.wallSize;
        const y3 = y0 + this.cellSize;
        const y2 = y3 - this.wallSize;

        return { x0, x1, x2, x3, y0, y1, y2, y3 };
      }

      case 1:
      case 4:
      case 7: {
        const x0 = 0;
        const x1 = x0 + this.wallSize;
        const x2 = x0 + this.wallSize * 2.0;
        const x4 = x0 + this.cellSize * 0.5;
        const x3 = x4 - this.wallSize;
        const x5 = x4 + this.wallSize;
        const x7 = x0 + this.cellSize;
        const x6 = x7 - this.wallSize;
        const x8 = x7 + this.wallSize;
        const xb = x0 + this.cellSize * 1.5;
        const xa = xb - this.wallSize;
        const x9 = xb - this.wallSize * 2.0;

        const y0 = 0;
        const y1 = y0 + this.wallSize;
        const y3 = y0 + this.cellSize * 0.5;
        const y2 = y3 - this.wallSize;

        return { x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xa, xb, y0, y1, y2, y3 };
      }

      case 2:
      case 5:
      case 8: {
        const x0 = 0;
        const x1 = x0 + this.wallSize;
        const x3 = x0 + this.cellSize * 0.5;
        const x2 = x3 - this.wallSize;

        const y0 = 0;
        const y1 = y0 + this.wallSize;
        const y2 = y0 + this.wallSize * 2.0;
        const y4 = y0 + this.cellSize * 0.5;
        const y3 = y4 - this.wallSize;
        const y5 = y4 + this.wallSize;
        const y7 = y0 + this.cellSize;
        const y6 = y7 - this.wallSize;
        const y8 = y7 + this.wallSize;
        const yb = y0 + this.cellSize * 1.5;
        const ya = yb - this.wallSize;
        const y9 = yb - this.wallSize * 2.0;

        return { x0, x1, x2, x3, y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, ya, yb };
      }

      default: {
        throw new Error(`Unknown kind: ${kind}`);
      }
    }
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0:
        case 3:
        case 6: {
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
          break;
        }

        case 1:
        case 4:
        case 7: {
          const { x0, x4, x7, xb, y0, y3 } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x4, y: y0 },
              { x: xb, y: y0 },
              { x: x7, y: y3 },
              { x: x0, y: y3 },
            ],
            color,
          );
          break;
        }

        case 2:
        case 5:
        case 8: {
          const { x0, x3, y0, y4, y7, yb } = this.cellOffsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y4 },
              { x: x3, y: y0 },
              { x: x3, y: y7 },
              { x: x0, y: yb },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawWall(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0:
        case 3:
        case 6: {
          switch (cell.direction) {
            case 'a': {
              const { x1, x2, y0, y1 } = this.cellOffsets(cell);

              this.drawing.rect({ x: x1, y: y0 }, { x: x2, y: y1 }, color);
              break;
            }

            case 'b': {
              const { x2, x3, y1, y2 } = this.cellOffsets(cell);

              this.drawing.rect({ x: x2, y: y1 }, { x: x3, y: y2 }, color);
              break;
            }

            case 'c': {
              const { x1, x2, y2, y3 } = this.cellOffsets(cell);

              this.drawing.rect({ x: x1, y: y2 }, { x: x2, y: y3 }, color);
              break;
            }

            case 'd': {
              const { x0, x1, y1, y2 } = this.cellOffsets(cell);

              this.drawing.rect({ x: x0, y: y1 }, { x: x1, y: y2 }, color);
              break;
            }

            // no default
          }
          break;
        }

        case 1:
        case 4:
        case 7: {
          switch (cell.direction) {
            case 'e': {
              const { x4, x5, x9, xa, y0, y1 } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x5, y: y0 },
                  { x: xa, y: y0 },
                  { x: x9, y: y1 },
                  { x: x4, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'f': {
              const { x7, x8, x9, xa, y1, y2 } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x9, y: y1 },
                  { x: xa, y: y1 },
                  { x: x8, y: y2 },
                  { x: x7, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'g': {
              const { x1, x2, x6, x7, y2, y3 } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x2, y: y2 },
                  { x: x7, y: y2 },
                  { x: x6, y: y3 },
                  { x: x1, y: y3 },
                ],
                color,
              );
              break;
            }

            case 'h': {
              const { x1, x2, x3, x4, y1, y2 } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x3, y: y1 },
                  { x: x4, y: y1 },
                  { x: x2, y: y2 },
                  { x: x1, y: y2 },
                ],
                color,
              );
              break;
            }

            // no default
          }
          break;
        }

        case 2:
        case 5:
        case 8: {
          switch (cell.direction) {
            case 'i': {
              const { x1, x2, y1, y2, y3, y4 } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x2, y: y1 },
                  { x: x2, y: y2 },
                  { x: x1, y: y4 },
                ],
                color,
              );
              break;
            }

            case 'j': {
              const { x2, x3, y1, y2, y6, y7 } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x2, y: y2 },
                  { x: x3, y: y1 },
                  { x: x3, y: y6 },
                  { x: x2, y: y7 },
                ],
                color,
              );
              break;
            }

            case 'k': {
              const { x1, x2, y7, y8, y9, ya } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x1, y: y9 },
                  { x: x2, y: y7 },
                  { x: x2, y: y8 },
                  { x: x1, y: ya },
                ],
                color,
              );
              break;
            }

            case 'l': {
              const { x0, x1, y4, y5, y9, ya } = this.cellOffsets(cell);

              this.drawing.polygon(
                [
                  { x: x0, y: y5 },
                  { x: x1, y: y4 },
                  { x: x1, y: y9 },
                  { x: x0, y: ya },
                ],
                color,
              );
              break;
            }

            // no default
          }
          break;
        }

        // no default
      }
    }
  }

  public drawPillar(_cell: CellPillar, _color = this.wallColor): void {
    // if (this.drawing) {
    //   const { x0, x1, x2, x3, y0, y1, y2, y3 } = this.cellOffsets({ x, y });
    //   if (pillar === 'nw') {
    //     this.drawing.rect({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
    //   }
    //   if (pillar === 'ne') {
    //     this.drawing.rect({ x: x2, y: y0 }, { x: x3, y: y1 }, color);
    //   }
    //   if (pillar === 'sw') {
    //     this.drawing.rect({ x: x0, y: y2 }, { x: x1, y: y3 }, color);
    //   }
    //   if (pillar === 'se') {
    //     this.drawing.rect({ x: x2, y: y2 }, { x: x3, y: y3 }, color);
    //   }
    // }
  }

  public drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0:
        case 3:
        case 6: {
          const { x1, x2, y1, y2 } = this.cellOffsets(cell);

          this.drawing.line({ x: x1, y: y1 }, { x: x2, y: y2 }, color);
          this.drawing.line({ x: x1, y: y2 }, { x: x2, y: y1 }, color);
          break;
        }

        case 1:
        case 4:
        case 7: {
          const { x2, x4, x7, x9, y1, y2 } = this.cellOffsets(cell);

          this.drawing.line({ x: x2, y: y2 }, { x: x9, y: y1 }, color);
          this.drawing.line({ x: x4, y: y1 }, { x: x7, y: y2 }, color);
          break;
        }

        case 2:
        case 5:
        case 8: {
          const { x1, x2, y2, y4, y7, y9 } = this.cellOffsets(cell);

          this.drawing.line({ x: x1, y: y9 }, { x: x2, y: y2 }, color);
          this.drawing.line({ x: x1, y: y4 }, { x: x2, y: y7 }, color);
          break;
        }

        // no default
      }
    }
  }

  public getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0:
      case 3:
      case 6: {
        const { x1, x2, y1, y2 } = this.cellOffsets(cell);
        return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
      }

      case 1:
      case 4:
      case 7: {
        const { x4, x7, y1, y2 } = this.cellOffsets(cell);
        return { x: x4, y: y1, w: x7 - x4, h: y2 - y1 };
      }

      case 2:
      case 5:
      case 8: {
        const { x1, x2, y4, y7 } = this.cellOffsets(cell);
        return { x: x1, y: y4, w: x2 - x1, h: y7 - y4 };
      }

      default: {
        throw new Error(`Unknown kind: ${this.cellKind(cell)}`);
      }
    }
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
