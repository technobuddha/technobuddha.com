import { randomPick, randomShuffle } from '@technobuddha/library';

import { type Cell, type Maze } from '../maze/maze.js';
import { animate } from '../util/animate.js';
import { type CSpecification } from '../util/specs.js';
import { parsePoint } from '../util/specs.js';

export type MazeGeneratorProperties = {
  maze: Maze;
  start?: CSpecification;
  random?(this: void): number;
};

export abstract class MazeGenerator {
  public maze: MazeGeneratorProperties['maze'];
  public random: Exclude<MazeGeneratorProperties['random'], undefined>;
  public start: Cell;
  public currentCell: Cell;

  public constructor({ maze, start, random }: MazeGeneratorProperties) {
    this.maze = maze;
    this.start = parsePoint(start ?? 'random', this.maze.width, this.maze.height);
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
