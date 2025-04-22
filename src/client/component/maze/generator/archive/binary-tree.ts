import { MazeGenerator, type MazeGeneratorProperties } from '../maze-generator.ts';

export class BinaryTree extends MazeGenerator {
  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = { x: 0, y: 0 };
  }

  public *generate(): Iterator<void> {
    do {
      const edges = this.maze.edges(this.currentCell);

      const cell = this.randomPick(
        this.maze.neighbors(this.currentCell).filter((c) => edges.includes(c.direction)),
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
