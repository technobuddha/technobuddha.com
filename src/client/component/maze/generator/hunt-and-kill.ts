import { type AllOrder, type CellDirection } from '../geometry/index.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export type HuntAndKillProperties = MazeGeneratorProperties & {
  huntMethod?: AllOrder;
};

export class HuntAndKill extends MazeGenerator {
  private readonly huntMethod: AllOrder;

  public constructor({ huntMethod = 'top-left', ...props }: HuntAndKillProperties) {
    super(props);

    this.huntMethod = huntMethod;

    // We are not supporting multiple hunters at this moment
    this.createPlayer();
    this.player = 0;
  }

  public async *generate(): AsyncGenerator<void> {
    while (true) {
      // kill
      this.visit();

      const next = this.step();

      if (next) {
        this.moveTo(next);
        this.maze.removeWall(next, this.maze.opposite(next.facing));
        yield;
      } else {
        // hunt
        let target: CellDirection | undefined = undefined;
        for (const cell of this.maze.cellsInMaze(this.huntMethod)) {
          if (!this.isVisited(cell)) {
            const hunted = this.randomPick(
              this.maze.moves(cell, { wall: 'all' }).filter(({ target }) => this.isVisited(target)),
            );
            if (hunted) {
              target = { ...cell, direction: hunted.direction };
              break;
            }
          }
        }
        if (target) {
          yield this.maze.removeWall(target, target.direction);
          this.moveTo({ ...target, facing: this.maze.opposite(target.direction) });
        } else {
          return;
        }
      }
    }
  }
}
