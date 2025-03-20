import { parsePoint } from '../util/specs.js';
import type { Maze, Cell, CellDirection } from '../maze/maze';
import type { CSpecification } from '../util/specs.js';

export type MazeGeneratorProperties = {
  maze: Maze;
  start?: CSpecification;
  random?: () => number;
  selectNeighbor?: (neighbors: CellDirection[], random: () => number) => CellDirection;
};

export class MazeGenerator {
  public maze: MazeGeneratorProperties['maze'];
  public random: Exclude<MazeGeneratorProperties['random'], undefined>;
  public selectNeighbor: (neighbors: CellDirection[]) => CellDirection;
  public start: Cell;
  public currentCell: Cell;

  constructor({ maze, start, random, selectNeighbor }: MazeGeneratorProperties) {
    this.maze = maze;
    this.start = parsePoint(start ?? 'random', this.maze.width, this.maze.height);
    this.currentCell = this.start;
    this.random = random ?? Math.random;
    this.selectNeighbor =
      selectNeighbor ?
        (neighbors: CellDirection[]) => selectNeighbor(neighbors, this.random)
      : (neighbors: CellDirection[]) => neighbors[Math.floor(neighbors.length * this.random())];
  }

  public async generate(speed: number): Promise<Maze> {
    return new Promise((resolve) => {
      const { maze } = this;

      maze.draw();
      if (speed) {
        const go = () => {
          let building = true;
          for (let i = 0; i < speed; ++i) {
            if (building) building = this.step();
          }

          if (building) requestAnimationFrame(go);
          else resolve(maze);
        };
        go();
      } else {
        while (this.step());
        resolve(maze);
      }
    });
  }

  protected step(): boolean {
    return false;
  }
}
