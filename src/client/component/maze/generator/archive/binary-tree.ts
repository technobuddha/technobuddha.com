import { MazeGenerator, type MazeGeneratorProperties } from '../maze-generator.ts';

export class BinaryTree extends MazeGenerator {
  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = { x: 0, y: 0 };
  }

  public *generate(): Generator<void> {
    do {
      const preferreds = this.maze.preferreds(this.currentCell);

      const cell = this.randomPick(
        this.maze.neighbors(this.currentCell).filter((c) => preferreds.includes(c.direction)),
      );
      if (cell) {
        yield this.maze.removeWall(this.currentCell, cell.direction);
      }

      this.currentCell.x++;
      if (this.currentCell.x >= this.maze.width) {
        this.currentCell.x = 0;
        this.currentCell.y++;
      }
    } while (this.currentCell.y < this.maze.height);
  }
}
