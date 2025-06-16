import React from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { parseAsString, useQueryState } from 'nuqs';
import {
  IoCaretBackCircleOutline,
  IoCaretDownCircleOutline,
  IoCaretForwardCircleOutline,
  IoCaretUpCircleOutline,
} from 'react-icons/io5';
import { useMeasure } from 'react-use';

import { Checkbox, MenuItem, Select } from '#control';

import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/maze-generator.ts';
import { type Maze, type MazeProperties } from '../geometry/maze.ts';
import { allChoices, chooser } from '../library/chooser.ts';
import { logger } from '../library/logger.ts';
import { generators, mazes, plugins, solvers } from '../library/mazes.ts';
import { Human } from '../solver/human.ts';
import { type MazeSolver, type MazeSolverProperties } from '../solver/maze-solver.ts';

import { PlayControls } from './play-controls.tsx';
import { PlayModeToggle } from './play-mode-toggle.tsx';
import { type PlayMode, Runner } from './runner.ts';
import { Section } from './section.tsx';

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
  const [runnerMode, setRunnerMode] = React.useState<PlayMode>();

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

  const handleRunnerModeChange = React.useCallback((mode: PlayMode) => {
    setRunnerMode(mode);
  }, []);

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
      if (selectedSolver === 'human') {
        solverMaker = (props: MazeSolverProperties) => new Human(props);
        setSolverName('Human');
      } else if (selectedSolver) {
        solverMaker = solverChoices.find((gc) => gc.name === selectedSolver)!.value!;
        setSolverName(selectedSolver);
      } else {
        const { name: sName, value } = chooser(solvers);
        solverMaker = value!;
        setSolverName(sName);
      }

      const { name: plugName, value: plugin } = chooser(plugins);
      setPluginName(plugName);

      setRunner((r) => {
        r?.abort();
        return new Runner({
          mazeMaker,
          generatorMaker,
          solverMaker,
          plugin,
          drawing,
          showCoordinates,
          onModeChange: handleRunnerModeChange,
          mode: {
            generate: playGenerator,
            solve: playSolver,
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedMaze,
    selectedGenerator,
    selectedSolver,
    showCoordinates,
    drawing,
    mazeNumber,
    handleRunnerModeChange,
  ]);

  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }

    if (runner) {
      void runner
        .execute()
        .then(() => {
          if (timer.current) {
            clearTimeout(timer.current);
          }

          timer.current = setTimeout(() => {
            timer.current = undefined;
            setMazeNumber((n) => n + 1);
          }, 5000);
        })
        .catch(() => {
          if (timer.current) {
            clearTimeout(timer.current);
          }
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

  const [mode, setMode] = useQueryState('mode', parseAsString.withDefault('demo'));

  React.useEffect(() => {
    setSelectedMaze(undefined);
    setSelectedGenerator(undefined);
    setSelectedSolver(mode === 'game' ? 'human' : undefined);
    setShowCoordinates(false);
    setPlayGenerator('fast');
    setPlaySolver('fast');
  }, [mode]);

  const handleModeChange = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newMode: 'demo' | 'game' | 'custom') => {
      void setMode(newMode);
    },
    [setMode],
  );

  const handleBack = React.useCallback(() => {
    const human = runner?.solver as Human;
    if (human) {
      human.dispatchEvent(new CustomEvent('keydown', { detail: 'ArrowDown' }));
    }
  }, [runner]);

  const handleForward = React.useCallback(() => {
    const human = runner?.solver as Human;
    if (human) {
      human.dispatchEvent(new CustomEvent('keydown', { detail: 'ArrowUp' }));
    }
  }, [runner]);

  const handleLeft = React.useCallback(() => {
    const human = runner?.solver as Human;
    if (human) {
      human.dispatchEvent(new CustomEvent('keydown', { detail: 'ArrowLeft' }));
    }
  }, [runner]);

  const handleRight = React.useCallback(() => {
    const human = runner?.solver as Human;
    if (human) {
      human.dispatchEvent(new CustomEvent('keydown', { detail: 'ArrowRight' }));
    }
  }, [runner]);

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
        <ToggleButtonGroup
          className={css.toggles}
          color="primary"
          value={mode}
          exclusive
          onChange={handleModeChange}
        >
          <ToggleButton value="demo">DEMO</ToggleButton>
          <ToggleButton value="game">GAME</ToggleButton>
          <ToggleButton value="custom">CUSTOM</ToggleButton>
        </ToggleButtonGroup>
        {(mode === 'custom' || mode === 'game') && (
          <Section title="Geometry">
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
          </Section>
        )}
        {(mode === 'custom' || mode === 'game') && (
          <Section title="Generator">
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
          </Section>
        )}
        {mode === 'custom' && (
          <Section title="Solver">
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
          </Section>
        )}
        <div className={css.gap} />
        {mode === 'game' && (
          <div>
            <div style={{ textAlign: 'center' }}>
              <Button variant="outlined" color="primary" onClick={handleForward}>
                <IoCaretUpCircleOutline size={28} />
              </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button variant="outlined" color="primary" onClick={handleLeft}>
                <IoCaretBackCircleOutline size={28} />
              </Button>
              <Button variant="outlined" color="primary" onClick={handleBack}>
                <IoCaretDownCircleOutline size={28} />
              </Button>
              <Button variant="outlined" color="primary" onClick={handleRight}>
                <IoCaretForwardCircleOutline size={28} />
              </Button>
            </div>
          </div>
        )}
        {mode === 'custom' && (
          <>
            <PlayModeToggle
              title="Maze Generator Initial Speed"
              onChange={handlePlayGeneratorChange}
              value={playGenerator}
            />
            <PlayModeToggle
              title="Maze Solver Initial Speed"
              onChange={handlePlaySolverChange}
              value={playSolver}
            />
            <PlayControls
              onPause={handlePause}
              onStep={handleStep}
              onPlay={handlePlay}
              onFast={handleFast}
              onInstant={handleInstant}
              onRefresh={handleRefresh}
              value={runnerMode ?? 'fast'}
            />
          </>
        )}
      </div>
    </div>
  );
};
