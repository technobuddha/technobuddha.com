import { randomPick, randomShuffle } from '@technobuddha/library';

import { type Drawing } from '../drawing/drawing.ts';
import { type CellDirection, type Maze } from '../maze/maze.ts';

export type MazeSolverProperties = {
  maze: Maze;
  drawing: Drawing;
  solutionColor?: string;
  speed?: number;
  random?(this: void): number;
};

export type SolveArguments = {
  color?: string;
  solutionColor?: string;
  entrance?: CellDirection;
  exit?: CellDirection;
};

export abstract class MazeSolver {
  public readonly speed: number;
  public readonly solutionColor: string;

  protected maze: MazeSolverProperties['maze'];
  protected drawing: MazeSolverProperties['drawing'];
  protected random: () => number;

  public constructor({
    maze,
    solutionColor = '#00FF00',
    drawing,
    speed = 1,
    random = Math.random,
  }: MazeSolverProperties) {
    this.maze = maze;
    this.solutionColor = solutionColor;
    this.drawing = drawing;
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
