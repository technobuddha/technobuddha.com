/* eslint-disable @typescript-eslint/no-loop-func */
import React from 'react';
import { toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import {
  IoFootsteps,
  IoPause,
  IoPlay,
  IoPlayForward,
  IoPlaySkipForward,
  IoRefresh,
} from 'react-icons/io5';
import { useMeasure } from 'react-use';

import { MenuItem, Select } from '#control';

import { animate } from '../drawing/animate.ts';
import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/maze-generator.ts';
import { type Maze, type MazeProperties } from '../geometry/maze.ts';
import { allChoices, chooser } from '../library/chooser.ts';
import { generators, mazes, plugins, solvers } from '../library/mazes.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/maze-solver.ts';

import css from './maze-maker.module.css';

const mazeChoices = Array.from(allChoices(mazes));
const generatorChoices = Array.from(allChoices(generators));
const solverChoices = Array.from(allChoices(solvers));

type Phase = 'maze' | 'generate' | 'braid' | 'solve' | 'done';
type PlayMode = 'pause' | 'step' | 'play' | 'fast' | 'instant';

type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
  const [top, { width, height }] = useMeasure<HTMLDivElement>();
  const frame = React.useRef<HTMLDivElement>(null);

  const processes = React.useRef<(() => void)[]>([]);

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const [mazeNumber, setMazeNumber] = React.useState(0);
  const [step, setStep] = React.useState(0);

  const [mazeName, setMazeName] = React.useState('');
  const [generatorName, setGeneratorName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');
  const [pluginName, setPluginName] = React.useState('');

  const [playMode, setPlayMode] = React.useState<PlayMode>('fast');
  const [playGenerator, setPlayGenerator] = React.useState<PlayMode>('fast');
  const [playSolver, setPlaySolver] = React.useState<PlayMode>('fast');

  const [maze, setMaze] = React.useState<Maze>();
  const [generator, setGenerator] = React.useState<MazeGenerator>();
  const [solver, setSolver] = React.useState<MazeSolver>();
  const [generatorStep, setGeneratorStep] = React.useState<Iterator<void>>();
  const [solverStep, setSolverStep] = React.useState<Iterator<void>>();
  const [generatorSpeed, setGeneratorSpeed] = React.useState(1);
  const [solverSpeed, setSolverSpeed] = React.useState(1);

  const [drawing, setDrawing] = React.useState<CanvasDrawing>();

  const [selectedMaze, setSelectedMaze] = React.useState<string>();
  const [selectedGenerator, setSelectedGenerator] = React.useState<string>();
  const [selectedSolver, setSelectedSolver] = React.useState<string>();

  const [phase, setPhase] = React.useState<Phase>('maze');

  React.useEffect(() => {
    if (width > 0 && height > 0) {
      if (canvasMaze.current) {
        canvasMaze.current.remove();
        canvasMaze.current = null;
      }

      if (frame.current) {
        const canvas = document.createElement('canvas');
        canvas.width = width - 12;
        canvas.height = height - 20;
        canvas.className = css.canvas;
        canvas.setAttribute('aria-label', 'A Maze being created and solved');

        frame.current.insertBefore(canvas, null);
        canvasMaze.current = canvas;
        const drawingMaze = new CanvasDrawing(canvas);
        drawingMaze.clear();

        setDrawing(drawingMaze);
      }
    }
  }, [width, height, mazeNumber]);

  React.useEffect(() => {
    if (drawing) {
      let mazeMaker: (props: MazeProperties) => Maze;
      if (selectedMaze) {
        mazeMaker = mazeChoices.find((mc) => mc.name === selectedMaze)!.value!;
        setMazeName(selectedMaze);
      } else {
        const { name: mName, value } = chooser(mazes);
        mazeMaker = value!;
        setMazeName(mName);
      }

      let generatorMaker: (props: MazeGeneratorProperties) => MazeGenerator;
      if (selectedGenerator) {
        generatorMaker = generatorChoices.find((gc) => gc.name === selectedGenerator)!.value!;
        setGeneratorName(selectedGenerator);
      } else {
        const { name: gName, value } = chooser(generators);
        generatorMaker = value!;
        setGeneratorName(gName);
      }

      let solverMaker: (props: MazeSolverProperties) => MazeSolver;
      if (selectedSolver) {
        solverMaker = solverChoices.find((gc) => gc.name === selectedSolver)!.value!;
        setSolverName(selectedSolver);
      } else {
        const { name: sName, value } = chooser(solvers);
        solverMaker = value!;
        setSolverName(sName);
      }

      const { name: pName, value: plugin } = chooser(plugins);
      setPluginName(pName);

      const m = mazeMaker({ plugin, drawing });
      m.reset();
      const g = generatorMaker({ maze: m });
      const s = solverMaker({ maze: m });

      setMaze(m);
      setGenerator(g);
      setGeneratorSpeed(g.speed);
      setSolver(s);
      setSolverSpeed(s.speed);

      //getReady to start the maze

      setTimeout(() => {
        setPhase('maze');
      });
    }
  }, [selectedMaze, selectedGenerator, selectedSolver, drawing, mazeNumber]);

  const kill = React.useCallback(() => {
    for (const p of processes.current) {
      p();
    }
  }, []);

  const runner = React.useCallback(
    async (play: PlayMode, iterator: Iterator<void>, speed: number): Promise<boolean> => {
      kill();

      let run: () => Promise<boolean>;

      switch (play) {
        case 'fast': {
          let stop = false;
          const killer = (): void => {
            stop = true;
          };
          processes.current.push(killer);

          run = async (): Promise<boolean> => {
            while (
              await animate(() => {
                for (let i = 0; i < speed; ++i) {
                  if (stop) {
                    return false;
                  }
                  if (iterator.next().done) {
                    return false;
                  }
                }
                return !stop;
              })
            ) {
              if (stop) {
                break;
              }
            }

            // eslint-disable-next-line unicorn/prefer-array-index-of
            const index = processes.current.findIndex((p) => p === killer);
            if (index >= 0) {
              processes.current.splice(index, 1);
            }
            return !stop;
          };
          break;
        }

        case 'pause':
        case 'play':
        case 'step': {
          run = async (): Promise<boolean> =>
            animate(() => {
              if (iterator.next().done) {
                return true;
              }
              return false;
            });
          break;
        }

        case 'instant': {
          // eslint-disable-next-line @typescript-eslint/require-await
          run = async (): Promise<boolean> => {
            const d = maze!.attachDrawing();
            while (!iterator.next().done) {
              //     //
            }

            maze!.attachDrawing(d);
            return true;
          };
          break;
        }

        // no default
      }

      return run();
    },
    [kill, maze],
  );

  React.useEffect(() => {
    if (maze && generator && solver) {
      switch (phase) {
        case 'maze': {
          maze.draw();
          setPhase('generate');
          setPlayMode(playGenerator);
          setGeneratorStep(generator.run());
          break;
        }

        case 'generate': {
          void runner(playMode, generatorStep!, generatorSpeed).then((finished) => {
            if (finished) {
              maze.addTermini();
              maze.draw();

              setPhase('braid');
            } else if (playMode === 'play') {
              setTimeout(() => setStep((s) => s + 1), 50);
            }
          });

          break;
        }

        case 'braid': {
          // maze.braid();
          setPhase('solve');
          setPlayMode(playSolver);
          setSolverStep(solver.solve());
          break;
        }

        case 'solve': {
          void runner(playMode, solverStep!, solverSpeed).then((finished) => {
            if (finished) {
              setPhase('done');
            } else if (playMode === 'play') {
              setTimeout(() => {
                setStep((s) => s + 1);
              }, 50);
            }
          });
          break;
        }

        case 'done': {
          if (maze.solution.length > 0) {
            maze.drawSolution();
          }

          setTimeout(() => {
            setMazeNumber((n) => n + 1);
          }, 10000);
          break;
        }

        // no default
      }
    }
  }, [
    playMode,
    phase,
    step,
    maze,
    generator,
    generatorStep,
    generatorSpeed,
    solver,
    solverStep,
    solverSpeed,
    runner,
    playGenerator,
    playSolver,
  ]);

  const handleMazeChange = React.useCallback((value: string) => {
    setSelectedMaze(value === '(undefined)' ? undefined : value);
  }, []);

  const handleGeneratorChange = React.useCallback((value: string) => {
    setSelectedGenerator(value === '(undefined)' ? undefined : value);
  }, []);

  const handleSolverChange = React.useCallback((value: string) => {
    setSelectedSolver(value === '(undefined)' ? undefined : value);
  }, []);

  const handlePause = React.useCallback(() => {
    kill();
    setTimeout(() => {
      setPlayMode('pause');
    });
  }, [kill]);

  const handleStep = React.useCallback(() => {
    kill();
    setTimeout(() => {
      setPlayMode('step');
      setStep((s) => s + 1);
    });
  }, [kill]);

  const handlePlay = React.useCallback(() => {
    kill();
    setTimeout(() => {
      setPlayMode('play');
      setStep((s) => s + 1);
    });
  }, [kill]);

  const handleFast = React.useCallback(() => {
    kill();
    setTimeout(() => {
      setPlayMode('fast');
      setStep((s) => s + 1);
    });
  }, [kill]);

  const handleInstant = React.useCallback(() => {
    kill();
    setTimeout(() => {
      setPlayMode('instant');
      setStep((s) => s + 1);
    });
  }, [kill]);

  const handleRefresh = React.useCallback(() => {
    kill();
    setTimeout(() => {
      setMazeNumber((n) => n + 1);
    });
  }, [kill]);

  const handlePlayGeneratorChange = React.useCallback((value: PlayMode) => {
    setPlayGenerator(value);
  }, []);

  const handlePlaySolverChange = React.useCallback((value: PlayMode) => {
    setPlaySolver(value);
  }, []);

  return (
    <div className={css.mazeMaker}>
      <div ref={top} className={css.maze}>
        {width > 0 && height > 0 && (
          <div ref={frame} className={css.title}>
            Maze Shape:&nbsp;
            {toCapitalWordCase(toHumanCase(mazeName))}
            &nbsp;|&nbsp;Generator:&nbsp;
            {toCapitalWordCase(toHumanCase(generatorName))}
            &nbsp;|&nbsp; Solver:&nbsp;
            {toCapitalWordCase(toHumanCase(solverName))}
            {pluginName !== '' && (
              <span>&nbsp;|&nbsp; Mask:&nbsp;{toCapitalWordCase(toHumanCase(pluginName))}</span>
            )}
          </div>
        )}
      </div>
      <div className={css.panel}>
        <fieldset>
          <legend>Maze Geometry</legend>
          <Select
            label="Algorthim"
            value={selectedMaze ?? '(undefined)'}
            onChange={handleMazeChange}
          >
            <MenuItem key="(undefined)" value="(undefined)">
              (random)
            </MenuItem>
            {mazeChoices.map((m) => (
              <MenuItem key={m.name} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </fieldset>
        <fieldset>
          <legend>Maze Generator</legend>
          <Select
            label="Algorthim"
            value={selectedGenerator ?? '(undefined)'}
            onChange={handleGeneratorChange}
          >
            <MenuItem key="(undefined)" value="(undefined)">
              (random)
            </MenuItem>
            {generatorChoices.map((m) => (
              <MenuItem key={m.name} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
          <Select<PlayMode>
            label="Maze Generator Initial Speed"
            value={playGenerator}
            onChange={handlePlayGeneratorChange}
          >
            <MenuItem key="pause" value="pause">
              <IoPause />
            </MenuItem>
            <MenuItem key="play" value="play">
              <IoPlay />
            </MenuItem>
            <MenuItem key="fast" value="fast">
              <IoPlayForward />
            </MenuItem>
            <MenuItem key="instant" value="instant">
              <IoPlaySkipForward />
            </MenuItem>
          </Select>
        </fieldset>
        <fieldset>
          <legend>Maze Solver</legend>

          <Select
            label="Algorthim"
            value={selectedSolver ?? '(undefined)'}
            onChange={handleSolverChange}
          >
            <MenuItem key="(undefined)" value="(undefined)">
              (random)
            </MenuItem>
            {solverChoices.map((m) => (
              <MenuItem key={m.name} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="Maze Solver Initial Speed"
            value={playSolver}
            onChange={handlePlaySolverChange}
          >
            <MenuItem key="pause" value="pause">
              <IoPause />
            </MenuItem>
            <MenuItem key="play" value="play">
              <IoPlay />
            </MenuItem>
            <MenuItem key="fast" value="fast">
              <IoPlayForward />
            </MenuItem>
            <MenuItem key="instant" value="instant">
              <IoPlaySkipForward />
            </MenuItem>
          </Select>
        </fieldset>
        <div className={css.gap} />
        <div>
          <button type="button" onClick={handlePause}>
            <IoPause />
          </button>
          <button type="button" onClick={handleStep}>
            <IoFootsteps />
          </button>
          <button type="button" onClick={handlePlay}>
            <IoPlay />
          </button>
          <button type="button" onClick={handleFast}>
            <IoPlayForward />
          </button>
          <button type="button" onClick={handleInstant}>
            <IoPlaySkipForward />
          </button>
          <button type="button" onClick={handleRefresh}>
            <IoRefresh />
          </button>
        </div>
      </div>
    </div>
  );
};
