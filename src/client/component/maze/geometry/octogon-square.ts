import { type Cartesian, modulo } from '@technobuddha/library';

import { type Cell, type DrawingSizes } from './maze.ts';
import { matrixSquare } from './octogon-matrix.ts';
import { OctogonMaze, type OctogonMazeProperties } from './octogon-maze.ts';

export type OctogonSquareProperties = OctogonMazeProperties;

export class OctogonSquare extends OctogonMaze {
  public constructor(props: OctogonSquareProperties) {
    super(props, matrixSquare);
  }

  protected drawingSize(): DrawingSizes {
    // Calculare the length of a an octogon side
    const ao = this.cellSize / (1 + Math.SQRT2);

    return {
      groupWidth: this.cellSize + ao,
      horizontalCellsPerGroup: 2,
      groupHeight: this.cellSize + ao,
      verticalCellsPerGroup: 2,
      bottomPadding: -(ao * Math.SQRT1_2),
    };
  }

  // Don't render the last row of squares, the maze looks better
  public override inMaze(cell: Cell): boolean {
    return super.inMaze(cell) && cell.x < this.width - 1 && cell.y < this.height - 1;
  }

  public override cellKind(cell: Cell): number {
    return (
      modulo(cell.y, 2) === 0 ?
        modulo(cell.x, 2) === 0 ?
          0
        : 2
      : modulo(cell.x, 2) === 0 ? 2
      : 0
    );
  }

  protected cellOrigin(cell: Cell): Cartesian {
    // Calculare the length of a an octogon side
    const ao = this.cellSize / (1 + Math.SQRT2);

    let x = 0;
    let y = 0;

    switch (this.cellKind(cell)) {
      case 0: {
        x = Math.floor(cell.x / 2) * (this.cellSize + ao);
        y = Math.floor(cell.y / 2) * (this.cellSize + ao);
        break;
      }

      case 2: {
        x =
          Math.floor(cell.x / 2) * (this.cellSize + ao) +
          (modulo(cell.y, 2) === 0 ? this.cellSize : -ao);
        y = Math.floor(cell.y / 2) * (this.cellSize + ao) + Math.SQRT1_2 * ao;
        break;
      }

      default: {
        throw new Error(`Unknown cell kind: ${this.cellKind(cell)}`);
      }
    }

    if (modulo(cell.y, 2) === 1) {
      x += ao * Math.SQRT1_2 + ao;
      y += ao * Math.SQRT1_2 + ao;
    }

    return { x, y };
  }
}
