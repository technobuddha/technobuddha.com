import { create2DArray } from '@technobuddha/library';

import { type CellDirection, type Direction } from '../../maze/maze.js';

import { type MazeGeneratorProperties } from '../maze-generator.js';
import { MazeGenerator } from '../maze-generator.js';

export class TruePrims extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly activePassages: CellDirection[];
  private readonly costs: Record<Direction, number>[][];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = this.start;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.visited[this.currentCell.x][this.currentCell.y] = true;

    this.costs = create2DArray<Record<Direction, number>>(
      this.maze.width,
      this.maze.height,
      (x, y) =>
        Object.fromEntries(
          Object.entries(this.maze.walls[x][y]).map(([direction]) => [direction, this.random()]),
        ),
    );

    this.activePassages = this.maze
      .neighbors(this.currentCell)
      .map((n) => ({ ...n, x: this.currentCell.x, y: this.currentCell.y }));
  }

  public override step(): boolean {
    outer: for (let i = 0; i < 3; ++i) {
      for (;;) {
        let passageIndex = -1;
        let minCost = Infinity;

        for (const [index, passage] of this.activePassages.entries()) {
          const cost = this.costs[passage.x][passage.y][passage.direction];
          if (cost < minCost) {
            minCost = cost;
            passageIndex = index;
          }
        }

        if (minCost === Infinity) {
          break outer;
        }

        const passage = this.activePassages[passageIndex];
        this.activePassages.splice(passageIndex, 1);

        const cell = this.maze.move(passage, passage.direction);

        if (cell && this.maze.inMaze(cell) && !this.visited[cell.x][cell.y]) {
          this.maze.removeWall(passage, passage.direction);
          this.visited[cell.x][cell.y] = true;

          this.activePassages.push(
            ...this.maze
              .neighbors(cell)
              .filter((n) => !this.visited[n.x][n.y])
              .map((n) => ({ ...n, x: cell.x, y: cell.y })),
          );

          break;
        }
      }
    }

    return this.activePassages.length > 0;
  }
}
