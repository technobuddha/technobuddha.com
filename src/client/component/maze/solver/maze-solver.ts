import { randomPick, randomShuffle } from '@technobuddha/library';

import { type CellDirection, type Maze } from '../geometry/maze.ts';

type Trash = AbortController;

export type MazeSolverProperties = {
  maze: Maze;
  speed?: number;
  random?(this: void): number;
};

export type SolveArguments = {
  color?: string;
  entrance?: CellDirection;
  exit?: CellDirection;
};

export abstract class MazeSolver extends EventTarget implements Disposable {
  public readonly speed: number;

  protected readonly trash = new Set<Trash>();

  protected maze: MazeSolverProperties['maze'];
  protected random: () => number;

  public constructor({ maze, speed = 1, random = Math.random }: MazeSolverProperties) {
    super();
    this.maze = maze;
    this.speed = speed;
    this.random = random;
  }

  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  protected randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }

  protected addTrash(controller: Trash): void {
    this.trash.add(controller);
  }

  protected removeTrash(controller: Trash): void {
    this.trash.delete(controller);
  }

  public dispose(): void {
    for (const trash of this.trash) {
      trash.abort();
    }
    this.trash.clear();
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }

  public abstract solve(args?: SolveArguments): AsyncIterator<void>;
}
