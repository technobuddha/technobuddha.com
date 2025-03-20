import { randomPick, randomShuffle } from '@technobuddha/library';

import { animate } from '../drawing/animate.ts';
import { type Cell, type Maze } from '../maze/maze.ts';

export type MazeGeneratorProperties = {
  maze: Maze;
  start?: Cell;
  random?(this: void): number;
};

export abstract class MazeGenerator {
  public maze: MazeGeneratorProperties['maze'];
  public random: Exclude<MazeGeneratorProperties['random'], undefined>;
  public start: Cell;
  public currentCell: Cell;

  public constructor({ maze, start, random }: MazeGeneratorProperties) {
    this.maze = maze;
    this.start = start ?? this.maze.randomCell();
    this.currentCell = this.start;
    this.random = random ?? Math.random;
  }

  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  protected randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }

  public async generate(): Promise<Maze> {
    const { maze } = this;

    maze.draw();
    let building = true;
    while (building) {
      building = await animate(() => {
        let go = true;
        for (let i = 0; go && i < 1; ++i) {
          go = this.step();
        }
        return go;
      });
    }

    return maze;
  }

  protected abstract step(): boolean;
}
