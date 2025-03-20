/* eslint-disable @typescript-eslint/class-methods-use-this */
import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.js';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type Kind,
  type MazeProperties,
} from './maze.js';
import { Maze } from './maze.js';
import {
  directionMatrix,
  edgesMatrix,
  leftTurnMatrix,
  moveMatrix,
  oppositeMatrix,
  pillarMatrix,
  rightTurnMatrix,
  sidesMatrix,
  wallMatrix,
} from './wedge-matrix.js';

export class WedgeMaze extends Maze {
  public constructor({ cellSize = 24, wallSize = 1, ...props }: MazeProperties) {
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
    );
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [this.cellSize * 0.5, 0];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, 0];
  }

  protected cellKind(cell: Cell): number {
    return modulo(cell.x + modulo(cell.y, 2) * 2, 4);
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    return this.translateOffsets(
      cell,
      Math.floor(cell.x * 0.5) * this.cellSize,
      cell.y * this.cellSize,
    );
  }

  protected offsets(kind: Kind): Record<string, number> {
    switch (kind) {
      case 0: {
        const x0 = 0;
        const x1 = x0 + this.wallSize;
        const x2 = x1 + this.wallSize * Math.SQRT2 * 0.5;
        const x5 = x0 + this.cellSize;
        const x4 = x5 - this.wallSize * Math.SQRT2 * 1.5;
        const x3 = x5 - this.wallSize * Math.SQRT2 * 2.0;

        const y0 = 0;
        const y1 = y0 + this.wallSize;
        const y2 = y1 + this.wallSize * Math.SQRT2 * 0.5;
        const y5 = y0 + this.cellSize;
        const y4 = y5 - this.wallSize * Math.SQRT2 * 1.5;
        const y3 = y5 - this.wallSize * Math.SQRT2 * 2.0;

        return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 };
      }

      case 1: {
        const x0 = 0;
        const x1 = x0 + this.wallSize * Math.SQRT2 * 1.5;
        const x2 = x0 + this.wallSize * Math.SQRT2 * 2.0;
        const x5 = x0 + this.cellSize;
        const x4 = x5 - this.wallSize;
        const x3 = x4 - this.wallSize * Math.SQRT2 * 2.0;

        const y0 = 0;
        const y5 = y0 + this.cellSize;
        const y4 = y5 - this.wallSize;
        const y3 = y4 - this.wallSize * Math.SQRT2 * 0.5;
        const y1 = y0 + this.wallSize * Math.SQRT2 * 1.5;
        const y2 = y0 + this.wallSize * Math.SQRT2 * 2.0;

        return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 };
      }

      case 2: {
        const x0 = 0;
        const x1 = x0 + this.wallSize;
        const x2 = x1 + this.wallSize * Math.SQRT2 * 0.5;
        const x5 = x0 + this.cellSize;
        const x4 = x5 - this.wallSize * Math.SQRT2 * 1.5;
        const x3 = x5 - this.wallSize * Math.SQRT2 * 2.0;

        const y0 = 0;
        const y1 = y0 + this.wallSize * Math.SQRT2 * 1.5;
        const y2 = y0 + this.wallSize * Math.SQRT2 * 2.0;
        const y5 = y0 + this.cellSize;
        const y4 = y5 - this.wallSize;
        const y3 = y4 - this.wallSize * Math.SQRT2 * 0.5;

        return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 };
      }

      case 3: {
        const x0 = 0;
        const x5 = x0 + this.cellSize;
        const x4 = x5 - this.wallSize;
        const x3 = x4 - this.wallSize * Math.SQRT2 * 0.5;
        const x1 = x0 + this.wallSize * Math.SQRT2 * 1.5;
        const x2 = x0 + this.wallSize * Math.SQRT2 * 2.0;

        const y0 = 0;
        const y1 = y0 + this.wallSize;
        const y2 = y1 + this.wallSize * Math.SQRT2 * 0.5;
        const y5 = y0 + this.cellSize;
        const y4 = y5 - this.wallSize * Math.SQRT2 * 1.5;
        const y3 = y5 - this.wallSize * Math.SQRT2 * 2.0;

        return { x0, x1, x2, x3, x4, x5, y0, y1, y2, y3, y4, y5 };
      }

      default: {
        throw new Error(`Invalid kind: ${kind}`);
      }
    }
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x5, y0, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x5, y: y0 },
              { x: x0, y: y5 },
            ],
            color,
          );
          break;
        }

        case 1: {
          const { x0, x5, y0, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x5, y: y0 },
              { x: x5, y: y5 },
              { x: x0, y: y5 },
            ],
            color,
          );
          break;
        }

        case 2: {
          const { x0, x5, y0, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x5, y: y5 },
              { x: x0, y: y5 },
            ],
            color,
          );
          break;
        }

        case 3: {
          const { x0, x5, y0, y5 } = this.cellOffsets(cell);
          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x5, y: y0 },
              { x: x5, y: y5 },
            ],
            color,
          );
          break;
        }

        // no default
      }
    }
  }

  public drawWall(cd: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      switch (this.cellKind(cd)) {
        case 0: {
          switch (cd.direction) {
            case 'a': {
              const { x1, x3, y0, y1 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y0 },
                  { x: x3, y: y0 },
                  { x: x3, y: y1 },
                  { x: x1, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'b': {
              const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x2, y: y4 },
                  { x: x4, y: y2 },
                  { x: x3, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'c': {
              const { x0, x1, y1, y3 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x0, y: y1 },
                  { x: x1, y: y1 },
                  { x: x1, y: y3 },
                  { x: x0, y: y3 },
                ],
                color,
              );
              break;
            }

            // no default
          }
          break;
        }

        case 1: {
          switch (cd.direction) {
            case 'd': {
              const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x2, y: y4 },
                  { x: x4, y: y2 },
                  { x: x3, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'e': {
              const { x4, x5, y2, y3 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x4, y: y2 },
                  { x: x5, y: y2 },
                  { x: x5, y: y3 },
                  { x: x4, y: y3 },
                ],
                color,
              );
              break;
            }

            case 'f': {
              const { x2, x4, y4, y5 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x2, y: y4 },
                  { x: x4, y: y4 },
                  { x: x4, y: y5 },
                  { x: x2, y: y5 },
                ],
                color,
              );
              break;
            }

            // no default
          }
          break;
        }

        case 2: {
          switch (cd.direction) {
            case 'g': {
              const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x2, y: y1 },
                  { x: x4, y: y3 },
                  { x: x3, y: y4 },
                  { x: x1, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'h': {
              const { x1, x3, y4, y5 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y4 },
                  { x: x3, y: y4 },
                  { x: x3, y: y5 },
                  { x: x1, y: y5 },
                ],
                color,
              );
              break;
            }

            case 'i': {
              const { x0, x1, y2, y4 } = this.cellOffsets(cd);

              this.drawing.polygon(
                [
                  { x: x0, y: y2 },
                  { x: x1, y: y2 },
                  { x: x1, y: y4 },
                  { x: x0, y: y4 },
                ],
                color,
              );
              break;
            }

            // no default
          }
          break;
        }

        case 3: {
          switch (cd.direction) {
            case 'j': {
              const { x2, x3, y0, y1 } = this.cellOffsets(cd);
              this.drawing.polygon(
                [
                  { x: x2, y: y0 },
                  { x: x3, y: y0 },
                  { x: x3, y: y1 },
                  { x: x2, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'k': {
              const { x4, x5, y1, y3 } = this.cellOffsets(cd);
              this.drawing.polygon(
                [
                  { x: x4, y: y1 },
                  { x: x5, y: y1 },
                  { x: x5, y: y3 },
                  { x: x4, y: y3 },
                ],
                color,
              );
              break;
            }

            case 'l': {
              const { x1, x2, x3, x4, y1, y2, y3, y4 } = this.cellOffsets(cd);
              this.drawing.polygon(
                [
                  { x: x2, y: y1 },
                  { x: x4, y: y3 },
                  { x: x3, y: y4 },
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

        // no default
      }
    }
  }

  public drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      switch (this.cellKind({ x, y })) {
        case 0: {
          switch (pillar) {
            case 'ab': {
              const { x3, x4, x5, y0, y1, y2 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x3, y: y0 },
                  { x: x5, y: y0 },
                  { x: x5, y: y2 },
                  { x: x4, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'bc': {
              const { x0, x1, x2, y3, y4, y5 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x0, y: y3 },
                  { x: x1, y: y3 },
                  { x: x2, y: y4 },
                  { x: x0, y: y5 },
                ],
                color,
              );
              break;
            }

            case 'ca': {
              const { x0, x1, y0, y1 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x0, y: y0 },
                  { x: x1, y: y0 },
                  { x: x1, y: y1 },
                  { x: x0, y: y1 },
                ],
                color,
              );
            }

            // no default
          }
          break;
        }
        case 1: {
          switch (pillar) {
            case 'de': {
              const { x3, x4, x5, y0, y1, y2 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x5, y: y0 },
                  { x: x5, y: y2 },
                  { x: x4, y: y2 },
                  { x: x3, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'ef': {
              const { x4, x5, y4, y5 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x4, y: y4 },
                  { x: x5, y: y4 },
                  { x: x5, y: y5 },
                  { x: x4, y: y5 },
                ],
                color,
              );
              break;
            }

            case 'fd': {
              const { x0, x1, x2, y3, y4, y5 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x2, y: y4 },
                  { x: x2, y: y5 },
                  { x: x0, y: y5 },
                ],
                color,
              );
            }

            // no default
          }
          break;
        }
        case 2: {
          switch (pillar) {
            case 'ig': {
              const { x0, x1, x2, y0, y1, y2 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x0, y: y0 },
                  { x: x2, y: y1 },
                  { x: x1, y: y2 },
                  { x: x0, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'gh': {
              const { x3, x4, x5, y3, y4, y5 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x4, y: y3 },
                  { x: x5, y: y5 },
                  { x: x3, y: y5 },
                  { x: x3, y: y4 },
                ],
                color,
              );
              break;
            }

            case 'hi': {
              const { x0, x1, y4, y5 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x0, y: y4 },
                  { x: x1, y: y4 },
                  { x: x1, y: y5 },
                  { x: x0, y: y5 },
                ],
                color,
              );
            }

            // no default
          }
          break;
        }
        case 3: {
          switch (pillar) {
            case 'jk': {
              const { x4, x5, y0, y1 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x4, y: y0 },
                  { x: x5, y: y0 },
                  { x: x5, y: y1 },
                  { x: x4, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'kl': {
              const { x3, x4, x5, y3, y4, y5 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x4, y: y3 },
                  { x: x5, y: y3 },
                  { x: x5, y: y5 },
                  { x: x3, y: y4 },
                ],
                color,
              );
              break;
            }

            case 'lj': {
              const { x0, x1, x2, y0, y1, y2 } = this.cellOffsets({ x, y });
              this.drawing.polygon(
                [
                  { x: x0, y: y0 },
                  { x: x2, y: y0 },
                  { x: x2, y: y1 },
                  { x: x1, y: y2 },
                ],
                color,
              );
            }

            // no default
          }
          break;
        }
        // no default
      }
    }
  }

  public drawPath(cell: CellDirection, color = 'red'): void {
    if (this.drawing) {
      const angle = {
        a: 90,
        b: 315,
        c: 180,
        d: 135,
        e: 0,
        f: 270,
        g: 45,
        h: 270,
        i: 180,
        j: 90,
        k: 0,
        l: 225,
      }[cell.direction]!;
      this.drawCell(cell);
      this.drawArrow(this.getRect(cell), angle, color);
    }
  }

  public drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x1, x3, y1, y3 } = this.cellOffsets(cell);
          this.drawing.line({ x: x1, y: y1 }, { x: (x1 + x3) / 2, y: (y1 + y3) / 2 }, color);
          this.drawing.line({ x: x3, y: y1 }, { x: x1, y: (y1 + y3) / 2 }, color);
          this.drawing.line({ x: x1, y: y3 }, { x: (x1 + x3) / 2, y: y1 }, color);
          break;
        }

        case 1: {
          const { x2, x4, y2, y4 } = this.cellOffsets(cell);
          this.drawing.line({ x: x2, y: y4 }, { x: x4, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: x4, y: y2 }, { x: (x2 + x4) / 2, y: y4 }, color);
          this.drawing.line({ x: x4, y: y4 }, { x: (x2 + x4) / 2, y: (y2 + y4) / 2 }, color);
          break;
        }

        case 2: {
          const { x1, x3, y2, y4 } = this.cellOffsets(cell);
          this.drawing.line({ x: x1, y: y2 }, { x: (x1 + x3) / 2, y: y4 }, color);
          this.drawing.line({ x: x3, y: y4 }, { x: x1, y: (y2 + y4) / 2 }, color);
          this.drawing.line({ x: x1, y: y4 }, { x: (x1 + x3) / 2, y: (y2 + y4) / 2 }, color);
          break;
        }

        case 3: {
          const { x2, x3, y1, y3 } = this.cellOffsets(cell);
          this.drawing.line({ x: x2, y: y1 }, { x: x3, y: (y1 + y3) / 2 }, color);
          this.drawing.line({ x: x3, y: y1 }, { x: (x2 + x3) / 2, y: (y1 + y3) / 2 }, color);
          this.drawing.line({ x: x3, y: y3 }, { x: (x2 + x3) / 2, y: y1 }, color);
          break;
        }

        default: {
          throw new Error(`Kind not found: ${this.cellKind(cell)}`);
        }
      }
    }
  }

  public getRect(cell: Cell): Rect {
    switch (this.cellKind(cell)) {
      case 0: {
        const { x1, x3, y1, y3 } = this.cellOffsets(cell);

        return { x: x1, y: y1, w: (x3 - x1) * 0.5, h: (y3 - y1) * 0.5 };
      }

      case 1: {
        const { x1, x3, y1, y3 } = this.cellOffsets(cell);

        return {
          x: x1 + (x3 - x1) * 0.5,
          y: y1 + (y3 - y1) * 0.5,
          w: (x3 - x1) * 0.5,
          h: (y3 - y1) * 0.5,
        };
      }

      case 2: {
        const { x1, x3, y1, y3 } = this.cellOffsets(cell);

        return { x: x1, y: y1 + (y3 - y1) * 0.5, w: (x3 - x1) * 0.5, h: (y3 - y1) * 0.5 };
      }

      case 3: {
        const { x1, x3, y1, y3 } = this.cellOffsets(cell);

        return { x: x1 + (x3 - x1) * 0.5, y: y1, w: (x3 - x1) * 0.5, h: (y3 - y1) * 0.5 };
      }

      default: {
        throw new Error(`Invalid kind: ${this.cellKind(cell)}`);
      }
    }
  }
}
