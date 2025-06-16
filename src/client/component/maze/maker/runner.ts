import { animate } from '../drawing/animate.ts';
import { type Drawing } from '../drawing/drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/index.ts';
import { type Maze, type MazeProperties } from '../geometry/index.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/index.ts';

export type Phase = 'maze' | 'generate' | 'braid' | 'solve' | 'done';
export type PlayMode = 'pause' | 'step' | 'play' | 'fast' | 'instant' | 'refresh';

type MazeMaker = (props: MazeProperties) => Maze;
type GeneratorMaker = (props: MazeGeneratorProperties) => MazeGenerator;
type SolverMaker = (props: MazeSolverProperties) => MazeSolver;
type Plugin = (this: void, maze: Maze) => void;

type RunnerProperties = {
  mazeMaker: MazeMaker;
  generatorMaker: GeneratorMaker;
  solverMaker: SolverMaker;
  plugin?: Plugin;
  drawing?: Drawing;
  showCoordinates?: boolean;
  onModeChange?: (this: void, mode: PlayMode) => void;

  mode?: { [P in Phase]?: PlayMode };
};

export class Runner extends EventTarget {
  public readonly maze: Maze;
  public readonly generator: MazeGenerator;
  public readonly solver: MazeSolver;
  public mode: PlayMode = 'pause';

  private stepper: AsyncIterator<void> | undefined = undefined;
  private baseSpeed = 1;
  private speed = 1;
  private readonly onModeChange: ((this: void, mode: PlayMode) => void) | undefined;

  private phase: Phase = 'maze';
  private playing = true;
  private aborted = false;
  private delay = 0;
  public phasePlayMode: Record<Phase, PlayMode>;

  public constructor({
    mazeMaker,
    generatorMaker,
    solverMaker,
    drawing,
    plugin,
    showCoordinates = false,
    onModeChange,
    mode,
  }: RunnerProperties) {
    super();
    this.maze = mazeMaker({ drawing, plugin, showCoordinates });
    this.maze.reset();
    this.generator = generatorMaker({ maze: this.maze });
    this.solver = solverMaker({ maze: this.maze });
    this.onModeChange = onModeChange;

    this.phasePlayMode = {
      maze: 'play',
      generate: 'fast',
      braid: 'fast',
      solve: 'fast',
      done: 'refresh',
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
    this.onModeChange?.(playMode);
    this.mode = playMode;

    switch (playMode) {
      case 'pause': {
        this.playing = false;
        break;
      }

      case 'step': {
        this.playing = false;
        this.setPlayMode('pause');
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

      case 'refresh': {
        this.playing = true;
        this.speed = this.baseSpeed;
        this.delay = 0;
        break;
      }

      // no default
    }
  }

  private switchPhase(phase: Phase): void {
    if (!this.aborted) {
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
  }

  private async run(): Promise<boolean> {
    if (!this.aborted) {
      if (this.stepper) {
        while (true) {
          const done = await animate(async () => {
            for (let i = 0; i < this.speed; ++i) {
              if ((await this.stepper!.next()).done) {
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
    if (!this.aborted) {
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
                this.maze.detectErrors();
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
              throw new Error('Aborted');
            }
            await this.waitForCommand();
          }
        }
      }
    }
  }

  public abort(): void {
    this.playing = false;
    this.aborted = true;

    this.solver?.dispose();
  }
}
