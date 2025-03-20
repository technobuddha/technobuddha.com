import { randomPick, randomShuffle } from '@technobuddha/library';

import { type Drawing } from '../drawing/drawing.js';
import { type CellDirection, type Maze } from '../maze/maze.js';

export type MazeSolverProperties = {
  maze: Maze;
  drawing: Drawing;
  random?(this: void): number;
};

export type SolveArguments = {
  color?: string;
  solutionColor?: string;
  entrance?: CellDirection;
  exit?: CellDirection;
};

export abstract class MazeSolver {
  protected maze: MazeSolverProperties['maze'];
  protected drawing: MazeSolverProperties['drawing'];
  protected random: () => number;

  public constructor({ maze, drawing, random = Math.random }: MazeSolverProperties) {
    this.maze = maze;
    this.drawing = drawing;
    this.random = random;
  }

  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  protected randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }

  public abstract solve(args: SolveArguments): Promise<void>;
}
