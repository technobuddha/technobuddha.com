import { randomPick, randomShuffle } from '@technobuddha/library';

import { type CellDirection, type Maze } from '../maze/maze.ts';

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

export abstract class MazeSolver {
  public readonly speed: number;

  protected maze: MazeSolverProperties['maze'];
  protected random: () => number;

  public constructor({ maze, speed = 1, random = Math.random }: MazeSolverProperties) {
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

  public abstract solve(args?: SolveArguments): Iterator<void>;
}
