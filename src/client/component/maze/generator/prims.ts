import { type Cell } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export class Prims extends MazeGenerator {
  public activeCells: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.activeCells = [this.start];

    this.player = 0;
    this.createPlayer({ start: this.start });
    this.visit();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public override async *generate(): AsyncGenerator<void> {
    while (this.activeCells.length > 0) {
      const cellIndex = Math.floor(this.random() * this.activeCells.length);
      const currentCell = this.activeCells[cellIndex];

      const next = this.randomPick(
        this.maze.moves(currentCell).filter(({ move }) => !this.isVisited(move)),
      );
      if (next) {
        this.maze.removeWall(currentCell, next.direction);
        yield;
        this.visit({ cell: next.move });

        this.activeCells.push(next.move);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }
  }
}
