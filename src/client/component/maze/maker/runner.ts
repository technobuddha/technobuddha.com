import { animate } from '../drawing/animate.ts';
import { type Drawing } from '../drawing/drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/index.ts';
import { type Maze, type MazeProperties } from '../geometry/index.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/index.ts';

import { type Phase } from './phase.ts';
import { type PlayMode } from './play-mode.ts';

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

  mode?: { [P in Phase]?: PlayMode };
};

let id = 0;

export class Runner extends EventTarget {
  public readonly maze: Maze;
  public readonly generator: MazeGenerator;
  public readonly solver: MazeSolver;
  public mode: PlayMode = 'pause';
  public phase: Phase = 'maze';
  public readonly id: number;
  public phasePlayMode: Record<Phase, PlayMode>;

  private stepper: AsyncGenerator<void> | undefined = undefined;
  private baseSpeed = 1;
  private speed = 1;
  private playing = true;
  private aborted = false;
  private delay = 0;
  private observationTimer: ReturnType<typeof setTimeout> | undefined = undefined;

  public constructor({
    mazeMaker,
    generatorMaker,
    solverMaker,
    drawing,
    plugin,
    showCoordinates = false,
    mode,
  }: RunnerProperties) {
    super();

    this.id = id++;

    this.maze = mazeMaker({ drawing, plugin, showCoordinates });
    this.maze.reset();
    this.generator = generatorMaker({ maze: this.maze });
    this.solver = solverMaker({ maze: this.maze });

    this.phasePlayMode = {
      maze: 'play',
      generate: 'fast',
      braid: 'fast',
      solve: 'fast',
      final: 'refresh',
      observe: 'refresh',
      exit: 'fast',
      ...mode,
    };
  }

  public setMode(playMode: PlayMode): void {
    switch (playMode) {
      case 'pause': {
        this.setPlayMode('pause');
        break;
      }

      //@ts-expect-error fall-though is intended
      case 'refresh': {
        this.switchPhase('exit');
      }

      case 'step':
      case 'play':
      case 'fast':
      case 'instant': {
        this.setPlayMode(playMode);
        this.dispatchEvent(new CustomEvent('command'));
        break;
      }

      // no default
    }
  }

  private setPlayMode(playMode: PlayMode): void {
    if (this.observationTimer) {
      clearTimeout(this.observationTimer);
      this.observationTimer = undefined;
    }

    this.dispatchEvent(new CustomEvent('mode', { detail: playMode }));
    this.mode = playMode;

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

      case 'refresh': {
        this.playing = false;
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
            this.stepper = this.maze.braid();
            this.baseSpeed = 1;
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
        this.dispatchEvent(new CustomEvent('phase', { detail: phase }));
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
              const done = await this.run();

              if (done) {
                this.switchPhase('solve');
              }
              break;
            }

            case 'solve': {
              const done = await this.run();

              if (done) {
                this.switchPhase('final');
              }
              break;
            }

            case 'final': {
              this.maze.drawSolution();

              this.switchPhase('observe');

              if (this.phasePlayMode.observe !== 'pause') {
                this.observationTimer = setTimeout(() => {
                  this.switchPhase('exit');
                  this.dispatchEvent(new CustomEvent('command', {}));
                }, 15000);
              }

              break;
            }

            case 'observe': {
              break;
            }

            case 'exit': {
              return;
            }

            // no default
          }

          if (this.aborted) {
            throw new Error('Aborted');
          }

          //@ts-expect-error 'phase' can change - false positive
          if (this.phase !== 'exit' && this.phase !== 'final' && !this.playing) {
            this.mode = 'pause';
            this.dispatchEvent(new CustomEvent('mode', { detail: this.mode }));

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
