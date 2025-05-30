import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export type Method = 'newest' | 'oldest' | 'middle' | 'random';

type GrowingTreeProperties = MazeGeneratorProperties & {
  method?: Method | Record<Method, number>;
};

export class GrowingTree extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly list: Cell[];
  private readonly method: Method | Record<Method, number>;

  public constructor({ method = 'random', ...props }: GrowingTreeProperties) {
    super(props);

    this.method = method;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.list = [this.start];
    this.visited[this.start.x][this.start.y] = true;
  }

  private selectMethod(): Method {
    if (typeof this.method === 'string') {
      return this.method;
    }

    const total = Object.values(this.method).reduce((a, b) => a + b, 0);
    let rand = this.random() * total;
    for (const key of Object.keys(this.method) as Method[]) {
      rand -= this.method[key];
      if (rand <= 0) {
        return key;
      }
    }

    return 'random';
  }

  public selectCell(selectionMethod: Method): number {
    switch (selectionMethod) {
      case 'newest': {
        return this.list.length - 1;
      }
      case 'oldest': {
        return 0;
      }
      case 'middle': {
        return Math.floor(this.list.length / 2);
      }
      case 'random':
      default: {
        return Math.floor(this.random() * this.list.length);
      }
    }
  }

  public *generate(): Generator<void> {
    while (this.list.length > 0) {
      const index = this.selectCell(this.selectMethod());
      this.currentCell = this.list[index];

      const next = this.randomPick(
        this.maze.moves(this.currentCell).filter(({ move }) => !this.visited[move.x][move.y]),
      );

      if (next) {
        yield this.maze.removeWall(this.currentCell, next.direction);
        this.visited[next.move.x][next.move.y] = true;

        this.list.push(next.move);
      } else {
        this.list.splice(index, 1);
      }
    }
  }
}
