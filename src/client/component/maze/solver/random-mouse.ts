import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type RandomMouseProperties = MazeSolverProperties;

export class RandomMouse extends MazeSolver {
  public constructor(props: RandomMouseProperties) {
    super(props);
  }

  public *solve({ entrance = this.maze.entrance, exit = this.maze.exit } = {}): Iterator<void> {
    let mouse = entrance;

    while (!this.maze.isSame(mouse, exit)) {
      const next = this.randomPick(this.maze.validMoves(mouse));
      if (next) {
        this.maze.drawCell(mouse);
        this.maze.drawCell(next);
        this.maze.drawAvatar(next);
        mouse = next;
        yield;
      }
    }
  }
}
