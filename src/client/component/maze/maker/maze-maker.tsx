import React from 'react';
import { toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import {
  FaBackward,
  FaBackwardFast,
  FaBackwardStep,
  FaForward,
  FaForwardFast,
  FaForwardStep,
  FaPause,
  FaPlay,
  FaStop,
} from 'react-icons/fa6';
import { useMeasure } from 'react-use';

import { MenuItem, Select } from '#control';

import { animate } from '../drawing/animate.ts';
import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/maze-generator.ts';
import { allChoices, chooser } from '../library/chooser.ts';
import { generators, mazes, plugins, solvers } from '../library/mazes.ts';
import { type Maze, type MazeProperties } from '../maze/maze.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/maze-solver.ts';

import css from './maze-maker.module.css';

type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
  const [div, { width, height }] = useMeasure<HTMLDivElement>();

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const stop = React.useRef<boolean>(false);
  const [redraw, setRedraw] = React.useState(0);
  const [step, setStep] = React.useState(0);

  const [mazeName, setMazeName] = React.useState('');
  const [generatorName, setGeneratorName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');
  const [playMode, setPlayMode] = React.useState<'play' | 'step' | 'fast' | 'instant'>('fast');
  const [pluginName, setPluginName] = React.useState('');

  const [maze, setMaze] = React.useState<Maze>();
  const [generator, setGenerator] = React.useState<MazeGenerator>();
  const [solver, setSolver] = React.useState<MazeSolver>();
  const [generatorStep, setGeneratorStep] = React.useState<Iterator<void>>();
  const [solverStep, setSolverStep] = React.useState<Iterator<void>>();

  const [drawing, setDrawing] = React.useState<CanvasDrawing>();

  const [selectedMaze, setSelectedMaze] = React.useState<string>();
  const [selectedGenerator, setSelectedGenerator] = React.useState<string>();
  const [selectedSolver, setSelectedSolver] = React.useState<string>();

  const [phase, setPhase] = React.useState<'maze' | 'generate' | 'solve' | 'done'>();

  React.useEffect(() => {
    if (width > 0 && height > 0) {
      if (canvasMaze.current) {
        const drawingMaze = new CanvasDrawing(canvasMaze.current);
        drawingMaze.clear();

        setDrawing(drawingMaze);
      }
    }
  }, [width, height]);

  const mazeChoices = React.useMemo(() => Array.from(allChoices(mazes)), []);
  const generatorChoices = React.useMemo(() => Array.from(allChoices(generators)), []);
  const solverChoices = React.useMemo(() => Array.from(allChoices(solvers)), []);

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
      const g = generatorMaker({ maze: m });
      const s = solverMaker({ maze: m });

      setMaze(m);
      setGenerator(g);
      setSolver(s);

      stop.current = true;
      setTimeout(() => {
        setPhase('maze');
      });
    }
  }, [
    mazeChoices,
    generatorChoices,
    solverChoices,
    selectedMaze,
    selectedGenerator,
    selectedSolver,
    drawing,
    redraw,
  ]);

  const runner = React.useCallback(
    async (
      play: 'fast' | 'play' | 'step' | 'instant',
      iterator: Iterator<void>,
      speed: number,
    ): Promise<boolean> => {
      stop.current = false;

      let run: () => Promise<boolean>;

      switch (play) {
        case 'fast': {
          run = async (): Promise<boolean> => {
            while (
              await animate(() => {
                for (let i = 0; i < speed; ++i) {
                  if (stop.current) {
                    return false;
                  }
                  if (iterator.next().done) {
                    return false;
                  }
                }
                return !stop.current;
              })
            ) {
              if (stop.current) {
                return false;
              }
            }
            return !stop.current;
          };
          break;
        }

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

            while (!stop.current && !iterator.next().done) {
              //
            }

            maze!.attachDrawing(d);
            return true;
          };
          break;
        }

        // no default
      }

      return run().finally(() => {
        stop.current = false;
      });
    },
    [maze],
  );

  React.useEffect(() => {
    if (phase) {
      switch (phase) {
        case 'maze': {
          if (maze) {
            maze.draw();

            setGeneratorStep(generator!.generate());
            setPlayMode('fast'); // TODO
            setPhase('generate');
          }
          break;
        }

        case 'generate': {
          if (maze && generator && generatorStep) {
            void runner(playMode, generatorStep, generator.speed).then((finished) => {
              if (finished) {
                maze.addTermini();
                // maze.braid(); // TODO
                maze.draw();

                setSolverStep(solver!.solve());
                setPlayMode('step'); // TODO
                setPhase('solve');
              } else if (playMode === 'play') {
                setStep((s) => s + 1);
              }
            });
          }
          break;
        }

        case 'solve': {
          if (maze && solver && solverStep) {
            void runner(playMode, solverStep, solver.speed).then((finished) => {
              if (finished) {
                setPlayMode('fast'); // TODO
                setPhase('done');
              } else if (playMode === 'play') {
                setTimeout(() => {
                  setStep((s) => s + 1);
                }, 50);
              }
            });
          }
          break;
        }

        case 'done': {
          maze.drawSolution();

          setTimeout(() => {
            setRedraw((n) => n + 1);
          }, 10000);
          break;
        }

        // no default
      }
    }
  }, [playMode, phase, step, maze, generator, solver, generatorStep, solverStep, runner]);

  const handleMazeChange = React.useCallback((value: string) => {
    setSelectedMaze(value === '(undefined)' ? undefined : value);
  }, []);

  const handleGeneratorChange = React.useCallback((value: string) => {
    setSelectedGenerator(value === '(undefined)' ? undefined : value);
  }, []);

  const handleSolverChange = React.useCallback((value: string) => {
    setSelectedSolver(value === '(undefined)' ? undefined : value);
  }, []);

  const handleStep = React.useCallback(() => {
    stop.current = true;
    setTimeout(() => {
      setPlayMode('step');
      setStep((s) => s + 1);
    });
  }, []);

  const handlePlay = React.useCallback(() => {
    stop.current = true;
    setTimeout(() => {
      setPlayMode('play');
      setStep((s) => s + 1);
    });
  }, []);

  const handleFast = React.useCallback(() => {
    stop.current = true;
    setTimeout(() => {
      setPlayMode('fast');
      setStep((s) => s + 1);
    });
  }, []);

  const handleInstant = React.useCallback(() => {
    stop.current = true;
    setTimeout(() => {
      setPlayMode('instant');
      setStep((s) => s + 1);
    });
  }, []);

  return (
    <div className={css.mazeMaker}>
      <div ref={div} className={css.maze}>
        {width > 0 && height > 0 && (
          <>
            <div className={css.title}>
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
            <canvas
              ref={canvasMaze}
              width={width - 12}
              height={height - 20}
              className={css.canvas}
              aria-label="A Maze being created and solved"
            />
          </>
        )}
      </div>
      <div className={css.panel}>
        <Select
          label="Maze Geometry"
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
        <Select
          label="Maze Generator"
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
        <Select
          label="Maze Solver"
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
        <button type="button" onClick={handleStep}>
          <FaForwardStep />
        </button>
        <button type="button" onClick={handlePlay}>
          <FaPlay />
        </button>
        <button type="button" onClick={handleFast}>
          <FaForward />
        </button>
        <button type="button" onClick={handleInstant}>
          <FaForwardFast />
        </button>
        <br />
        <button type="button" disabled>
          <FaBackward />
        </button>
        <button type="button" disabled>
          <FaBackwardFast />
        </button>
        <button type="button" disabled>
          <FaBackwardStep />
        </button>
        <button type="button" disabled>
          <FaPause />
        </button>
        <button type="button" disabled>
          <FaStop />
        </button>
      </div>
    </div>
  );
};
