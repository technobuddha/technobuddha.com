import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../maze/maze.js';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.js';

type HuntMethod =
  | 'random'
  | 'top-left'
  | 'left-top'
  | 'top-right'
  | 'right-top'
  | 'bottom-left'
  | 'left-bottom'
  | 'bottom-right'
  | 'right-bottom';

type HuntAndKillProperties = MazeGeneratorProperties & {
  huntMethod?: HuntMethod;
};

export class HuntAndKill extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly huntMethod: HuntMethod;

  public constructor({ huntMethod = 'top-left', ...props }: HuntAndKillProperties) {
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
      case 'top-left': {
        return cells.sort((a, b) => a.y - b.y || a.x - b.x);
      }
      case 'left-top': {
        return cells.sort((a, b) => a.x - b.x || a.y - b.y);
      }
      case 'top-right': {
        return cells.sort((a, b) => a.y - b.y || b.x - a.x);
      }
      case 'right-top': {
        return cells.sort((a, b) => b.x - a.x || a.y - b.y);
      }
      case 'bottom-left': {
        return cells.sort((a, b) => b.y - a.y || a.x - b.x);
      }
      case 'left-bottom': {
        return cells.sort((a, b) => a.x - b.x || b.y - a.y);
      }
      case 'bottom-right': {
        return cells.sort((a, b) => b.y - a.y || b.x - a.x);
      }
      case 'right-bottom': {
        return cells.sort((a, b) => b.x - a.x || b.y - a.y);
      }
      case 'random':
      default: {
        return this.randomShuffle(cells);
      }
    }
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
    for (const target of this.selectHunted(
      this.maze.all().filter((c) => !this.visited[c.x][c.y]),
    )) {
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
