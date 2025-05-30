import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

export class Prims extends MazeGenerator {
  private readonly visited: boolean[][];
  public activeCells: Cell[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.activeCells = [this.start];
    this.visited[this.start.x][this.start.y] = true;
  }

  public override *generate(): Generator<void> {
    while (this.activeCells.length > 0) {
      const cellIndex = Math.floor(this.random() * this.activeCells.length);
      this.currentCell = this.activeCells[cellIndex];

      const next = this.randomPick(
        this.maze.moves(this.currentCell).filter(({ move }) => !this.visited[move.x][move.y]),
      );
      if (next) {
        this.maze.removeWall(this.currentCell, next.direction);
        yield;
        this.visited[next.move.x][next.move.y] = true;

        this.activeCells.push(next.move);
      } else {
        this.activeCells.splice(cellIndex, 1);
      }
    }
  }
}
