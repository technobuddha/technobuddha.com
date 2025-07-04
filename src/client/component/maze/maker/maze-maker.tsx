import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { parseAsString, useQueryState } from 'nuqs';
import { useMeasure } from 'react-use';

import { Checkbox, MenuItem, Select } from '#control';

import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/index.ts';
import { type Maze, type MazeProperties } from '../geometry/index.ts';
import { allChoices, chooser } from '../library/chooser.ts';
import { Human, type MazeSolver, type MazeSolverProperties } from '../solver/index.ts';

import { CustomControls } from './controls/custom-controls.tsx';
import { GameControls } from './controls/game-controls.tsx';
import { Messages } from './controls/messages.tsx';
import { generators, mazes, solvers } from './mazes.ts';
import { type Phase } from './phase.ts';
import { type PlayMode } from './play-mode.tsx';
import { Runner } from './runner.ts';
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

  const [phasePlayMode, setPhasePlayMode] = React.useState<{ [P in Phase]?: PlayMode }>({
    generate: 'fast',
    solve: 'fast',
    observe: 'refresh',
  });

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
        const {
          props: { geometry: Geometry, ...args },
        } = mazeChoices.find((choice) => choice.title === selectedMaze)!;
        mazeMaker = (props) => new Geometry({ ...args, ...props });
        setMazeName(selectedMaze);
      } else {
        const {
          props: { geometry: Geometry, ...args },
          title,
        } = chooser(mazes)!;
        mazeMaker = (props) => new Geometry({ ...args, ...props });
        setMazeName(title);
      }

      let generatorMaker: (props: MazeGeneratorProperties) => MazeGenerator;
      if (selectedGenerator) {
        const {
          props: { generator: Generator, ...args },
        } = generatorChoices.find((choice) => choice.title === selectedGenerator)!;
        generatorMaker = (props) => new Generator({ ...args, ...props });
        setGeneratorName(selectedGenerator);
      } else {
        const {
          props: { generator: Generator, ...args },
          title,
        } = chooser(generators)!;
        generatorMaker = (props) => new Generator({ ...args, ...props });
        setGeneratorName(title);
      }

      let solverMaker: (props: MazeSolverProperties) => MazeSolver;
      if (selectedSolver === 'human') {
        solverMaker = (props) => new Human(props);
        setSolverName('Human');
      } else if (selectedSolver) {
        const {
          props: { solver: Solver, ...args },
        } = solverChoices.find((choice) => choice.title === selectedSolver)!;
        // TODO [2025-07-15]: Fix this type error
        //@ts-expect-error detection screwup
        solverMaker = (props) => new Solver({ ...args, ...props });
        setSolverName(selectedSolver);
      } else {
        const {
          props: { solver: Solver, ...args },
          title,
        } = chooser(solvers)!;
        //@ts-expect-error detection screwup
        solverMaker = (props) => new Solver({ ...args, ...props });
        setSolverName(title);
      }

      // const piChoice = chooser(plugins);
      // if(piChoice) {
      //   plugin
      // }
      // const { name: plugName, value: plugin } = chooser(plugins);
      // setPluginName(plugName);

      setRunner((r) => {
        r?.abort();
        return new Runner({
          mazeMaker,
          generatorMaker,
          solverMaker,
          plugin: undefined,
          drawing,
          showCoordinates,
          mode: phasePlayMode,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMaze, selectedGenerator, selectedSolver, showCoordinates, drawing, mazeNumber]);

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
          setMazeNumber((n) => n + 1);
        })
        .catch(() => {});
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

  const handlePhasePlayModeChange = React.useCallback(
    (phase: Phase, value: PlayMode) => {
      if (runner) {
        runner.phasePlayMode[phase] = value;
      }
      setPhasePlayMode((prev) => ({ ...prev, [phase]: value }));
    },
    [runner],
  );

  const [mode, setMode] = useQueryState('mode', parseAsString.withDefault('demo'));

  React.useEffect(() => {
    // setSelectedMaze(undefined);
    // setSelectedGenerator(undefined);
    if (mode === 'game') {
      setSelectedSolver('human');
    }
    // setSelectedSolver(mode === 'game' ? 'human' : undefined);
    // setShowCoordinates(false);
    // setPhasePlayMode({
    // generate: 'fast',
    // solve: 'fast',
    // observe: 'refresh',
    // });
  }, [mode]);

  const handleModeChange = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newMode: 'demo' | 'game' | 'custom') => {
      void setMode(newMode);
    },
    [setMode],
  );

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
              {mazeChoices
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((m) => (
                  <MenuItem key={m.title} value={m.title}>
                    {m.title}
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
              {generatorChoices
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((m) => (
                  <MenuItem key={m.title} value={m.title}>
                    {m.title}
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
              {solverChoices
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((m) => (
                  <MenuItem key={m.title} value={m.title}>
                    {m.title}
                  </MenuItem>
                ))}
            </Select>
          </Section>
        )}
        <div className={css.gap} />
        <Messages runner={runner} />
        {mode === 'game' && <GameControls runner={runner} />}
        {mode === 'custom' && (
          <CustomControls runner={runner} onPhasePlayModeChange={handlePhasePlayModeChange} />
        )}
      </div>
    </div>
  );
};
