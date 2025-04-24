import { animate } from '../drawing/animate.ts';
import { type MazeGenerator } from '../generator/index.ts';
import { type Maze } from '../maze/index.ts';
import { type MazeSolver } from '../solver/index.ts';

type Phase = 'maze' | 'generate' | 'braid' | 'solve' | 'done';
type PlayMode = 'play' | 'step' | 'fast' | 'instant';

export class Runner {
  private readonly maze: Maze | undefined = undefined;
  private readonly generator: MazeGenerator | undefined = undefined;
  private readonly solver: MazeSolver | undefined = undefined;

  private stepper: Iterator<void> | undefined = undefined;
  private speed = 1;

  private phase: Phase = 'maze';
  private playMode: PlayMode = 'fast';

  public constructor() {
    //
  }

  private async run(): Promise<void> {
    if (this.maze && this.generator && this.solver) {
      while (true) {
        switch (this.phase) {
          case 'maze': {
            this.maze.draw();
            this.phase = 'generate';
            // setPlayMode('fast'); // TODO
            this.stepper = this.generator.generate();
            this.speed = this.generator.speed;
            break;
          }

          case 'generate':
          case 'solve': {
            while (
              await animate(() => {
                for (let i = 0; i < this.speed; ++i) {
                  if (this.stepper!.next().done) {
                    return false;
                  }
                }
                return true;
              })
            ) {
              //
            }

            if (this.phase === 'generate') {
              this.maze.addTermini();
              this.maze.draw();
              this.phase = 'braid';
            } else {
              this.maze.drawSolution();
              this.phase = 'done';
            }
            break;
          }

          case 'braid': {
            // maze.braid();
            this.phase = 'solve';
            this.playMode = 'fast'; // TODO
            this.stepper = this.solver.solve();
            break;
          }

          case 'done': {
            this.maze.drawSolution();

            setTimeout(() => {
              //setMazeNumber((n) => n + 1); // TODO
            }, 10000);
            break;
          }

          // no default
        }
      }
    }
  }
}
