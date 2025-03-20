import { create2DArray } from '@technobuddha/library';

import { type AllOrder, type Cell } from '../maze/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

type HuntAndKillProperties = MazeGeneratorProperties & {
  huntMethod?: AllOrder;
};

export class HuntAndKill extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly huntMethod: AllOrder;

  public constructor({ huntMethod = 'top-left', ...props }: HuntAndKillProperties) {
    super(props);

    this.huntMethod = huntMethod;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.currentCell = {
      x: Math.floor(this.random() * this.maze.width),
      y: Math.floor(this.random() * this.maze.height),
    };
  }

  public override step(): boolean {
    // kill
    this.visited[this.currentCell.x][this.currentCell.y] = true;

    const next = this.randomPick(
      this.maze.neighbors(this.currentCell).filter((m) => !this.visited[m.x][m.y]),
    );
    if (next) {
      this.maze.removeWall(this.currentCell, next.direction);
      this.currentCell = next;
      return true;
    }

    // hunt
    for (const target of this.maze.all(this.huntMethod).filter((c) => !this.visited[c.x][c.y])) {
      const hunted = this.randomPick(
        this.maze.neighbors(target).filter((n) => this.visited[n.x][n.y]),
      );
      if (hunted) {
        this.maze.removeWall(target, hunted.direction);
        this.currentCell = target;
        return true;
      }
    }

    return false;
  }
}
