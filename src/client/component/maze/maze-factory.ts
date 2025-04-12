import { animate } from './drawing/animate.ts';
import { type Drawing } from './drawing/drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from './generator/maze-generator.ts';
import { type Maze, type MazeProperties } from './maze/maze.ts';
import { type MazeSolver, type MazeSolverProperties } from './solver/maze-solver.ts';

export type MazeSettings = Partial<MazeProperties> & Partial<MazeGeneratorProperties>;

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
  }

  public async create(
    mazeMaker: (props: MazeSettings) => Maze,
    generator?: (props: MazeGeneratorProperties) => MazeGenerator,
    mask?: (maze: Maze) => void,
    solver?: (props: MazeSolverProperties) => MazeSolver,
  ): Promise<Maze> {
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
      plugin: mask,
    });

    maze.draw();

    if (generator) {
      const mazeGenerator = generator({
        maze,
        start: this.start,
        random: this.random,
      });
      const generated = mazeGenerator.generate();

      while (
        await animate(() => {
          for (let i = 0; i < mazeGenerator.speed; ++i) {
            if (generated.next().done) {
              return false;
            }
          }
          return true;
        })
      ) {
        //
      }
      maze.addTermini();
      maze.draw();
    }

    if (solver) {
      const mazeSolver = solver({ maze, drawing: this.drawing!, random: this.random });
      const solution = mazeSolver.solve({ solutionColor: '#00FF00' });

      while (
        await animate(() => {
          for (let i = 0; i < mazeSolver.speed; ++i) {
            if (solution.next().done) {
              return false;
            }
          }
          return true;
        })
      ) {
        //
      }
    }

    return maze;
  }
}
