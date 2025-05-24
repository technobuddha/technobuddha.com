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

  protected buildBridge(
    current: CellDirection,
    bridge: CellDirection[],
    next: CellDirection,
  ): CellDirection {
    let prev = current;

    const xBridge = [current, ...bridge, next];
    const bridgeDirections = uniq(bridge.flatMap((c) => [c.direction, this.maze.opposite(c)]));

    const tunnels = groupBy(
      bridge.flatMap((b) =>
        this.maze
          .adjacent(b)
          .filter(
            (c) =>
              !(
                bridgeDirections.includes(c.direction) ||
                xBridge.some((x) => this.maze.isSame(x, c))
              ),
          ),
      ),
      (cell) => cell.direction,
    );

    let keys = Object.keys(tunnels);
    while (keys.length > 0) {
      const [key1] = keys;
      const key2 = this.maze.inverse(tunnels[key1][0]);

      if (tunnels[key1]?.length !== tunnels[key2]?.length) {
        // eslint-disable-next-line no-console
        console.warn(`Tunnel length mismatch for ${key1} and ${key2}`, tunnels);
      }

      if (key2 in tunnels) {
        for (let i = 0; i < tunnels[key1].length; i++) {
          const t1 = tunnels[key1][i];
          const t2 = tunnels[key2][i];

          if (t2) {
            const b1 = this.maze.shift(t1, this.maze.opposite(t1))!;
            const b2 = this.maze.shift(t2, this.maze.opposite(t2))!;

            this.maze.nexus(b1).portals[this.maze.opposite({ ...b1, direction: key1 })] = t2;
            this.maze.nexus(b2).portals[this.maze.opposite({ ...b2, direction: key2 })] = t1;
          }
        }
        delete tunnels[key2];
      }
      delete tunnels[key1];
      keys = Object.keys(tunnels);
    }

    for (const span of bridge) {
      this.maze.nexus(span).bridge = true;
      this.maze.removeWall(prev, span.direction);
      prev = span;
    }

    return prev;
  }
}
