import { type Cell } from '../geometry/index.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export type PrimsProperties = MazeGeneratorProperties;

export class Prims extends MazeGenerator {
  public activeCells: Cell[];

  public constructor(props: PrimsProperties) {
    super(props);

    this.activeCells = [this.start];

    this.player = 0;
    this.createPlayer({ start: this.start });
    this.visit();
  }

  public override async *generate(): AsyncGenerator<void> {
    while (this.activeCells.length > 0) {
      const cellIndex = this.randomNumber(this.activeCells.length);
      const currentCell = this.activeCells[cellIndex];

      const next = this.randomPick(
        this.maze
          .moves(currentCell, { wall: true })
          .filter(({ target }) => !this.isVisited(target)),
      );
      if (next) {
        this.maze.removeWall(currentCell, next.direction);
        yield;
        this.visit({ cell: next.target });

        this.activeCells.push(next.target);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }
  }
}
