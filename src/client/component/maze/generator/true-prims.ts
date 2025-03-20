import type { CellDirection, Direction } from '../maze/maze';
import { MazeGenerator } from './maze-generator';
import type { MazeGeneratorProperties } from './maze-generator';
import create2DArray from '@technobuddha/library/create2DArray';

export class TruePrims extends MazeGenerator {
  private readonly visited: boolean[][];
  private readonly activePassages: CellDirection[];
  private readonly costs: Record<Direction, number>[][];

  constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = this.start;
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.visited[this.currentCell.x][this.currentCell.y] = true;

    this.costs = create2DArray(
      this.maze.width,
      this.maze.height,
      () =>
        Object.fromEntries(this.maze.directions.map((direction) => [direction, 0])) as Record<
          Direction,
          number
        >,
    );

    this.activePassages = this.maze.directions.map((direction) => ({
      ...this.currentCell,
      direction,
    }));

    for (let x = 0; x < this.maze.width; ++x) {
      for (let y = 0; y < this.maze.height; ++y) {
        for (let direction of this.maze.directions) {
          const cell = this.maze.move({ x, y }, direction);
          if (cell) {
            const isBorderWall = !this.maze.inMaze(cell);
            let passageCost = isBorderWall ? Infinity : this.random();

            if ((direction === 'N' || direction === 'W') && !isBorderWall)
              passageCost = this.costs[cell.x][cell.y][this.maze.opposite(direction)];

            this.costs[x][y][direction] = passageCost;
          }
        }
      }
    }
  }

  public override step(): boolean {
    let minCost = Infinity;
    let passageIndex = 0;

    for (const [index, passage] of this.activePassages.entries()) {
      if (this.costs[passage.x][passage.y][passage.direction] < minCost) {
        minCost = this.costs[passage.x][passage.y][passage.direction];
        passageIndex = index;
      }
    }

    const passage = this.activePassages[passageIndex];
    const cell = this.maze.move(passage, passage.direction);

    if (cell && this.maze.inMaze(cell) && !this.visited[cell.x][cell.y]) {
      this.maze.removeWall(passage, passage.direction);
      this.visited[cell.x][cell.y] = true;

      for (const direction of this.maze.directions) {
        if (direction !== this.maze.opposite(passage.direction))
          this.activePassages.push({ ...cell, direction });
      }
    } else {
      this.activePassages.splice(passageIndex, 1);
    }

    return this.activePassages.length > 0 && minCost !== Infinity;
  }
}
