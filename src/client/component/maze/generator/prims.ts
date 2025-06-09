import { type Cell } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export class Prims extends MazeGenerator {
  public activeCells: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.activeCells = [this.start];

    this.player = 0;
    this.createPlayer(this.maze.randomCellDirection(this.start));
    this.visit(this.start);
  }

  public override *generate(): Generator<void> {
    while (this.activeCells.length > 0) {
      const cellIndex = Math.floor(this.random() * this.activeCells.length);
      const currentCell = this.activeCells[cellIndex];

      const next = this.randomPick(
        this.maze.moves(currentCell).filter(({ move }) => !this.isVisited(move)),
      );
      if (next) {
        this.maze.removeWall(currentCell, next.direction);
        yield;
        this.visit(next.move);

        this.activeCells.push(next.move);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }
  }
}
