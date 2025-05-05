/* eslint-disable @typescript-eslint/no-loop-func */
import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type RandomMouseProperties = MazeSolverProperties;

export class RandomMouse extends MazeSolver {
  public constructor(props: RandomMouseProperties) {
    super(props);
  }

  public *solve({ entrance = this.maze.entrance, exit = this.maze.exit } = {}): Iterator<void> {
    let mouse = entrance;
    let tail = entrance;

    while (!this.maze.isSame(mouse, exit)) {
      const next =
        this.randomPick(this.maze.validMoves(mouse).filter((c) => !this.maze.isSame(c, tail))) ??
        tail;

      this.maze.drawCell(mouse);
      this.maze.drawCell(next);
      this.maze.drawAvatar(next);
      tail = mouse;
      mouse = next;
      yield;
    }
  }
}
