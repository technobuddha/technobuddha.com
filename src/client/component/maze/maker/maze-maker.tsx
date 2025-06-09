import React from 'react';
import {
  IoFootsteps,
  IoPause,
  IoPlay,
  IoPlayForward,
  IoPlaySkipForward,
  IoRefresh,
} from 'react-icons/io5';
import { useMeasure } from 'react-use';

import { Checkbox, MenuItem, Select } from '#control';

import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/maze-generator.ts';
import { type Maze, type MazeProperties } from '../geometry/maze.ts';
import { allChoices, chooser } from '../library/chooser.ts';
import { logger } from '../library/logger.ts';
import { generators, mazes, plugins, solvers } from '../library/mazes.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/maze-solver.ts';

import { type PlayMode, Runner } from './runner.ts';

import css from './maze-maker.module.css';

const mazeChoices = Array.from(allChoices(mazes));
const generatorChoices = Array.from(allChoices(generators));
const solverChoices = Array.from(allChoices(solvers));

type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
  const [top, { width, height }] = useMeasure<HTMLDivElement>();
  const frame = React.useRef<HTMLDivElement>(null);

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const [mazeNumber, setMazeNumber] = React.useState(0);

  const maze = React.useRef<Maze>(undefined);

  const [mazeName, setMazeName] = React.useState('');
  const [showCoordinates, setShowCoordinates] = React.useState(false);

  const [generatorName, setGeneratorName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');
  const [pluginName, setPluginName] = React.useState('');

  const [playGenerator, setPlayGenerator] = React.useState<PlayMode>('fast');
  const [playSolver, setPlaySolver] = React.useState<PlayMode>('fast');

  const [drawing, setDrawing] = React.useState<CanvasDrawing>();

  const [selectedMaze, setSelectedMaze] = React.useState<string>();
  const [selectedGenerator, setSelectedGenerator] = React.useState<string>();
  const [selectedSolver, setSelectedSolver] = React.useState<string>();

  const [runner, setRunner] = React.useState<Runner>();

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
  }, [width, height]);

  React.useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }

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

      const m = mazeMaker({ plugin, drawing, showCoordinates });
      m.reset();
      const g = generatorMaker({ maze: m });
      const s = solverMaker({ maze: m });
      maze.current = m;

      setRunner((r) => {
        r?.abort();
        return new Runner({
          maze: m,
          generator: g,
          solver: s,
          mode: {
            generate: playGenerator,
            solve: playSolver,
          },
        });
      });
    }
  }, [
    selectedMaze,
    selectedGenerator,
    selectedSolver,
    showCoordinates,
    drawing,
    playGenerator,
    playSolver,
    mazeNumber,
  ]);

  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    if (runner) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }

      void runner.execute().then(() => {
        timer.current = setTimeout(() => {
          // debugger;
          setMazeNumber((n) => n + 1);
        }, 15000);
      });
    }
  }, [runner]);

  const handleMazeChange = React.useCallback((value: string) => {
    setSelectedMaze(value === '(undefined)' ? undefined : value);
  }, []);

  const handleCoordinatesChange = React.useCallback((checked: boolean) => {
    setShowCoordinates(checked);
  }, []);

  const handleGeneratorChange = React.useCallback((value: string) => {
    setSelectedGenerator(value === '(undefined)' ? undefined : value);
  }, []);

  const handleSolverChange = React.useCallback((value: string) => {
    setSelectedSolver(value === '(undefined)' ? undefined : value);
  }, []);

  const handlePause = React.useCallback(() => {
    runner?.setMode('pause');
  }, [runner]);

  const handleStep = React.useCallback(() => {
    runner?.setMode('step');
  }, [runner]);

  const handlePlay = React.useCallback(() => {
    runner?.setMode('play');
  }, [runner]);

  const handleFast = React.useCallback(() => {
    runner?.setMode('fast');
  }, [runner]);

  const handleInstant = React.useCallback(() => {
    runner?.setMode('instant');
  }, [runner]);

  const handleRefresh = React.useCallback(() => {
    logger.clear();
    runner?.abort();
    setTimeout(() => {
      setMazeNumber((n) => n + 1);
    });
  }, [runner]);

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
            <span className={css.text}>Geometry:</span>
            <span className={css.option}>{mazeName}</span>
            <span className={css.text}>Generator:</span>
            <span className={css.option}>{generatorName}</span>
            <span className={css.text}>Solver:</span>
            <span className={css.option}>{solverName}</span>
            {pluginName !== '' && <span className={css.text}>Plugin:</span>}
            {pluginName !== '' && <span className={css.option}>{pluginName}</span>}
          </div>
        )}
      </div>
      <div className={css.panel}>
        <fieldset>
          <legend>Geometry</legend>
          <Select label="Shape" value={selectedMaze ?? '(undefined)'} onChange={handleMazeChange}>
            <MenuItem key="(undefined)" value="(undefined)">
              (random)
            </MenuItem>
            {mazeChoices.map((m) => (
              <MenuItem key={m.name} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
          <Checkbox
            label="Show Coordinates"
            checked={showCoordinates}
            onChange={handleCoordinatesChange}
          />
        </fieldset>
        <fieldset>
          <legend>Generator</legend>
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
        <div className={css.buttons}>
          <button className={css.button} type="button" onClick={handlePause}>
            <IoPause />
          </button>
          <button className={css.button} type="button" onClick={handleStep}>
            <IoFootsteps />
          </button>
          <button className={css.button} type="button" onClick={handlePlay}>
            <IoPlay />
          </button>
          <button className={css.button} type="button" onClick={handleFast}>
            <IoPlayForward />
          </button>
          <button className={css.button} type="button" onClick={handleInstant}>
            <IoPlaySkipForward />
          </button>
          <button className={css.button} type="button" onClick={handleRefresh}>
            <IoRefresh />
          </button>
        </div>
      </div>
    </div>
  );
};
