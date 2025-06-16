import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

type SubRegion = 'a' | 'b' | 'm';

class Region {
  private readonly width: number;
  private readonly height: number;
  public subregions: (SubRegion | null)[][];

  public constructor({ width, height }: { width: number; height: number }) {
    this.width = width;
    this.height = height;
    this.subregions = create2DArray(width, height, null);
  }

  public cells(subregion = 'm'): Cell[] {
    const cs: Cell[] = [];

    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        if (this.subregions[x][y] === subregion) {
          cs.push({ x, y });
        }
      }
    }

    return cs;
  }

  public split(threshold: number): Region[] {
    const rs: Region[] = [];

    const a = this.cells('a');
    const b = this.cells('b');

    if (a.length >= threshold) {
      const r = new Region({ width: this.width, height: this.height });
      for (const c of a) {
        r.addCell(c);
      }
      rs.push(r);
    }

    if (b.length >= threshold) {
      const r = new Region({ width: this.width, height: this.height });
      for (const c of b) {
        r.addCell(c);
      }
      rs.push(r);
    }

    return rs;
  }

  public addCell(cell: Cell): void {
    this.subregions[cell.x][cell.y] = 'm';
  }
}

type DivisionProperties = MazeGeneratorProperties & {
  threshold?: number;
};

export class Division extends MazeGenerator {
  private readonly threshold: number;

  public constructor({ threshold = 3, ...props }: DivisionProperties) {
    super({ ...props });

    this.threshold = threshold;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async *generate(): AsyncGenerator<void> {
    this.maze.removeInteriorWalls();
    this.maze.draw();

    const allRegion = new Region({ width: this.maze.width, height: this.maze.height });
    for (const cell of this.maze.cellsInMaze()) {
      allRegion.addCell(cell);
    }

    const stack = [allRegion];
    while (stack.length > 0) {
      const region = stack.pop()!;

      const [seedA, seedB] = this.randomShuffle(region.cells());
      region.subregions[seedA.x][seedA.y] = 'a';
      region.subregions[seedB.x][seedB.y] = 'b';

      const frontier = [seedA, seedB];

      while (frontier.length > 0) {
        const index = Math.floor(this.random() * frontier.length);
        const cell = frontier[index];

        const neighbors = this.maze
          .moves(cell)
          .filter(({ move }) => region.subregions[move.x][move.y] === 'm');

        if (neighbors.length > 0) {
          const neighbor = neighbors[Math.floor(this.random() * neighbors.length)];
          region.subregions[neighbor.move.x][neighbor.move.y] = region.subregions[cell.x][cell.y];
          frontier.push(neighbor.move);
        } else {
          frontier.splice(index, 1);
        }
      }

      const boundary = region
        .cells('a')
        .flatMap((cell) =>
          this.maze.moves(cell).filter(({ move }) => region.subregions[move.x][move.y] === 'b'),
        );

      boundary.splice(Math.floor(this.random() * boundary.length), 1);

      for (const cd of boundary) {
        this.maze.addWall(cd.move, this.maze.opposite(cd.move));
        yield;
      }

      stack.push(...region.split(this.threshold));
    }
  }
}
