import { type Cell, type CellDirection, type Maze } from '../maze/maze.js';
import { animate } from '../util/animate.js';
import { type CSpecification } from '../util/specs.js';
import { parsePoint } from '../util/specs.js';

export type MazeGeneratorProperties = {
  maze: Maze;
  start?: CSpecification;
  random?(this: void): number;
  selectNeighbor?(this: void, neighbors: CellDirection[], random: () => number): CellDirection;
};

export abstract class MazeGenerator {
  public maze: MazeGeneratorProperties['maze'];
  public random: Exclude<MazeGeneratorProperties['random'], undefined>;
  public selectNeighbor: (neighbors: CellDirection[]) => CellDirection | undefined;
  public start: Cell;
  public currentCell: Cell;

  public constructor({ maze, start, random, selectNeighbor }: MazeGeneratorProperties) {
    this.maze = maze;
    this.start = parsePoint(start ?? 'random', this.maze.width, this.maze.height);
    this.currentCell = this.start;
    this.random = random ?? Math.random;
    this.selectNeighbor =
      selectNeighbor ?
        (neighbors: CellDirection[]) => selectNeighbor(neighbors, this.random)
      : (neighbors: CellDirection[]) => neighbors[Math.floor(neighbors.length * this.random())];
  }

  public async generate(): Promise<Maze> {
    const { maze } = this;

    maze.draw();
    let building = true;
    while (building) {
      building = await animate(() => {
        let go = true;
        for (let i = 0; go && i < 1; ++i) {
          go = this.step();
        }
        return go;
      });
    }

    return maze;
  }

  protected abstract step(): boolean;
}
