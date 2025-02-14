import { MazeGenerator } from './MazeGenerator';
import type { MazeGeneratorProperties } from './MazeGenerator';

export class TenPrint extends MazeGenerator {
    constructor(props: MazeGeneratorProperties) {
        super(props);

        this.currentCell = { x: 0, y: 0 };
    }

    public override step(): boolean {
        const neighbors = this.maze.neighbors(this.currentCell, { dirs: [ 'S', 'E' ]});
        if(neighbors.length > 0)
            this.maze.removeWall(this.currentCell, this.selectNeighbor(neighbors).direction);

        this.currentCell.x++;
        if(this.currentCell.x >= this.maze.width) {
            this.currentCell.x = 0;
            this.currentCell.y++;
        }

        return this.currentCell.y < this.maze.height;
    }
}

export default TenPrint;
