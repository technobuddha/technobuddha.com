import { animate } from '../drawing/animate.ts';
import { type MazeGenerator } from '../generator/index.ts';
import { type Maze } from '../geometry/index.ts';
import { type MazeSolver } from '../solver/index.ts';

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

    this.maze.reset();
    this.maze.draw();

    if (!this.aborted && this.generator) {
      const step = this.generator.run();

      while (
        await animate(async () => {
          for (let i = 0; i < this.generator!.speed; ++i) {
            if ((await step.next()).done) {
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
        await animate(async () => {
          for (let i = 0; i < this.solver!.speed; ++i) {
            if ((await step.next()).done) {
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

      this.maze.drawSolution();
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
