/* eslint-disable react/no-multi-comp */
import React from 'react';
import { randomPick, toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import { Size } from '@technobuddha/size';

import { useUserInterface } from '#context/user-interface';

import { CanvasDrawing } from './drawing/canvas-drawing.ts';
import { Blob } from './generator/blob.ts';
import { GrowingTree } from './generator/growing-tree.ts';
import { HuntAndKill } from './generator/hunt-and-kill.ts';
import { Kruskals } from './generator/kruskals.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from './generator/maze-generator.ts';
import { Prims } from './generator/prims.ts';
import { RecursiveBacktracker } from './generator/recursive-backtracker.ts';
import { Wilsons } from './generator/wilsons.ts';
import { type Maze, type MazeProperties } from './maze/maze.ts';
import { SquareMaze } from './maze/square-maze.ts';
import { MazeFactory } from './maze-factory.ts';
import { Dijkstras } from './solver/dijkstras.ts';
import { Filler } from './solver/filler.ts';
import { type MazeSolver, type MazeSolverProperties } from './solver/maze-solver.ts';
import { Search } from './solver/search.ts';
import { WallWalking } from './solver/wall-walking.ts';

import css from './maze-background.module.css';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  square: (props) => new SquareMaze(props),
};

const algorithms: Record<
  string,
  Record<string, (props: MazeGeneratorProperties) => MazeGenerator>
> = {
  division: {
    normal: (props) => new Blob(props),
  },
  // huntAndKill: {
  //   random: (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
  //   topLeft: (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
  //   topRight: (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
  //   bottomLeft: (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
  //   bottomRight: (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
  //   leftTop: (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
  //   leftBottom: (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
  //   rightTop: (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
  //   rightBottom: (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
  // },
  growingTree: {
    newest: (props) => new GrowingTree({ method: 'newest', ...props }),
    random: (props) => new GrowingTree({ method: 'random', ...props }),
    // oldest: (props) => new GrowingTree({ method: 'oldest', ...props }),
    // middle: (props) => new GrowingTree({ method: 'middle', ...props }),
  },
  kruskals: {
    normal: (props) => new Kruskals(props),
  },
  prims: {
    normal: (props) => new Prims(props),
  },
  recursizeBacktracker: {
    normal: (props) => new RecursiveBacktracker(props),
  },
  wilsons: {
    normal: (props) => new Wilsons(props),
  },
};

const solvers: Record<string, Record<string, (props: MazeSolverProperties) => MazeSolver>> = {
  search: {
    random: (props) => new Search({ method: 'random', ...props }),
    seekExit: (props) => new Search({ method: 'seek', ...props }),
    leftTurn: (props) => new Search({ method: 'left-turn', ...props }),
    rightTurn: (props) => new Search({ method: 'right-turn', ...props }),
  },
  fill: {
    deadEnd: (props) => new Filler({ ...props, method: 'dead-end' }),
    culDeSac: (props) => new Filler({ ...props, method: 'cul-de-sac' }),
  },
  followWall: {
    right: (props) => new WallWalking({ ...props, turn: 'right' }),
    left: (props) => new WallWalking({ ...props, turn: 'left' }),
  },
  dijkstras: {
    normal: (props) => new Dijkstras(props),
  },
};

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

      const factory = new MazeFactory({ drawing, maskColor, cellSize: 15 });

      const name = randomPick(Object.keys(mazes))!;
      const selectedMaze = mazes[name];

      const algorithm1 = randomPick(Object.keys(algorithms))!;
      const algorithm2 = randomPick(Object.keys(algorithms[algorithm1]))!;
      const selectedAlgorithm = algorithms[algorithm1][algorithm2];
      const algorithmName = `${algorithm1} ${algorithm2}`;

      const solver1 = randomPick(Object.keys(solvers))!;
      const solver2 = randomPick(Object.keys(solvers[solver1]))!;
      const selectedSolver = solvers[solver1][solver2];
      const solverName = `${solver1} ${solver2}`;

      const crect = canvasMaze.current.getBoundingClientRect();
      const rects = Array.from(grid.current.children).flatMap((child) =>
        Array.from(child.children).map((grandChild) => grandChild.getBoundingClientRect()),
      );
      function mask(maze: Maze): void {
        for (const rect of rects) {
          const top = Math.floor((rect.top - crect.top) / maze.cellSize - 0.5);
          const left = Math.floor((rect.left - crect.left) / maze.cellSize - 0.5);
          const right = Math.floor((rect.right - crect.left) / maze.cellSize);
          const bottom = Math.floor((rect.bottom - crect.top) / maze.cellSize);

          for (const cell of maze.all()) {
            if (cell.x >= left && cell.x <= right && cell.y >= top && cell.y <= bottom) {
              maze.mask[cell.x][cell.y] = true;
            }
          }
        }
      }

      setFooter(
        <div id="maze" className={css.legend}>
          <span>Generator:</span>
          <span>{toCapitalWordCase(toHumanCase(algorithmName))}</span>
          <span>Solver:</span>
          <span>{toCapitalWordCase(toHumanCase(solverName))}</span>
        </div>,
      );

      void factory.create(selectedMaze, selectedAlgorithm, mask, selectedSolver).then(() => {
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
