import React from 'react';
import {
  CanvasDrawing,
  type Maze,
  type MazeGenerator,
  type MazeGeneratorProperties,
  type MazeProperties,
  MazeRunner,
  type MazeSolver,
  type MazeSolverProperties,
  type Phase,
  type PlayMode,
} from '@technobuddha/maze';
import clsx from 'clsx';
import { parseAsString, useQueryState } from 'nuqs';
import { useMeasure } from 'react-use';

import { ToggleButton, ToggleButtonGroup } from '#control';

import { CustomControls } from './custom-controls/index.ts';
import { DemoMode } from './demo-mode/index.ts';
import { ExportControls } from './export/index.ts';
import { GameControls } from './game-controls/index.ts';
import { GeneratorSection } from './generator-section/index.ts';
import { GeometrySection } from './geometry-section/index.ts';
import { HumanSection } from './human-section/index.ts';
import { Messages } from './messages/messages.tsx';
import { SolverSection } from './solver-section/index.ts';

import css from './maze-maker.module.css' with { type: 'css' };

export type Producer<Object, Props = never, Additional = unknown> = () => {
  maker: (props: Props) => Object;
  title: string;
} & Additional;
export type GeometryProducer = Producer<Maze, MazeProperties, { announceMaze: boolean }>;
export type GeneratorProducer = Producer<MazeGenerator, MazeGeneratorProperties>;
export type SolverProducer = Producer<MazeSolver, MazeSolverProperties>;
export type BraidingProducer = Producer<number>;

export type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
  const [top, { width, height }] = useMeasure<HTMLDivElement>();
  const frame = React.useRef<HTMLDivElement>(null);

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const [mazeNumber, setMazeNumber] = React.useState(0);

  const [mode, setMode] = useQueryState('mode', parseAsString.withDefault('demo'));

  const [mazeName, setMazeName] = React.useState('');
  const [generatorName, setGeneratorName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');

  const [phasePlayMode, setPhasePlayMode] = React.useState<{ [P in Phase]?: PlayMode }>({
    generate: 'fast',
    solve: 'fast',
    observe: 'refresh',
  });

  const [drawing, setDrawing] = React.useState<CanvasDrawing>();

  const [geometryProducer, setGeometryProducer] = React.useState<GeometryProducer>();
  const [generatorProducer, setGeneratorProducer] = React.useState<GeneratorProducer>();
  const [solverProducer, setSolverProducer] = React.useState<SolverProducer>();
  const [humanProducer, setHumanProducer] = React.useState<SolverProducer>();

  const [runner, setRunner] = React.useState<MazeRunner>();

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
    // cspell: words solpro
    const solpro = mode === 'game' ? humanProducer : solverProducer;

    if (drawing && geometryProducer && generatorProducer && solpro) {
      const { maker: mazeMaker, title: geometryTitle, announceMaze } = geometryProducer();
      setMazeName(geometryTitle);

      const { maker: generatorMaker, title: generatorTitle } = generatorProducer();
      setGeneratorName(generatorTitle);

      const { maker: solverMaker, title: solverTitle } = solpro();
      setSolverName(solverTitle);

      // const piChoice = chooser(plugins);
      // if(piChoice) {
      //   plugin
      // }
      // const { name: plugName, value: plugin } = chooser(plugins);
      // setPluginName(plugName);

      setRunner((r) => {
        r?.abort();
        return new MazeRunner({
          mazeMaker,
          generatorMaker,
          solverMaker,
          plugin: undefined,
          drawing,
          mode: phasePlayMode,
          name: announceMaze ? `${geometryTitle} | ${generatorTitle} | ${solverTitle}` : undefined,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, drawing, mazeNumber]);

  React.useEffect(() => {
    if (runner) {
      void runner
        .execute()
        .then(() => {
          setMazeNumber((n) => n + 1);
        })
        .catch(() => {});
    }
  }, [runner]);

  const handleGeometryChange = React.useCallback((producer: GeometryProducer) => {
    setGeometryProducer(() => producer);
  }, []);

  const handleGeneratorChange = React.useCallback((producer: GeneratorProducer) => {
    setGeneratorProducer(() => producer);
  }, []);

  const handleSolverChange = React.useCallback((producer: SolverProducer) => {
    setSolverProducer(() => producer);
  }, []);

  const handleHumanChange = React.useCallback((producer: SolverProducer) => {
    setHumanProducer(() => producer);
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
        <div className={css.settings}>
          <GeometrySection
            className={clsx(mode === 'demo' && css.hidden)}
            onChange={handleGeometryChange}
          />
          <GeneratorSection
            className={clsx(mode === 'demo' && css.hidden)}
            onChange={handleGeneratorChange}
          />
          <SolverSection
            className={clsx(mode === 'demo' && css.hidden)}
            onChange={handleSolverChange}
          />
          {mode === 'game' && <HumanSection onChange={handleHumanChange} runner={runner} />}
          {mode === 'demo' && <DemoMode runner={runner} />}
        </div>
        {mode === 'game' && <GameControls runner={runner} />}
        {mode === 'custom' && (
          <CustomControls runner={runner} onPhasePlayModeChange={handlePhasePlayModeChange} />
        )}
        {mode === 'custom' && <ExportControls runner={runner} />}
        <Messages runner={runner} />
      </div>
    </div>
  );
};
