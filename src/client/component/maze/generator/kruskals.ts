import { type Cell, type CellDirection } from '../maze/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

class DisjointSet {
  private sets: number[];
  private readonly setSizes: number[];

  public constructor(numberOfItems = 0) {
    //Array of items. Each item has an index which points to the parent set.
    this.sets = [];

    //record the size of the sets so we know which one should win (only at the parent index)
    this.setSizes = [];

    for (let i = 0; i < numberOfItems; i++) {
      this.sets[i] = i;
      this.setSizes[i] = 1;
    }
  }

  public findParent(index: number): number {
    const parentIndex = this.sets[index];

    //if the parent is itself, then it has no parent so it must be the parent of the set
    if (parentIndex === index) {
      return index;
    }

    //recursively find parent until it has no parent (parent is self)
    const rootParentIndex = this.findParent(parentIndex);

    //save it for later so we don't have to go searching that far up the tree again
    this.sets[index] = rootParentIndex;
    return rootParentIndex;
  }

  //join 2 sets together
  public union(index1: number, index2: number): void {
    const parent1 = this.findParent(index1);
    const parent2 = this.findParent(index2);

    //the bigger set should always win, so that we can avoid flickering when visualizing the sets
    if (this.setSizes[parent1] >= this.setSizes[parent2]) {
      this.sets[parent2] = parent1;
      this.setSizes[parent1] += this.setSizes[parent2];
    } else {
      this.sets[parent1] = parent2;
      this.setSizes[parent2] += this.setSizes[parent1];
    }
  }
}

export class Kruskals extends MazeGenerator {
  private readonly disjointSubsets: DisjointSet;
  private readonly edges: CellDirection[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.disjointSubsets = new DisjointSet(this.maze.width * this.maze.height);

    this.edges = this.randomShuffle(
      this.maze.all().flatMap((c) => this.maze.edges(c).map((direction) => ({ ...c, direction }))),
    );

    this.currentCell = this.maze.all().at(0)!;
  }

  private getCellIndex(cell: Cell): number {
    const {
      maze: { width },
    } = this;

    return cell.y * width + cell.x;
  }

  public *generate(): Iterator<void> {
    while (this.edges.length > 0) {
      const edge = this.edges.pop()!;
      const cell1 = { ...edge };
      const cell2 = this.maze.move(cell1, edge.direction)!;

      const idx1 = this.getCellIndex(cell1);
      const idx2 = this.getCellIndex(cell2);

      const parent1 = this.disjointSubsets.findParent(idx1);
      const parent2 = this.disjointSubsets.findParent(idx2);

      if (parent1 !== parent2) {
        this.maze.removeWall(cell1, edge.direction);
        yield;
        this.disjointSubsets.union(idx1, idx2);
      }
    }
  }
}
