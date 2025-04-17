import { animate } from '../drawing/animate.ts';
import { type MazeGenerator } from '../generator/maze-generator.ts';
import { type Maze } from '../maze/maze.ts';
import { type MazeSolver } from '../solver/maze-solver.ts';

export class MazeRunner {
  private controller: AbortController | undefined = undefined;
  private aborted = false;
  public readonly maze: Maze;
  public readonly generator: MazeGenerator | undefined;
  public readonly solver: MazeSolver | undefined;

  public constructor(maze: Maze, generator?: MazeGenerator, solver?: MazeSolver) {
    this.maze = maze;
    this.generator = generator;
    this.solver = solver;
  }

  public async run(): Promise<Maze> {
    this.aborted = false;
    this.controller = new AbortController();
    this.controller.signal.addEventListener('abort', () => {
      this.aborted = true;
    });

    this.maze.draw();

    if (!this.aborted && this.generator) {
      const step = this.generator.generate();

      while (
        await animate(() => {
          for (let i = 0; i < this.generator!.speed; ++i) {
            if (step.next().done) {
              return false;
            }
          }
          return true;
        })
      ) {
        if (this.aborted) {
          break;
        }
        //
      }

      this.maze.addTermini();
      this.maze.draw();
    }

    if (!this.aborted && this.solver) {
      const step = this.solver.solve();

      while (
        await animate(() => {
          for (let i = 0; i < this.solver!.speed; ++i) {
            if (step.next().done) {
              return false;
            }
          }
          return true;
        })
      ) {
        if (this.aborted) {
          break;
        }
      }
    }

    if (this.aborted) {
      this.maze.clear();
      throw new Error('Aborted');
    }

    return this.maze;
  }

  public abort(): void {
    this.controller?.abort();
  }
}
