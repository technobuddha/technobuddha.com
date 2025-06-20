import { randomPick, randomShuffle } from '@technobuddha/library';

import { type CellDirection, type Maze } from '../geometry/maze.ts';

type Trash = AbortController;

export type MazeSolverProperties = {
  readonly maze: Maze;
  readonly speed?: number;
  readonly random?: (this: void) => number;
};

export type SolveArguments = {
  readonly color?: string;
  readonly entrance?: CellDirection;
  readonly exit?: CellDirection;
};

export abstract class MazeSolver extends EventTarget implements Disposable {
  public readonly speed: NonNullable<MazeSolverProperties['speed']>;
  protected readonly maze: MazeSolverProperties['maze'];
  protected readonly random: NonNullable<MazeSolverProperties['random']>;
  protected readonly trash = new Set<Trash>();

  public constructor({ maze, speed = 1, random = Math.random }: MazeSolverProperties) {
    super();
    this.maze = maze;
    this.speed = speed;
    this.random = random;
  }

  //#region Random
  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  protected randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }
  //#endregion
  //#region Trash
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
  //#endregion

  public abstract solve(args?: SolveArguments): AsyncIterator<void>;
}
