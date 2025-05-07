import { animate } from '../drawing/animate.ts';
import { type MazeGenerator } from '../generator/index.ts';
import { type Maze } from '../geometry/index.ts';
import { type MazeSolver } from '../solver/index.ts';

export type Phase = 'maze' | 'generate' | 'braid' | 'solve' | 'done';
export type PlayMode = 'pause' | 'step' | 'play' | 'fast' | 'instant';

type RunnerProperties = {
  maze: Maze;
  generator: MazeGenerator;
  solver: MazeSolver;
  mode?: { [P in Phase]?: PlayMode };
};

export class Runner extends EventTarget {
  public maze: Maze | undefined = undefined;
  public generator: MazeGenerator | undefined = undefined;
  public solver: MazeSolver | undefined = undefined;

  private stepper: Iterator<void> | undefined = undefined;
  private baseSpeed = 1;
  private speed = 1;

  private phase: Phase = 'maze';
  private playing = true;
  private aborted = false;
  private delay = 0;
  public phasePlayMode: Record<Phase, PlayMode>;

  public constructor({ maze, generator, solver, mode }: RunnerProperties) {
    super();
    this.maze = maze;
    this.generator = generator;
    this.solver = solver;

    this.phasePlayMode = {
      maze: 'play',
      generate: 'fast',
      braid: 'fast',
      solve: 'fast',
      done: 'play',
      ...mode,
    };
  }

  public setMode(playMode: PlayMode): void {
    this.setPlayMode(playMode);

    if (playMode !== 'pause') {
      const event = new CustomEvent('command', {});
      this.dispatchEvent(event);
    }
  }

  private setPlayMode(playMode: PlayMode): void {
    switch (playMode) {
      case 'pause': {
        this.playing = false;
        break;
      }

      case 'step': {
        this.playing = false;
        break;
      }

      case 'play': {
        this.playing = true;
        this.speed = 1;
        this.delay = 50;
        break;
      }

      case 'fast': {
        this.playing = true;
        this.speed = this.baseSpeed;
        this.delay = 0;
        break;
      }

      case 'instant': {
        this.playing = true;
        this.speed = Infinity;
        this.delay = 0;
        break;
      }

      // no default
    }
  }

  private switchPhase(phase: Phase): void {
    if (this.maze && this.generator && this.solver) {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (phase) {
        case 'generate': {
          this.stepper = this.generator.run();
          this.baseSpeed = this.generator.speed;
          break;
        }

        case 'braid': {
          this.stepper = undefined;
          break;
        }

        case 'solve': {
          this.stepper = this.solver.solve();
          this.baseSpeed = this.solver.speed;
          break;
        }

        // no default
      }

      this.phase = phase;
      this.setPlayMode(this.phasePlayMode[phase]);
    }
  }

  private async run(): Promise<boolean> {
    if (this.stepper) {
      while (true) {
        const done = await animate(() => {
          for (let i = 0; i < this.speed; ++i) {
            if (this.stepper!.next().done) {
              return true;
            }
            if (!this.playing) {
              return false;
            }
          }
          return false;
        });

        if (done || !this.playing) {
          return done;
        }

        if (this.delay > 0) {
          await new Promise((resolve) => void setTimeout(resolve, this.delay));
        }
      }
    }

    return true;
  }

  private async waitForCommand(): Promise<void> {
    return new Promise((resolve) => {
      const handler = (): void => {
        this.removeEventListener('command', handler);
        resolve();
      };
      this.addEventListener('command', handler);
    });
  }

  public async execute(): Promise<void> {
    if (this.maze && this.generator && this.solver) {
      while (true) {
        switch (this.phase) {
          case 'maze': {
            this.maze.draw();
            this.switchPhase('generate');
            break;
          }

          case 'generate': {
            const done = await this.run();

            if (done) {
              this.maze.addTermini();
              this.maze.draw();
              this.switchPhase('braid');
            }
            break;
          }

          case 'braid': {
            // maze.braid();
            this.switchPhase('solve');
            break;
          }

          case 'solve': {
            const done = await this.run();

            if (done) {
              this.switchPhase('done');
            }
            break;
          }

          case 'done': {
            this.maze.drawSolution();
            return;
          }

          // no default
        }

        if (!this.playing) {
          if (this.aborted) {
            return;
          }
          await this.waitForCommand();
        }
      }
    }
  }

  public abort(): void {
    this.playing = false;
    this.aborted = true;
  }
}
