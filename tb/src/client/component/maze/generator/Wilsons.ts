import create2DArray from '@technobuddha/library/create2DArray';
import type { Cell, CellDirection } from '../maze/Maze';
import { MazeGenerator } from './MazeGenerator';
import type { MazeGeneratorProperties } from './MazeGenerator';

export class Wilsons extends MazeGenerator {
    private readonly    visited:      boolean[][];
    private readonly    unvisited:    Cell[];

    constructor(props: MazeGeneratorProperties) {
        super(props);

        const { width, height } = this.maze;

        this.visited = create2DArray(width, height, false);
        this.unvisited = create2DArray(width, height, (x, y) => ({ x, y })).flat();

        this.currentCell = this.start;
        this.markAsVisited(this.currentCell);
    }

    private markAsVisited(cell: Cell) {
        this.visited[cell.x][cell.y] = true;

        const index = this.unvisited.findIndex(c => c.x === cell.x && c.y === cell.y);
        if(index >= 0)
            this.unvisited.splice(index, 1);
    }

    public override step(): boolean {
        this.currentCell = this.unvisited[Math.floor(this.random() * this.unvisited.length)];
        let path: (Cell | CellDirection)[] = [ this.currentCell ];

        while(!this.visited[this.currentCell.x][this.currentCell.y]) {
            const cell = this.selectNeighbor(this.maze.neighbors(this.currentCell));

            let cellVisited = false;
            let cellPreviousIndex = -1;
            for(const [ index, pathCell ]  of path.entries()) {
                if(pathCell.x === cell.x && pathCell.y === cell.y) {
                    cellVisited = true;
                    cellPreviousIndex = index;
                }
            }

            if(!cellVisited) {
                path.push(cell);
                this.currentCell = cell;
            } else {
                this.currentCell = path[cellPreviousIndex];
                path = path.slice(0, cellPreviousIndex + 1);
            }
        }

        for(const cell of path) {
            if('direction' in cell)
                this.maze.removeWall(cell, this.maze.opposite(cell.direction));
            this.markAsVisited(cell);
        }

        return this.unvisited.length > 0;
    }
}

export default Wilsons;
