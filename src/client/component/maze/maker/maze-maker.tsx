import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { toCapitalWordCase, toError, toHumanCase } from '@technobuddha/library';
import { useMeasure } from 'react-use';

import { enqueueSnackbar } from '#context/snackbar';

import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { MazeFactory } from '../factory/maze-factory.ts';
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
  const [redraw, setRedraw] = React.useState(0);
  const [mazeName, setMazeName] = React.useState('');
  const [generatorName, setGeneratorName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');
  const [pluginName, setPluginName] = React.useState('');
  const [selectedMaze, setSelectedMaze] = React.useState<string>();
  const [selectedGenerator, setSelectedGenerator] = React.useState<string>();
  const [selectedSolver, setSelectedSolver] = React.useState<string>();

  const [factory, setFactory] = React.useState<MazeFactory | null>(null);

  React.useEffect(() => {
    if (width > 0 && height > 0) {
      if (canvasMaze.current) {
        const drawingMaze = new CanvasDrawing(canvasMaze.current);
        drawingMaze.clear();

        setFactory(new MazeFactory({ drawing: drawingMaze }));
      }
    }
  }, [width, height]);

  const mazeChoices = React.useMemo(() => Array.from(allChoices(mazes)), []);
  const generatorChoices = React.useMemo(() => Array.from(allChoices(generators)), []);
  const solverChoices = React.useMemo(() => Array.from(allChoices(solvers)), []);

  React.useEffect(() => {
    if (factory) {
      let maze: (props: MazeProperties) => Maze;
      if (selectedMaze) {
        maze = mazeChoices.find((mc) => mc.name === selectedMaze)!.value!;
        setMazeName(selectedMaze);
      } else {
        const { name: mName, value } = chooser(mazes);
        setMazeName(mName);
        maze = value!;
      }

      let generator: (props: MazeGeneratorProperties) => MazeGenerator;
      if (selectedGenerator) {
        generator = generatorChoices.find((gc) => gc.name === selectedGenerator)!.value!;
        setGeneratorName(selectedGenerator);
      } else {
        const { name: gName, value } = chooser(generators);
        setGeneratorName(gName);
        generator = value!;
      }

      let solver: (props: MazeSolverProperties) => MazeSolver;
      if (selectedSolver) {
        solver = solverChoices.find((gc) => gc.name === selectedSolver)!.value!;
        setSolverName(selectedSolver);
      } else {
        const { name: sName, value } = chooser(solvers);
        setSolverName(sName);
        solver = value!;
      }

      const { name: pName, value: plugin } = chooser(plugins);
      setPluginName(pName);

      const runner = factory.create(maze!, generator, plugin, solver);

      void runner
        .run()
        .catch((err) => {
          if (err.message === 'Aborted') {
            throw toError(err);
          } else {
            enqueueSnackbar(err.message, {
              persist: false,
              variant: 'error',
            });
          }
        })
        .then(() => {
          setTimeout(() => {
            setRedraw((x) => x + 1);
          }, 10000);
        })
        .catch(() => {});

      return () => {
        runner.abort();
      };
    }

    return () => {};
  }, [
    mazeChoices,
    generatorChoices,
    factory,
    redraw,
    height,
    width,
    selectedMaze,
    selectedGenerator,
    selectedSolver,
    solverChoices,
  ]);

  const handleMazeChange = React.useCallback((event: SelectChangeEvent) => {
    setSelectedMaze(event.target.value === '(undefined)' ? undefined : event.target.value);
  }, []);

  const handleGeneratorChange = React.useCallback((event: SelectChangeEvent) => {
    setSelectedGenerator(event.target.value === '(undefined)' ? undefined : event.target.value);
  }, []);

  const handleSolverChange = React.useCallback((event: SelectChangeEvent) => {
    setSelectedSolver(event.target.value === '(undefined)' ? undefined : event.target.value);
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
        <FormControl>
          <InputLabel htmlFor="selectMaze">Maze Geometry</InputLabel>
          <Select<string>
            id="selectMaze"
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
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="selectGenerator">Maze Generator</InputLabel>
          <Select<string>
            id="selectGenerator"
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
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="selectSolver">Maze Solver</InputLabel>
          <Select<string>
            id="selectSolver"
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
        </FormControl>
      </div>
    </div>
  );
};
