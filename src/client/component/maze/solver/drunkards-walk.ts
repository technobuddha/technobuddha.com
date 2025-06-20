import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

export type DrunkardsWalkProperties = MazeSolverProperties;

export class DrunkardsWalk extends MazeSolver {
  public constructor(props: DrunkardsWalkProperties) {
    super(props);
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncIterator<void> {
    let drunkard = entrance;

    while (!this.maze.isSame(drunkard, exit)) {
      const next = this.randomPick(
        this.maze.moves(drunkard, { wall: false }).map(({ move }) => move),
      );
      if (next) {
        this.maze.drawCell(drunkard);
        this.maze.drawCell(next);
        this.maze.drawAvatar(next);
        drunkard = next;
        yield;
      }
    }
  }
}
