/* eslint-disable @typescript-eslint/no-loop-func */
import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

export type RandomMouseProperties = MazeSolverProperties;

export class RandomMouse extends MazeSolver {
  public constructor(props: RandomMouseProperties) {
    super(props);
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    let mouse = entrance;
    let tail = entrance;

    while (!this.maze.isSame(mouse, exit)) {
      const next =
        this.randomPick(
          this.maze
            .moves(mouse, { wall: false })
            .filter(({ move }) => !this.maze.isSame(move, tail))
            .map(({ move }) => move),
        ) ?? tail;

      this.maze.drawCell(mouse);
      this.maze.drawAvatar(this.maze.drawCell(next));
      tail = mouse;
      mouse = next;
      yield;
    }
  }
}
