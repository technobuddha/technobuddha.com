import { type Drawing } from '../drawing/drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/index.ts';
import { type Maze, type MazeProperties } from '../geometry/index.ts';
import { MazeRunner } from '../runner/maze-runner.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/index.ts';

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
  public gapSize: MazeSettings['gapSize'];
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
    gapSize,
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
    this.gapSize = gapSize;
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
      gapSize: this.gapSize,
      wallColor: this.wallColor,
      entrance: this.entrance,
      exit: this.exit,
      maskColor: this.maskColor,
      solutionColor: this.solutionColor,
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
