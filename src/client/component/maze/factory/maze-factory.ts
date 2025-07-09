import { type Drawing } from '../drawing/index.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/index.ts';
import { type Maze, type MazeProperties } from '../geometry/index.ts';
import { MazeRunner } from '../runner/index.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/index.ts';

export type MazeSettings = Partial<MazeProperties> &
  Partial<MazeGeneratorProperties> &
  Partial<MazeSolverProperties>;

export class MazeFactory {
  public drawing: Drawing | undefined;
  public width: MazeSettings['width'];
  public height: MazeSettings['height'];
  public cellSize: MazeSettings['cellSize'];
  public color: MazeSettings['color'];
  public wallSize: MazeSettings['wallSize'];
  public voidSize: MazeSettings['voidSize'];
  public entrance: MazeSettings['entrance'];
  public exit: MazeSettings['exit'];
  public start: MazeSettings['start'];
  public random: MazeSettings['random'];

  public constructor({
    drawing,
    random = Math.random,
    width,
    height,
    cellSize,
    color,
    wallSize,
    voidSize,
    entrance,
    exit,
    start, // = 'random',
  }: MazeSettings = {}) {
    this.drawing = drawing;
    this.random = random;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.color = color;
    this.wallSize = wallSize;
    this.voidSize = voidSize;
    this.entrance = entrance;
    this.exit = exit;
    this.start = start;
  }

  public create(
    mazeMaker: (props: MazeSettings) => Maze,
    generatorMaker?: (props: MazeGeneratorProperties) => MazeGenerator,
    plugin?: (maze: Maze) => void,
    solverMaker?: (props: MazeSolverProperties) => MazeSolver,
  ): MazeRunner {
    const maze = mazeMaker({
      drawing: this.drawing,
      width: this.width,
      height: this.height,
      cellSize: this.cellSize,
      color: this.color,
      wallSize: this.wallSize,
      voidSize: this.voidSize,
      entrance: this.entrance,
      exit: this.exit,
      plugin,
    });
    maze.reset(); // TODO [2025-07-15]: Reset should not be needed here, but generator is accessing uninitialized things

    const generator = generatorMaker?.({ maze, start: this.start, random: this.random });
    const solver = solverMaker?.({
      maze,
      random: this.random,
    });

    return new MazeRunner(maze, generator, solver);
  }
}
