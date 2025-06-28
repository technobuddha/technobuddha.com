import { type CellFacing } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties, type Strategy } from './maze-generator.ts';

export type RecursiveBacktrackerProperties = MazeGeneratorProperties & {
  parallel?: number;
  strategy?: Strategy[];
  forced?: number;
};

export class RecursiveBacktracker extends MazeGenerator {
  private readonly parallel: number;

  public constructor({ parallel, strategy, forced = 0, ...props }: RecursiveBacktrackerProperties) {
    super(props);

    this.parallel = parallel ?? strategy?.length ?? 1;

    this.forced = forced;

    const all = this.maze.cellsInMaze();
    for (let i = 0; i < this.parallel; ++i) {
      const randomCell = this.randomPick(all)!;

      const start: CellFacing = {
        ...randomCell,
        facing: this.maze.opposite(this.randomPick(this.maze.nexus(randomCell).wallDirections)!),
      };

      this.createPlayer({ start, strategy: strategy?.[i] });
      this.player = i;
      this.visit();
    }

    this.player = 0;
  }

  public async *generate(): AsyncGenerator<void> {
    while (true) {
      // If all players are at the end of their stack, we need to join the segments
      if (this.state.every((s) => s.current === undefined)) {
        this.player = 0;

        const borderCell = this.randomPick(
          this.maze
            .cellsInMaze()
            .filter((c) => this.isVisitedByMe(c) && !this.maze.nexus(c).bridge)
            .flatMap((c) =>
              this.maze
                .moves(c, { wall: 'all' })
                .filter(({ move }) => !this.isVisitedByMe(move) && !this.maze.nexus(move).bridge),
            ),
        )?.move;

        if (borderCell) {
          this.maze.removeWall(borderCell, this.maze.opposite(borderCell.facing));
          yield;
          this.visit({ cell: borderCell });
        } else {
          this.fixUnreachables();
          return;
        }
      } else {
        // Find the next player
        while (this.state[this.player].current === undefined) {
          this.player = (this.player + 1) % this.parallel;
        }

        const next = this.step();
        if (next) {
          this.maze.removeWall(next, this.maze.opposite(next.facing));
          yield;

          this.state[this.player].stack.push(this.state[this.player].current!);
          this.moveTo(next);
          this.visit();

          this.player = (this.player + 1) % this.parallel;
        } else {
          this.state[this.player].current = this.state[this.player].stack.pop();
        }
      }
    }
  }
}
