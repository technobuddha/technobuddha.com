/* eslint-disable @typescript-eslint/class-methods-use-this */
import { modulo } from '@technobuddha/library';

import { type Rect } from '../drawing/drawing.ts';

import {
  type Cell,
  type CellDirection,
  type CellPillar,
  type DrawingSizes,
  type Kind,
  type MazeProperties,
} from './maze.ts';
import { Maze } from './maze.ts';
import {
  directionMatrix,
  edgesMatrix,
  kindMatrix,
  leftTurnMatrix,
  moveMatrix,
  offsetXMatrix,
  offsetYMatrix,
  oppositeMatrix,
  pathMatrix,
  pillarMatrix,
  rightTurnMatrix,
  sidesMatrix,
  wallMatrix,
} from './pentagon-matrix.ts';

export class PentagonMaze extends Maze {
  public constructor({ cellSize = 20, wallSize = 1, ...props }: MazeProperties) {
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
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize * 5,
      horizontalCellsPerGroup: 4,
      groupHeight: this.cellSize,
      topPadding: this.cellSize * 0.5,
      bottomPadding: this.cellSize * 0.5,
      leftPadding: this.cellSize * 0.5,
      rightPadding: this.cellSize * 0.5,
    };
  }

  protected cellKind(cell: Cell): number {
    return kindMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)];
  }

  protected cellOffsets(cell: Cell): Record<string, number> {
    const x = offsetXMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)] * this.cellSize;
    const y = offsetYMatrix[modulo(cell.y, 5)][modulo(cell.x, 4)] * this.cellSize;

    return this.translateOffsets(
      cell,
      x + Math.floor(cell.x / 4) * this.cellSize * 5,
      y + Math.floor(cell.y / 5) * this.cellSize * 5,
    );
  }

  protected offsets(kind: Kind): Record<string, number> {
    switch (kind) {
      case 0: {
        const x0 = 0;
        const x2 = x0 + this.wallSize;
        const x4 = x0 + this.cellSize / 2;
        const x8 = x0 + this.cellSize;
        const x6 = x8 - this.wallSize;
        const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2);
        const x5 = x4 + Math.sqrt(this.wallSize ** 2 * 2);
        const x1 = x0 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x7 = x8 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));

        const y0 = 0;
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
        const x0 = 0;
        const x1 = x0 + this.wallSize;
        const x4 = x0 + this.cellSize;
        const x8 = x0 + this.cellSize * 1.5;
        const x2 = x4 - this.wallSize;
        const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2);
        const x5 = x4 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x7 = x8 - Math.sqrt(this.wallSize ** 2 * 2);
        const x6 = x7 - Math.sqrt(this.wallSize ** 2 * 2);

        const y0 = 0;
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
        const x0 = 0;
        const x4 = x0 + this.cellSize * 0.5;
        const x8 = x0 + this.cellSize * 1.5;
        const x7 = x8 - this.wallSize;
        const x1 = x0 + Math.sqrt(this.wallSize ** 2 * 2);
        const x2 = x1 + Math.sqrt(this.wallSize ** 2 * 2);
        const x3 = x4 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x5 = x4 + this.wallSize * 0.5;
        const x6 = x5 + this.wallSize;

        const y0 = 0;
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
        const x0 = 0;
        const x8 = x0 + this.cellSize;
        const x2 = x0 + this.wallSize;
        const x6 = x8 - this.wallSize;
        const x4 = x0 + this.cellSize * 0.5;
        const x3 = x4 - Math.sqrt(this.wallSize ** 2 * 2);
        const x5 = x4 + Math.sqrt(this.wallSize ** 2 * 2);
        const x1 = x0 + (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));
        const x7 = x8 - (this.wallSize - Math.sqrt(this.wallSize ** 2 / 2));

        const y0 = 0;
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
          const { x0, x4, x8, y0, y4, y8 } = this.cellOffsets(cell);

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
          const { x0, x4, x8, y0, y4, y8 } = this.cellOffsets(cell);

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
          const { x0, x4, x8, y0, y4, y8 } = this.cellOffsets(cell);

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
          const { x0, x4, x8, y0, y4, y8 } = this.cellOffsets(cell);

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
              const { x2, x6, y0, y1 } = this.cellOffsets(cd);

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
              const { x6, x8, y1, y2 } = this.cellOffsets(cd);

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
              const { x4, x5, x6, x7, y3, y5, y6, y7 } = this.cellOffsets(cd);

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
              const { x1, x2, x3, x4, y3, y5, y6, y7 } = this.cellOffsets(cd);

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
              const { x0, x2, y1, y2 } = this.cellOffsets(cd);

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
              const { x1, x2, y0, y2 } = this.cellOffsets(cd);

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
              const { x3, x5, x6, x7, y1, y2, y3, y4 } = this.cellOffsets(cd);

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
              const { x3, x6, x5, x7, y4, y5, y6, y7 } = this.cellOffsets(cd);

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
              const { x1, x2, y6, y8 } = this.cellOffsets(cd);

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
              const { x0, x1, y2, y6 } = this.cellOffsets(cd);

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
              const { x6, x7, y0, y2 } = this.cellOffsets(cd);

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
              const { x7, x8, y2, y6 } = this.cellOffsets(cd);

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
              const { x6, x7, y6, y8 } = this.cellOffsets(cd);

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
              const { x1, x2, x3, x5, y4, y5, y6, y7 } = this.cellOffsets(cd);

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
              const { x1, x2, x3, x5, y1, y2, y3, y4 } = this.cellOffsets(cd);

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
              const { x1, x2, x3, x4, y1, y2, y3, y5 } = this.cellOffsets(cd);

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
              const { x4, x5, x6, x7, y1, y2, y3, y5 } = this.cellOffsets(cd);

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
              const { x6, x8, y6, y7 } = this.cellOffsets(cd);

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
              const { x2, x6, y7, y8 } = this.cellOffsets(cd);

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
              const { x0, x2, y6, y7 } = this.cellOffsets(cd);

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

  public drawPillar({ x, y, pillar }: CellPillar, color = this.wallColor): void {
    if (this.drawing) {
      switch (this.cellKind({ x, y })) {
        case 0: {
          switch (pillar) {
            case 'ab': {
              const { x6, x8, y0, y1 } = this.cellOffsets({ x, y });

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
              const { x6, x7, x8, y2, y3, y4, y5 } = this.cellOffsets({ x, y });

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
              const { x3, x4, x5, y6, y7, y8 } = this.cellOffsets({ x, y });

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
              const { x0, x1, x2, y2, y3, y4, y5 } = this.cellOffsets({ x, y });

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
              const { x0, x2, y0, y1 } = this.cellOffsets({ x, y });

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
          switch (pillar) {
            case 'fg': {
              const { x2, x3, x4, x5, y0, y1, y2 } = this.cellOffsets({ x, y });

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
              const { x6, x7, x8, y3, y4, y5 } = this.cellOffsets({ x, y });

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
              const { x2, x3, x4, x5, y6, y7, y8 } = this.cellOffsets({ x, y });

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
              const { x0, x1, y6, y8 } = this.cellOffsets({ x, y });

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
              const { x0, x1, y0, y2 } = this.cellOffsets({ x, y });

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
          switch (pillar) {
            case 'kl': {
              const { x7, x8, y0, y2 } = this.cellOffsets({ x, y });

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
              const { x7, x8, y6, y8 } = this.cellOffsets({ x, y });

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
              const { x3, x4, x5, x6, y6, y7, y8 } = this.cellOffsets({ x, y });

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
              const { x0, x1, x2, y3, y4, y5 } = this.cellOffsets({ x, y });

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
              const { x3, x4, x5, x6, y0, y1, y2 } = this.cellOffsets({ x, y });

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
          switch (pillar) {
            case 'pq': {
              const { x3, x4, x5, y0, y1, y2 } = this.cellOffsets({ x, y });

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
              const { x6, x7, x8, y3, y4, y5, y6 } = this.cellOffsets({ x, y });

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
              const { x6, x8, y7, y8 } = this.cellOffsets({ x, y });

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
              const { x0, x2, y7, y8 } = this.cellOffsets({ x, y });

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
              const { x0, x1, x2, y3, y4, y5, y6 } = this.cellOffsets({ x, y });

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

  public drawX(cell: Cell, color = 'red'): void {
    if (this.drawing) {
      switch (this.cellKind(cell)) {
        case 0: {
          const { x0, x2, x4, x6, x8, y0, y1, y4, y6, y8 } = this.cellOffsets(cell);

          this.drawing.line({ x: x2, y: y1 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y1 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x2, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x4, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }

        case 1: {
          const { x0, x1, x3, x6, x8, y0, y2, y4, y6, y8 } = this.cellOffsets(cell);

          this.drawing.line({ x: x1, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x3, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x1, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x3, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x6, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }

        case 2: {
          const { x0, x2, x5, x7, x8, y0, y2, y4, y6, y8 } = this.cellOffsets(cell);

          this.drawing.line({ x: x5, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x7, y: y2 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x5, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x7, y: y6 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          this.drawing.line({ x: x2, y: y4 }, { x: (x0 + x8) / 2, y: (y0 + y8) / 2 }, color);
          break;
        }

        case 3: {
          const { x0, x2, x4, x6, x8, y0, y2, y5, y7, y8 } = this.cellOffsets(cell);

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

  public override getRect(cell: Cell): Rect {
    const { x0, x8, y0, y8 } = this.cellOffsets(cell);

    return { x: x0, y: y0, w: x8 - x0, h: y8 - y0 };
  }
}
