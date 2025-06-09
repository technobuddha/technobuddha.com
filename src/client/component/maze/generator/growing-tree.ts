import { type Cell } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export type Method = 'newest' | 'oldest' | 'middle' | 'random';

type GrowingTreeProperties = MazeGeneratorProperties & {
  method?: Method | Record<Method, number>;
};

export class GrowingTree extends MazeGenerator {
  private readonly list: Cell[];
  private readonly method: Method | Record<Method, number>;

  public constructor({ method = 'random', ...props }: GrowingTreeProperties) {
    super(props);

    this.method = method;
    this.list = [this.start];

    this.player = 0;
    this.createPlayer({ start: this.start });
    this.visit(this.start);
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
      const currentCell = this.list[index];

      const next = this.randomPick(
        this.maze.moves(currentCell).filter(({ move }) => !this.isVisited(move)),
      );

      if (next) {
        yield this.maze.removeWall(currentCell, next.direction);
        this.visit(next.move);
        this.list.push(next.move);
      } else {
        this.list.splice(index, 1);
      }
    }
  }
}
