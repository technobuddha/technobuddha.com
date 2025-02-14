import randomShuffle from '@technobuddha/library/randomShuffle';
import type { Cell, CellDirection } from '../maze/Maze';
import { MazeGenerator } from './MazeGenerator';
import type { MazeGeneratorProperties } from './MazeGenerator';

export class Kruskals extends MazeGenerator {
    private readonly    disjointSubsets: DisjointSet;
    private readonly    edges: CellDirection[];

    constructor(props: MazeGeneratorProperties) {
        super(props);

        this.disjointSubsets = new DisjointSet(this.maze.width * this.maze.height);

        this.edges = [];
        for(let x = 0; x < this.maze.width; ++x) {
            for(let y = 0; y < this.maze.height; ++y) {
                for(const direction of this.maze.edges({ x, y }))
                    this.edges.push({ x, y, direction });
            }
        }
        this.edges = randomShuffle(this.edges);

        this.currentCell = { x: 0, y: 0 };
    }

    private getCellIndex(cell: Cell) {
        const { maze: { width }} = this;

        return cell.y * width + cell.x;
    }

    public override step(): boolean {
        const edge  = this.edges.pop()!;
        const cell1 = { ...edge };
        const cell2 = this.maze.move(cell1, edge.direction)!;

        let idx1 = this.getCellIndex(cell1);
        let idx2 = this.getCellIndex(cell2);

        let parent1 = this.disjointSubsets.findParent(idx1);
        let parent2 = this.disjointSubsets.findParent(idx2);

        if(parent1 !== parent2) {
            this.maze.removeWall(cell1, edge.direction);
            this.disjointSubsets.union(idx1, idx2);
        }

        return this.edges.length > 0;
    }
}

export default Kruskals;

class DisjointSet {
    private             sets:       number[];
    private readonly    setSizes:   number[];

    constructor(numberOfItems = 0) {
        //Array of items. Each item has an index which points to the parent set.
        this.sets = [];

        //record the size of the sets so we know which one should win (only at the parent index)
        this.setSizes = [];

        for(let i = 0; i < numberOfItems; i++) {
            this.sets[i] = i;
            this.setSizes[i] = 1;
        }
    }

    public findParent(index: number): number {
        let parentIndex = this.sets[index];

        //if the parent is itself, then it has no parent so it must be the parent of the set
        if(parentIndex === index)
            return index;

        //recursively find parent until it has no parent (parent is self)
        let rootParentIndex = this.findParent(parentIndex);

        //save it for later so we don't have to go searching that far up the tree again
        this.sets[index] = rootParentIndex;
        return rootParentIndex;
    }

    //join 2 sets together
    public union(index1: number, index2: number) {
        let parent1 = this.findParent(index1);
        let parent2 = this.findParent(index2);

        //the bigger set should always win, so that we can avoid flickering when visualizing the sets
        if(this.setSizes[parent1] >= this.setSizes[parent2]) {
            this.sets[parent2] = parent1;
            this.setSizes[parent1] += this.setSizes[parent2];
        } else {
            this.sets[parent1] = parent2;
            this.setSizes[parent2] += this.setSizes[parent1];
        }
    }
}
