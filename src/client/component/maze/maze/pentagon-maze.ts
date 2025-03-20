import { modulo } from '@technobuddha/library';

import {
  type Cell,
  type CellCorner,
  type CellDirection,
  type Direction,
  type MazeProperties,
  type Overrides,
  type Wall,
} from './maze.js';
import { Maze } from './maze.js';
import {
  cornerMatrix,
  directionMatrix,
  edgeMatrix,
  kindMatrix,
  leftTurnMatrix,
  moveMatrix,
  offsetXMatrix,
  offsetYMatrix,
  oppositeMatrix,
  rightTurnMatrix,
  wallMatrix,
} from './pentagon-matrix.js';

export class PentagonMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 1, ...props }: MazeProperties) {
    super({ cellSize, wallSize, ...props }, directionMatrix, cornerMatrix);
  }

  protected drawingWidth(): [cell: number, padding: number] {
    return [(this.cellSize * 5) / 4, this.cellSize];
  }

  protected drawingHeight(): [cell: number, padding: number] {
    return [this.cellSize, this.cellSize];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected cellKind(cell: Cell): number {
    return kindMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)];
  }

  protected initialWalls(x: number, y: number): Wall {
    return { ...wallMatrix[this.cellKind({ x, y })] };
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public opposite(direction: Direction): Direction {
    return oppositeMatrix[direction];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public rightTurn(direction: Direction): Direction[] {
    return rightTurnMatrix[direction];
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public leftTurn(direction: Direction): Direction[] {
    return leftTurnMatrix[direction];
  }

  public move(cell: Cell, direction: Direction): CellDirection | null {
    const mover = moveMatrix[this.cellKind(cell)]?.[direction]?.[modulo(cell.y, 5)];

    if (mover) {
      return {
        x: cell.x + mover.x,
        y: cell.y + mover.y,
        direction,
      };
    }

    return null;
  }

  public isDeadEnd(cell: Cell): boolean {
    return (
      this.sides(cell) === 4 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
    );
  }

  public edges(cell: Cell, { walls = this.walls }: Overrides = {}): string[] {
    return this.neighbors(cell, {
      directions: edgeMatrix[this.cellKind(cell)],
      walls,
    }).map((cd) => cd.direction);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public divider(_cell1: Cell, _cell2: Cell): CellDirection[] {
    throw new Error('Not Implemented');
  }

  private offsets({ x, y }: Cell): Record<string, number> {
    const xx = offsetXMatrix[modulo(y, 5)][modulo(x, 4)] * this.cellSize;
    const yy = offsetYMatrix[modulo(y, 5)][modulo(x, 4)] * this.cellSize;

    switch (this.cellKind({ x, y })) {
      case 0: {
        const x0 = xx + Math.floor(x / 4) * this.cellSize * 5;
        const x2 = x0 + this.wallSize;
        const x4 = x0 + this.cellSize / 2;
        const x8 = x0 + this.cellSize;
        const x6 = x8 - this.wallSize;
        const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2);
        const x5 = x4 + Math.sqrt(this.wallSize ** 2 * 2);
        const x1 = x0 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x7 = x8 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));

        const y0 = yy + Math.floor(y / 5) * this.cellSize * 5;
        const y1 = y0 + this.wallSize;
        const y4 = y0 + this.cellSize;
        const y2 = y4 - this.wallSize;
        const y8 = y0 + this.cellSize * 1.5;
        const y7 = y8 - Math.sqrt(this.wallSize ** 2 * 2);
        const y6 = y7 - Math.sqrt(this.wallSize ** 2 * 2);
        const y5 = y4 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const y3 = y5 - Math.sqrt(this.wallSize ** 2 * 2);

        return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
      }

      case 1: {
        const x0 = xx + Math.floor(x / 4) * this.cellSize * 5;
        const x1 = x0 + this.wallSize;
        const x4 = x0 + this.cellSize;
        const x8 = x0 + this.cellSize * 1.5;
        const x2 = x4 - this.wallSize;
        const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2);
        const x5 = x4 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x7 = x8 - Math.sqrt(this.wallSize ** 2 * 2);
        const x6 = x7 - Math.sqrt(this.wallSize ** 2 * 2);

        const y0 = yy + Math.floor(y / 5) * this.cellSize * 5;
        const y2 = y0 + this.wallSize;
        const y4 = y0 + this.cellSize / 2;
        const y8 = y0 + this.cellSize;
        const y6 = y8 - this.wallSize;
        const y3 = y4 - Math.sqrt(this.wallSize ** 2 * 2);
        const y5 = y4 + Math.sqrt(this.wallSize ** 2 * 2);
        const y1 = y0 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const y7 = y8 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));

        return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
      }

      case 2: {
        const x0 = xx + Math.floor(x / 4) * this.cellSize * 5;
        const x4 = x0 + this.cellSize * 0.5;
        const x8 = x0 + this.cellSize * 1.5;
        const x7 = x8 - this.wallSize;
        const x1 = x0 + Math.sqrt(this.wallSize ** 2 * 2);
        const x2 = x1 + Math.sqrt(this.wallSize ** 2 * 2);
        const x3 = x4 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x5 = x4 + this.wallSize * 0.5;
        const x6 = x5 + this.wallSize;

        const y0 = yy + Math.floor(y / 5) * this.cellSize * 5;
        const y2 = y0 + this.wallSize;
        const y4 = y0 + this.cellSize / 2;
        const y8 = y0 + this.cellSize;
        const y6 = y8 - this.wallSize;
        const y3 = y4 - Math.sqrt(this.wallSize ** 2 * 2);
        const y5 = y4 + Math.sqrt(this.wallSize ** 2 * 2);
        const y1 = y0 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const y7 = y8 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));

        return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
      }

      case 3: {
        const x0 = xx + Math.floor(x / 4) * this.cellSize * 5;
        const x8 = x0 + this.cellSize;
        const x2 = x0 + this.wallSize;
        const x6 = x8 - this.wallSize;
        const x4 = x0 + this.cellSize * 0.5;
        const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2);
        const x5 = x4 + Math.sqrt(this.wallSize ** 2 * 2);
        const x1 = x0 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x7 = x8 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));

        const y0 = yy + Math.floor(y / 5) * this.cellSize * 5;
        const y4 = y0 + this.cellSize * 0.5;
        const y6 = y4 + this.wallSize;
        const y8 = y0 + this.cellSize * 1.5;
        const y7 = y8 - this.wallSize;
        const y1 = y0 + Math.sqrt(this.wallSize ** 2 * 2);
        const y2 = y1 + Math.sqrt(this.wallSize ** 2 * 2);
        const y3 = y4 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const y5 = y4 + Math.sqrt(this.wallSize ** 2 * 2);

        return { x0, x1, x2, x3, x4, x5, x6, x7, x8, y0, y1, y2, y3, y4, y5, y6, y7, y8 };
      }

      // no default
    }

    return {};
  }

  public drawFloor(cell: Cell, color = this.cellColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x4, x8, y0, y4, y8 } = this.offsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x8, y: y0 },
              { x: x8, y: y4 },
              { x: x4, y: y8 },
              { x: x0, y: y4 },
            ],
            color,
          );

          break;
        }

        case 1: {
          const { x0, x4, x8, y0, y4, y8 } = this.offsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y0 },
              { x: x4, y: y0 },
              { x: x8, y: y4 },
              { x: x4, y: y8 },
              { x: x0, y: y8 },
            ],
            color,
          );

          break;
        }

        case 2: {
          const { x0, x4, x8, y0, y4, y8 } = this.offsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y4 },
              { x: x4, y: y0 },
              { x: x8, y: y0 },
              { x: x8, y: y8 },
              { x: x4, y: y8 },
            ],
            color,
          );
          break;
        }

        case 3: {
          const { x0, x4, x8, y0, y4, y8 } = this.offsets(cell);

          this.drawing.polygon(
            [
              { x: x0, y: y4 },
              { x: x4, y: y0 },
              { x: x8, y: y4 },
              { x: x8, y: y8 },
              { x: x0, y: y8 },
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
              const { x2, x6, y0, y1 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x2, y: y0 },
                  { x: x6, y: y0 },
                  { x: x6, y: y1 },
                  { x: x2, y: y1 },
                ],
                color,
              );
              break;
            }

            case 'b': {
              const { x6, x8, y1, y2 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x6, y: y1 },
                  { x: x8, y: y1 },
                  { x: x8, y: y2 },
                  { x: x6, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'c': {
              const { x4, x5, x6, x7, y3, y5, y6, y7 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x4, y: y6 },
                  { x: x6, y: y3 },
                  { x: x7, y: y5 },
                  { x: x5, y: y7 },
                ],
                color,
              );
              break;
            }

            case 'd': {
              const { x1, x2, x3, x4, y3, y5, y6, y7 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y5 },
                  { x: x2, y: y3 },
                  { x: x4, y: y6 },
                  { x: x3, y: y7 },
                ],
                color,
              );
              break;
            }

            case 'e': {
              const { x0, x2, y1, y2 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x0, y: y1 },
                  { x: x2, y: y1 },
                  { x: x2, y: y2 },
                  { x: x0, y: y2 },
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
            case 'f': {
              const { x1, x2, y0, y2 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y0 },
                  { x: x2, y: y0 },
                  { x: x2, y: y2 },
                  { x: x1, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'g': {
              const { x3, x5, x6, x7, y1, y2, y3, y4 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x3, y: y2 },
                  { x: x5, y: y1 },
                  { x: x7, y: y3 },
                  { x: x6, y: y4 },
                ],
                color,
              );
              break;
            }

            case 'h': {
              const { x3, x6, x5, x7, y4, y5, y6, y7 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x3, y: y6 },
                  { x: x6, y: y4 },
                  { x: x7, y: y5 },
                  { x: x5, y: y7 },
                ],
                color,
              );
              break;
            }

            case 'i': {
              const { x1, x2, y6, y8 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y6 },
                  { x: x2, y: y6 },
                  { x: x2, y: y8 },
                  { x: x1, y: y8 },
                ],
                color,
              );
              break;
            }

            case 'j': {
              const { x0, x1, y2, y6 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x0, y: y2 },
                  { x: x1, y: y2 },
                  { x: x1, y: y6 },
                  { x: x0, y: y6 },
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
            case 'k': {
              const { x6, x7, y0, y2 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x6, y: y0 },
                  { x: x7, y: y0 },
                  { x: x7, y: y2 },
                  { x: x6, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'l': {
              const { x7, x8, y2, y6 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x7, y: y2 },
                  { x: x8, y: y2 },
                  { x: x8, y: y6 },
                  { x: x7, y: y6 },
                ],
                color,
              );
              break;
            }

            case 'm': {
              const { x6, x7, y6, y8 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x6, y: y6 },
                  { x: x7, y: y6 },
                  { x: x7, y: y8 },
                  { x: x6, y: y8 },
                ],
                color,
              );
              break;
            }

            case 'n': {
              const { x1, x2, x3, x5, y4, y5, y6, y7 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y5 },
                  { x: x2, y: y4 },
                  { x: x5, y: y6 },
                  { x: x3, y: y7 },
                ],
                color,
              );
              break;
            }

            case 'o': {
              const { x1, x2, x3, x5, y1, y2, y3, y4 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x3, y: y1 },
                  { x: x5, y: y2 },
                  { x: x2, y: y4 },
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
            case 'p': {
              const { x1, x2, x3, x4, y1, y2, y3, y5 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x3, y: y1 },
                  { x: x4, y: y2 },
                  { x: x2, y: y5 },
                ],
                color,
              );
              break;
            }

            case 'q': {
              const { x4, x5, x6, x7, y1, y2, y3, y5 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x4, y: y2 },
                  { x: x5, y: y1 },
                  { x: x7, y: y3 },
                  { x: x6, y: y5 },
                ],
                color,
              );
              break;
            }

            case 'r': {
              const { x6, x8, y6, y7 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x6, y: y6 },
                  { x: x8, y: y6 },
                  { x: x8, y: y7 },
                  { x: x6, y: y7 },
                ],
                color,
              );
              break;
            }

            case 's': {
              const { x2, x6, y7, y8 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x2, y: y7 },
                  { x: x6, y: y7 },
                  { x: x6, y: y8 },
                  { x: x2, y: y8 },
                ],
                color,
              );
              break;
            }

            case 't': {
              const { x0, x2, y6, y7 } = this.offsets(cd);

              this.drawing.polygon(
                [
                  { x: x0, y: y6 },
                  { x: x2, y: y6 },
                  { x: x2, y: y7 },
                  { x: x0, y: y7 },
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

  public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
    if (this.drawing) {
      switch (this.cellKind({ x, y })) {
        case 0: {
          switch (corner) {
            case 'ab': {
              const { x6, x8, y0, y1 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x6, y: y0 },
                  { x: x8, y: y0 },
                  { x: x8, y: y1 },
                  { x: x6, y: y1 },
                ],
                color,
              );

              break;
            }

            case 'bc': {
              const { x6, x7, x8, y2, y3, y4, y5 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x6, y: y2 },
                  { x: x8, y: y2 },
                  { x: x8, y: y4 },
                  { x: x7, y: y5 },
                  { x: x6, y: y3 },
                ],
                color,
              );
              break;
            }

            case 'cd': {
              const { x3, x4, x5, y6, y7, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x3, y: y7 },
                  { x: x4, y: y6 },
                  { x: x5, y: y7 },
                  { x: x4, y: y8 },
                ],
                color,
              );
              break;
            }

            case 'de': {
              const { x0, x1, x2, y2, y3, y4, y5 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x0, y: y2 },
                  { x: x2, y: y2 },
                  { x: x2, y: y4 },
                  { x: x1, y: y5 },
                  { x: x0, y: y3 },
                ],
                color,
              );
              break;
            }

            case 'ea': {
              const { x0, x2, y0, y1 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x0, y: y0 },
                  { x: x2, y: y0 },
                  { x: x2, y: y1 },
                  { x: x0, y: y1 },
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
          switch (corner) {
            case 'fg': {
              const { x2, x3, x4, x5, y0, y1, y2 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x2, y: y0 },
                  { x: x4, y: y0 },
                  { x: x5, y: y1 },
                  { x: x3, y: y2 },
                  { x: x2, y: y2 },
                ],
                color,
              );
              break;
            }

            case 'gh': {
              const { x6, x7, x8, y3, y4, y5 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x7, y: y3 },
                  { x: x8, y: y4 },
                  { x: x7, y: y5 },
                  { x: x6, y: y4 },
                ],
                color,
              );

              break;
            }

            case 'hi': {
              const { x2, x3, x4, x5, y6, y7, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x2, y: y6 },
                  { x: x4, y: y6 },
                  { x: x5, y: y7 },
                  { x: x3, y: y8 },
                  { x: x2, y: y8 },
                ],
                color,
              );
              break;
            }

            case 'ij': {
              const { x0, x1, y6, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x0, y: y6 },
                  { x: x1, y: y6 },
                  { x: x1, y: y8 },
                  { x: x0, y: y8 },
                ],
                color,
              );

              break;
            }

            case 'jf': {
              const { x0, x1, y0, y2 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x0, y: y0 },
                  { x: x1, y: y0 },
                  { x: x1, y: y2 },
                  { x: x0, y: y2 },
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
          switch (corner) {
            case 'kl': {
              const { x7, x8, y0, y2 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x7, y: y0 },
                  { x: x8, y: y0 },
                  { x: x8, y: y2 },
                  { x: x7, y: y2 },
                ],
                color,
              );

              break;
            }

            case 'lm': {
              const { x7, x8, y6, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x7, y: y6 },
                  { x: x8, y: y6 },
                  { x: x8, y: y8 },
                  { x: x7, y: y8 },
                ],
                color,
              );

              break;
            }

            case 'mn': {
              const { x3, x4, x5, x6, y6, y7, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x5, y: y6 },
                  { x: x6, y: y6 },
                  { x: x6, y: y8 },
                  { x: x4, y: y8 },
                  { x: x3, y: y7 },
                ],
                color,
              );
              break;
            }

            case 'no': {
              const { x0, x1, x2, y3, y4, y5 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x2, y: y4 },
                  { x: x1, y: y5 },
                  { x: x0, y: y4 },
                ],
                color,
              );

              break;
            }

            case 'ok': {
              const { x3, x4, x5, x6, y0, y1, y2 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x5, y: y0 },
                  { x: x6, y: y0 },
                  { x: x6, y: y2 },
                  { x: x4, y: y2 },
                  { x: x3, y: y1 },
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
          switch (corner) {
            case 'pq': {
              const { x3, x4, x5, y0, y1, y2 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x4, y: y0 },
                  { x: x5, y: y1 },
                  { x: x4, y: y2 },
                  { x: x3, y: y1 },
                ],
                color,
              );

              break;
            }

            case 'qr': {
              const { x6, x7, x8, y3, y4, y5, y6 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x7, y: y3 },
                  { x: x8, y: y4 },
                  { x: x8, y: y6 },
                  { x: x6, y: y6 },
                  { x: x6, y: y5 },
                ],
                color,
              );
              break;
            }

            case 'rs': {
              const { x6, x8, y7, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x6, y: y7 },
                  { x: x8, y: y7 },
                  { x: x8, y: y8 },
                  { x: x6, y: y8 },
                ],
                color,
              );

              break;
            }

            case 'st': {
              const { x0, x2, y7, y8 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x0, y: y7 },
                  { x: x2, y: y7 },
                  { x: x2, y: y8 },
                  { x: x0, y: y8 },
                ],
                color,
              );

              break;
            }

            case 'tp': {
              const { x0, x1, x2, y3, y4, y5, y6 } = this.offsets({ x, y });

              this.drawing.polygon(
                [
                  { x: x1, y: y3 },
                  { x: x2, y: y4 },
                  { x: x2, y: y6 },
                  { x: x0, y: y6 },
                  { x: x0, y: y5 },
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
      //
    }
  }

  public drawPath(_cell: CellDirection, _color = 'red'): void {
    if (this.drawing) {
      //
    }
  }

  public drawX(cell: Cell, color = 'red', _cellColor = this.cellColor): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x2, x4, x6, x8, y0, y1, y4, y6, y8 } = this.offsets(cell);

          this.drawing.line({ x: x2, y: y1 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y1 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x2, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x4, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }

        case 1: {
          const { x0, x1, x3, x6, x8, y0, y2, y4, y6, y8 } = this.offsets(cell);

          this.drawing.line({ x: x1, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x3, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x1, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x3, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }

        case 2: {
          const { x0, x2, x5, x7, x8, y0, y2, y4, y6, y8 } = this.offsets(cell);

          this.drawing.line({ x: x5, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x7, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x5, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x7, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x2, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }

        case 3: {
          const { x0, x2, x4, x6, x8, y0, y2, y5, y7, y8 } = this.offsets(cell);

          this.drawing.line({ x: x2, y: y7 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y7 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x2, y: y5 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y5 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x4, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }
        // no default
      }
    }
  }

  public override drawText(cell: Cell, text: string, color = this.wallColor): void {
    if (this.drawing) {
      const { x0, x8, y0, y8 } = this.offsets(cell);

      this.drawing.text({ x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, text, color);
    }
  }
}
