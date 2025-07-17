import { type Cartesian, modulo } from '@technobuddha/library';

import { type Cell } from '../geometry.ts';
import { type DrawingSizes } from '../maze.ts';

import { matrixDiamond } from './octagon-matrix.ts';
import { OctagonMaze, type OctagonMazeProperties } from './octagon-maze.ts';

export type OctagonDiamondProperties = OctagonMazeProperties;

export class OctagonDiamond extends OctagonMaze {
  public constructor(props: OctagonDiamondProperties) {
    super(props, matrixDiamond);
  }

  protected drawingSize(): DrawingSizes {
    return {
      groupWidth: this.cellSize,
      horizontalCellsPerGroup: 2,
      groupHeight: this.cellSize,
    };
  }

  // Don't render the last row of squares, the maze looks better
  public override inMaze(cell: Cell): boolean {
    return (
      super.inMaze(cell) &&
      cell.x < this.width - 1 &&
      (modulo(cell.x, 2) === 0 || cell.y < this.height - 1)
    );
  }

  public override cellKind(cell: Cell): number {
    return modulo(cell.x, 2);
  }

  protected cellOrigin(cell: Cell): Cartesian {
    // Calculate the length of a an octagon side
    const ao = this.cellSize / (1 + Math.SQRT2);

    switch (this.cellKind(cell)) {
      case 0: {
        return { x: cell.x * this.cellSize * 0.5, y: cell.y * this.cellSize };
      }

      case 1: {
        return {
          x: ((cell.x - 1) * this.cellSize) / 2 + this.cellSize - Math.sqrt((ao * ao) / 2),
          y: cell.y * this.cellSize + this.cellSize - Math.sqrt((ao * ao) / 2),
        };
      }

      default: {
        throw new Error(`Unknown cell kind: ${this.cellKind(cell)}`);
      }
    }
  }
}
