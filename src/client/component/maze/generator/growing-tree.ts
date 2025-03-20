import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../maze/maze.js';

import { type MazeGeneratorProperties } from './maze-generator.js';
import { MazeGenerator } from './maze-generator.js';

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
      case 'random': {
        return Math.floor(this.random() * this.list.length);
      }

      // no default
    }
  }

  public override step(): boolean {
    for (let i = 0; i < 10 && this.list.length > 0; ++i) {
      const index = this.selectCell(this.selectMethod());
      this.currentCell = this.list[index];

      const unvisitedNeighbors = this.maze
        .neighbors(this.currentCell)
        .filter((cell) => !this.visited[cell.x][cell.y]);
      if (unvisitedNeighbors.length > 0) {
        const cell = this.selectNeighbor(unvisitedNeighbors);
        this.maze.removeWall(this.currentCell, cell.direction);
        this.visited[cell.x][cell.y] = true;

        this.list.push(cell);
      } else {
        this.list.splice(index, 1);
      }
    }

    return this.list.length > 0;
  }
}
