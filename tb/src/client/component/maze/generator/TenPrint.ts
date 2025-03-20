import { MazeGenerator } from './MazeGenerator';
import type { MazeGeneratorProperties } from './MazeGenerator';

export class TenPrint extends MazeGenerator {
    constructor(props: MazeGeneratorProperties) {
        super(props);
        this.currentCell = { x: 0, y: 0 };
    }

    public override step(): boolean {
        const neighbors = this.maze.neighbors(this.currentCell, { dirs: [ 'S', 'E' ]});
        if(neighbors.length > 0) {
            const n1 = this.selectNeighbor(neighbors);
            const n2 = this.maze.move(this.currentCell, this.maze.opposite(n1.direction))!;

            if(this.maze.inMaze(n1)) this.maze.removeWall(this.currentCell, n1.direction);
            if(this.maze.inMaze(n2)) this.maze.removeWall(this.currentCell, n2.direction);
        } else {
            this.maze.removeWall(this.currentCell, 'E');
            this.maze.removeWall({ x: this.currentCell.x - 1, y: this.currentCell.y }, 'E');
        }

        this.currentCell.x += 2;
        if(this.currentCell.x >= this.maze.width) {
            this.currentCell.y++;
            this.currentCell.x = this.currentCell.y % 2;
        }

        return this.currentCell.y < this.maze.height;
    }
}

export default TenPrint;
