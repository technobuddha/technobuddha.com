/* eslint-disable react/no-multi-comp */
import React from 'react';
import { toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import { Size } from '@technobuddha/size';

import { useUserInterface } from '#context/user-interface';

import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { MazeFactory } from '../factory/maze-factory.ts';
import { type Maze, type MazeProperties, SquareMaze } from '../geometry/index.ts';
import { chooser } from '../library/chooser.ts';
import { generators, solvers } from '../library/mazes.ts';

import css from './maze-background.module.css';

type MazeBackgroundProps = {
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
  const [redraw, setRedraw] = React.useState(0);

  React.useEffect(() => {
    if (canvasMaze.current && grid.current) {
      const drawing = new CanvasDrawing(canvasMaze.current);
      drawing.clear();

      const factory = new MazeFactory({
        drawing,
        maskColor,
        cellSize: 16,
        gapSize: 0,
        wallSize: 1,
      });

      const selectedMaze = (props: MazeProperties): Maze => new SquareMaze(props);
      const { name: generatorName, value: selectedGenerator } = chooser(generators);
      const { name: solverName, value: selectedSolver } = chooser(solvers);

      const crect = canvasMaze.current.getBoundingClientRect();
      const rects = Array.from(grid.current.children).flatMap((child) =>
        Array.from(child.children).map((grandChild) => grandChild.getBoundingClientRect()),
      );

      function plugin(maze: Maze): void {
        for (const rect of rects) {
          const top = Math.floor((rect.top - crect.top) / maze.cellSize - 0.5);
          const left = Math.floor((rect.left - crect.left) / maze.cellSize - 0.5);
          const right = Math.floor((rect.right - crect.left) / maze.cellSize);
          const bottom = Math.floor((rect.bottom - crect.top) / maze.cellSize);

          for (const cell of maze.cellsInMaze()) {
            if (cell.x >= left && cell.x <= right && cell.y >= top && cell.y <= bottom) {
              maze.nexus(cell).mask = true;
            }
          }
        }
      }

      setFooter(
        <div id="maze" className={css.legend}>
          <span>Generator:</span>
          <span>{toCapitalWordCase(toHumanCase(generatorName))}</span>
          <span>Solver:</span>
          <span>{toCapitalWordCase(toHumanCase(solverName))}</span>
        </div>,
      );

      const runner = factory.create(selectedMaze, selectedGenerator, plugin, selectedSolver);

      void runner.run().then(() => {
        setTimeout(() => {
          setRedraw((x) => x + 1);
        }, 10000);
      });
    }
  }, [redraw, boxHeight, boxWidth, maskColor, setFooter]);

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
