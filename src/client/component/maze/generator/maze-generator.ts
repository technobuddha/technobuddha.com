import { randomPick, randomShuffle } from '@technobuddha/library';
import { groupBy, uniq } from 'lodash-es';

import { type Cell, type CellDirection, type Maze } from '../geometry/maze.ts';

export type MazeGeneratorProperties = {
  maze: Maze;
  start?: Cell;
  speed?: number;
  random?(this: void): number;
};

export abstract class MazeGenerator {
  public maze: MazeGeneratorProperties['maze'];
  public random: Exclude<MazeGeneratorProperties['random'], undefined>;
  public readonly speed: number;
  public start: Cell;
  public currentCell: Cell;

  public constructor({ maze, start, speed = 5, random }: MazeGeneratorProperties) {
    this.maze = maze;
    this.start = start ?? this.maze.randomCell();
    this.currentCell = this.start;
    this.speed = speed;
    this.random = random ?? Math.random;
  }

  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  protected randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }

  public *run(): Generator<void> {
    this.maze.hookPreGeneration?.(this);
    yield* this.generate();
    this.maze.hookPostGeneration?.(this);
  }

  public abstract generate(): Generator<void>;
}
