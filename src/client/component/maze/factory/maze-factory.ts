import { type Drawing } from '../drawing/drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/maze-generator.ts';
import { type Maze, type MazeProperties } from '../maze/maze.ts';
import { MazeRunner } from '../runner/maze-runner.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/maze-solver.ts';

export type MazeSettings = Partial<MazeProperties> &
  Partial<MazeGeneratorProperties> &
  Partial<MazeSolverProperties>;

export class MazeFactory {
  public drawing: Drawing | undefined;
  public width: MazeSettings['width'];
  public height: MazeSettings['height'];
  public cellSize: MazeSettings['cellSize'];
  public cellColor: MazeSettings['cellColor'];
  public wallSize: MazeSettings['wallSize'];
  public wallColor: MazeSettings['wallColor'];
  public entrance: MazeSettings['entrance'];
  public exit: MazeSettings['exit'];
  public start: MazeSettings['start'];
  public random: MazeSettings['random'];
  public maskColor: MazeSettings['maskColor'];
  public solutionColor: MazeSettings['solutionColor'];

  public constructor({
    drawing,
    random = Math.random,
    width,
    height,
    cellSize,
    cellColor,
    wallSize,
    wallColor,
    entrance,
    exit,
    start, // = 'random',
    maskColor,
    solutionColor,
  }: MazeSettings = {}) {
    this.drawing = drawing;
    this.random = random;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cellColor = cellColor;
    this.wallSize = wallSize;
    this.wallColor = wallColor;
    this.entrance = entrance;
    this.exit = exit;
    this.start = start;
    this.maskColor = maskColor;
    this.solutionColor = solutionColor;
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
      cellColor: this.cellColor,
      wallSize: this.wallSize,
      wallColor: this.wallColor,
      entrance: this.entrance,
      exit: this.exit,
      maskColor: this.maskColor,
      plugin,
    });

    const generator = generatorMaker?.({ maze, start: this.start, random: this.random });
    const solver = solverMaker?.({
      maze,
      solutionColor: this.solutionColor,
      drawing: this.drawing!,
      random: this.random,
    });

    return new MazeRunner(maze, generator, solver);
  }
}
