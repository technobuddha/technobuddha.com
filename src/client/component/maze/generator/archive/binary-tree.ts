import { MazeGenerator, type MazeGeneratorProperties } from '../maze-generator.js';

export class BinaryTree extends MazeGenerator {
  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = { x: 0, y: 0 };
  }

  public override step(): boolean {
    // TODO
    const neighbors = this.maze.neighbors(this.currentCell, { directions: ['S', 'E'] });
    if (neighbors.length > 0) {
      this.maze.removeWall(this.currentCell, this.selectNeighbor(neighbors)!.direction);
    }

    this.currentCell.x++;
    if (this.currentCell.x >= this.maze.width) {
      this.currentCell.x = 0;
      this.currentCell.y++;
    }

    return this.currentCell.y < this.maze.height;
  }
}
