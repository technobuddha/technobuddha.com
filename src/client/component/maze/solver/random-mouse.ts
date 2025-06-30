/* eslint-disable @typescript-eslint/no-loop-func */
import { type CellFacing } from '../geometry/index.ts';

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
    const history: CellFacing[] = [];
    let mouse = entrance;
    let tail = entrance;

    while (!this.maze.isSame(mouse, exit)) {
      history.push(mouse);

      const next =
        this.randomPick(
          this.maze
            .moves(mouse, { wall: false })
            .filter(({ target }) => !this.maze.isSame(target, tail))
            .map(({ target }) => target),
        ) ?? tail;

      this.maze.drawCell(mouse);
      this.maze.drawAvatar(this.maze.drawCell(next));
      tail = mouse;
      mouse = next;
      yield;
    }
    history.push(mouse);

    this.maze.solution = this.maze.makePath(this.maze.flatten(history));
  }
}
