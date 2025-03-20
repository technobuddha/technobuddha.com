import { create2DArray, randomShuffle } from '@technobuddha/library';

import { type Cell, type CellDirection } from '../maze/maze.js';

import { type MazeGeneratorProperties } from './maze-generator.js';
import { MazeGenerator } from './maze-generator.js';

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

type BlobProperties = MazeGeneratorProperties & {
  threshold?: number;
};

export class Blob extends MazeGenerator {
  private readonly threshold: number;
  private readonly walls: CellDirection[] = [];

  public constructor({ threshold = 3, ...props }: BlobProperties) {
    super({ ...props });

    this.threshold = threshold;
    this.walls = [];

    this.maze.removeInteriorWalls();

    const allRegion = new Region({ width: this.maze.width, height: this.maze.height });
    for (let x = 0; x < this.maze.width; ++x) {
      for (let y = 0; y < this.maze.height; ++y) {
        allRegion.addCell({ x, y });
      }
    }

    const stack = [allRegion];
    while (stack.length > 0) {
      const region = stack.pop()!;

      const [seedA, seedB] = randomShuffle(region.cells());
      region.subregions[seedA.x][seedA.y] = 'a';
      region.subregions[seedB.x][seedB.y] = 'b';

      const frontier = [seedA, seedB];

      while (frontier.length > 0) {
        const index = Math.floor(Math.random() * frontier.length);
        const cell = frontier[index];

        const neighbors = this.maze
          .neighbors(cell)
          .filter((n) => region.subregions[n.x][n.y] === 'm');

        if (neighbors.length > 0) {
          const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
          region.subregions[neighbor.x][neighbor.y] = region.subregions[cell.x][cell.y];
          frontier.push(neighbor);
        } else {
          frontier.splice(index, 1);
        }
      }

      const boundary = region
        .cells('a')
        .flatMap((cell) =>
          this.maze.neighbors(cell).filter((n) => region.subregions[n.x][n.y] === 'b'),
        );

      boundary.splice(Math.floor(Math.random() * boundary.length), 1);

      for (const cd of boundary) {
        this.walls.push({ ...cd, direction: this.maze.opposite(cd.direction) });
      }

      stack.push(...region.split(this.threshold));
    }
  }

  protected override step(): boolean {
    if (this.walls.length > 0) {
      const wall = this.walls.shift()!;
      this.maze.addWall(wall, wall.direction);
      return true;
    }
    return false;
  }
}
