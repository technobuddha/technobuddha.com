import { create2DArray, randomPick, randomShuffle } from '@technobuddha/library';

import { type Cell } from '../maze/maze.js';

import { type MazeGeneratorProperties } from './maze-generator.js';
import { MazeGenerator } from './maze-generator.js';

type HuntMethod = 'random' | 'rows' | 'columns' | 'reverse-rows' | 'reverse-columns';

type HuntAndKillProperties = MazeGeneratorProperties & {
  huntMethod?: HuntMethod;
};

export class HuntAndKill extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly huntMethod: HuntMethod;

  public constructor({ huntMethod = 'rows', ...props }: HuntAndKillProperties) {
    super(props);

    this.huntMethod = huntMethod;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.currentCell = {
      x: Math.floor(this.random() * this.maze.width),
      y: Math.floor(this.random() * this.maze.height),
    };
  }

  public selectHunted(cells: Cell[]): Cell[] {
    switch (this.huntMethod) {
      case 'rows': {
        return cells.sort((a, b) => a.y - b.y || a.x - b.x);
      }
      case 'columns': {
        return cells.sort((a, b) => a.x - b.x || a.y - b.y);
      }
      case 'reverse-rows': {
        return cells.sort((a, b) => a.y - b.y || b.x - a.x);
      }
      case 'reverse-columns': {
        return cells.sort((a, b) => b.x - a.x || a.y - b.y);
      }
      case 'random': {
        return randomShuffle(cells, this.random);
      }
      // no default
    }
  }

  public override step(): boolean {
    // kill
    this.visited[this.currentCell.x][this.currentCell.y] = true;

    const next = randomPick(
      this.maze.neighbors(this.currentCell).filter((m) => !this.visited[m.x][m.y]),
      this.random,
    );
    if (next) {
      this.maze.removeWall(this.currentCell, next.direction);
      this.currentCell = next;
      return true;
    }

    // hunt
    for (const target of this.selectHunted(
      this.maze.all().filter((c) => !this.visited[c.x][c.y]),
    )) {
      const hunted = randomPick(
        this.maze.neighbors(target).filter((n) => this.visited[n.x][n.y]),
        this.random,
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
