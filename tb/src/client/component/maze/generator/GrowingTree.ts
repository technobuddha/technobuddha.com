import create2DArray from '@technobuddha/library/create2DArray';
import type { Cell } from '../maze/Maze';
import { MazeGenerator } from './MazeGenerator';
import type { MazeGeneratorProperties } from './MazeGenerator';

type SelectionMethod = 'newest' | 'oldest' | 'middle' | 'random';

export class GrowingTree extends MazeGenerator {
    private readonly    visited:  boolean[][];
    private readonly    list:     Cell[];

    constructor(props: MazeGeneratorProperties) {
        super(props);

        this.visited = create2DArray(this.maze.width, this.maze.height, false);
        this.list  = [ this.start ];
        this.visited[this.start.x][this.start.y] = true;
    }

    private selectMethod(cellSelectionMethod: SelectionMethod = 'random') {
        //if(typeof cellSelectionMethod === 'string')
        return cellSelectionMethod;

        // const selectionMethods = ['newest', 'oldest', 'middle', 'random'];
        // const selectedMethods  = Object.entries(cellSelectionMethods)
        // for(const key of Object.keys(cellSelectionMethod)) {
        //     if(selectionMethods.includes(key))
        //         selectedMethods.push({ method: key, weight: cellSelectionMethod[key] });
        // }

        // if(selectedMethods.length === 0) throw 'Invalid cell selection method';

        // const sum = selectedMethods.reduce((a, b) => a + b.weight, 0);
        // let acc = 0;

        // selectedMethods = selectedMethods.map((method) => {
        //   return { ...method, weight: (acc += method.weight) };
        // });

        // const rand = this.random() * sum;
        // const res = selectedMethods.find((method) => rand <= method.weight);

        // return res.method;
    }

    public selectCell(selectionMethod: SelectionMethod): number {
        switch(selectionMethod) {
            case 'newest':
                return this.list.length - 1;
            case 'oldest':
                return 0;
            case 'middle':
                return Math.floor(this.list.length / 2);
            case 'random':
                return Math.floor(this.random() * this.list.length);
        }
    }

    public override step(): boolean {
        const index      = this.selectCell(this.selectMethod());
        this.currentCell = this.list[index];

        const unvisitedNeighbors = this.maze.neighbors(this.currentCell).filter(cell => !this.visited[cell.x][cell.y]);
        if(unvisitedNeighbors.length > 0) {
            const cell = this.selectNeighbor(unvisitedNeighbors);
            this.maze.removeWall(this.currentCell, cell.direction);
            this.visited[cell.x][cell.y] = true;

            this.list.push(cell);
        } else {
            this.list.splice(index, 1);
        }

        return this.list.length > 0;
    }
}

export default GrowingTree;
