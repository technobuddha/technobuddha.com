/* eslint-disable react/no-multi-comp */
import React from 'react';
import { Size } from '@technobuddha/size';

import { useUserInterface } from '#context/user-interface';
import { CanvasDrawing } from '#maze/drawing';
import { type MazeGenerator, type MazeGeneratorProperties } from '#maze/generator';
import { type Maze, type MazeProperties } from '#maze/geometry';
import { chooser } from '#maze/library';
import { Runner } from '#maze/runner';
import { type MazeSolver, type MazeSolverProperties } from '#maze/solver';

import { generators, mazes, solvers } from './mazes.ts';

import css from './maze-background.module.css';

export type MazeBackgroundProps = {
  readonly maskColor?: string;
  readonly children: React.ReactNode;
};

export const MazeBackground: React.FC<MazeBackgroundProps> = ({
  children,
  maskColor = 'black',
}) => (
  <Size width="100%" height="100%">
    {({ width, height }) => (
      <MazeBoard boxWidth={width} boxHeight={height} maskColor={maskColor}>
        {children}
      </MazeBoard>
    )}
  </Size>
);

type MazeBoardProps = {
  readonly boxWidth: number;
  readonly boxHeight: number;
  readonly maskColor: string;
  readonly children: React.ReactNode;
};

export const MazeBoard: React.FC<MazeBoardProps> = ({
  boxWidth,
  boxHeight,
  children,
  maskColor,
}) => {
  const { setFooter } = useUserInterface();
  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const grid = React.useRef<HTMLDivElement | null>(null);
  const [mazeNumber, setMazeNumber] = React.useState(0);
  const [runner, setRunner] = React.useState<Runner>();

  React.useEffect(() => {
    if (canvasMaze.current && grid.current) {
      const drawing = new CanvasDrawing(canvasMaze.current);
      drawing.clear();

      const {
        props: { geometry: Geometry, ...mazeProps },
        title: mazeName,
      } = chooser(mazes)!;
      const {
        props: { generator: Generator, ...generatorProps },
        title: generatorName,
      } = chooser(generators)!;
      const {
        props: { solver: Solver, ...solverProps },
        title: solverName,
      } = chooser(solvers)!;

      const cRect = canvasMaze.current.getBoundingClientRect();
      const rects = Array.from(grid.current.children).flatMap((child) =>
        Array.from(child.children).map((grandChild) => grandChild.getBoundingClientRect()),
      );

      function plugin(maze: Maze): void {
        for (const rect of rects) {
          const top = Math.floor((rect.top - cRect.top) / maze.cellSize - 0.5);
          const left = Math.floor((rect.left - cRect.left) / maze.cellSize - 0.5);
          const right = Math.floor((rect.right - cRect.left) / maze.cellSize);
          const bottom = Math.floor((rect.bottom - cRect.top) / maze.cellSize);

          for (const cell of maze.cellsInMaze()) {
            if (cell.x >= left && cell.x <= right && cell.y >= top && cell.y <= bottom) {
              maze.nexus(cell).mask = true;
            }
          }
        }
      }

      setFooter(
        <div id="maze" className={css.legend}>
          <span>Geometry:</span>
          <span>{mazeName}</span>
          <span>Generator:</span>
          <span>{generatorName}</span>
          <span>Solver:</span>
          <span>{solverName}</span>
        </div>,
      );

      const selectedMaze = (props: MazeProperties): Maze =>
        new Geometry({ ...props, ...mazeProps });
      const selectedGenerator = (props: MazeGeneratorProperties): MazeGenerator =>
        new Generator({ ...props, ...generatorProps });
      const selectedSolver = (props: MazeSolverProperties): MazeSolver =>
        new Solver({ ...props, robots: [], ...solverProps });
      setRunner((r) => {
        r?.abort();
        return new Runner({
          mazeMaker: selectedMaze,
          generatorMaker: selectedGenerator,
          solverMaker: selectedSolver,
          plugin,
          drawing,
        });
      });
    }
  }, [boxHeight, boxWidth, maskColor, setFooter, mazeNumber]);

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

  return (
    <div className={css.mazeBackground} style={{ width: boxWidth, height: boxHeight }}>
      <canvas
        aria-label="A maze being created and solved"
        ref={canvasMaze}
        width={boxWidth}
        height={boxHeight}
        className={css.canvas}
      />
      <div ref={grid} className={css.children} style={{ width: boxWidth, height: boxHeight }}>
        {children}
      </div>
    </div>
  );
};
