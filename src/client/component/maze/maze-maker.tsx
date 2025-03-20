import React from 'react';
import randomPick from '@technobuddha/library/randomPick';
import { Size } from '@technobuddha/mui-size';
import { MazeFactory } from './maze/maze-factory';

import type { Maze, MazeProperties } from './maze/maze';
import type { MazeSolver, MazeSolverProperties } from './solver/maze-solver';

import { SquareMaze } from './maze/square-maze';
import { TriangleMaze } from './maze/triangle-maze';
import { HexagonMaze } from './maze/hexagon-maze';

import { Kruskals } from './generator/kruskals';
import { RecursiveBacktracker } from './generator/recursive-backtracker';
//import RecursiveDivision    from './generator/RecursiveDivision';
import { TruePrims } from './generator/true-prims';
import { Blob } from './generator/blob';
import { GrowingTree } from './generator/growing-tree';
import { Wilsons } from './generator/wilsons';

import { DeadEndFiller } from './solver/dead-end-filler';
import { WallWalking } from './solver/wall-walking';
import { DepthFirstSearch } from './solver/depth-first-search';
import { BreadthFirstSearch } from './solver/breadth-first-search';

type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
  return (
    <Size width="100%" height="100%">
      {({ width, height }) => <MazeBoard boxWidth={width} boxHeight={height} />}
    </Size>
  );
};

type MazeBoardProps = {
  boxWidth: number;
  boxHeight: number;
  children?: never;
};

const mazes: ((props: MazeProperties) => Maze)[] = [
  (props: MazeProperties) => new SquareMaze(props),
  (props: MazeProperties) => new TriangleMaze(props),
  (props: MazeProperties) => new HexagonMaze(props),
];

const algorithms = [
  Kruskals,
  RecursiveBacktracker,
  TruePrims,
  Blob,
  GrowingTree,
  Wilsons,
  // RecursiveDivision,
];

const solvers: ((props: MazeSolverProperties) => MazeSolver)[] = [
  (props: MazeSolverProperties) => new DepthFirstSearch(props),
  (props: MazeSolverProperties) => new DeadEndFiller(props),
  (props: MazeSolverProperties) => new WallWalking(props),
  (props: MazeSolverProperties) => new BreadthFirstSearch(props),
];

export const MazeBoard: React.FC<MazeBoardProps> = ({ boxWidth, boxHeight }) => {
  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSolve1 = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSolve2 = React.useRef<HTMLCanvasElement | null>(null);
  const [redraw, setRedraw] = React.useState(0);

  React.useEffect(() => {
    if (canvasMaze.current && canvasSolve1.current && canvasSolve2.current) {
      const contextMaze = canvasMaze.current.getContext('2d')!;
      const contextSolve1 = canvasSolve1.current.getContext('2d')!;
      const contextSolve2 = canvasSolve2.current.getContext('2d')!;

      const factory = new MazeFactory({ context: contextMaze });

      contextSolve1.clearRect(0, 0, boxWidth, boxHeight);
      contextSolve2.clearRect(0, 0, boxWidth, boxHeight);

      void factory.create(randomPick(mazes)!, randomPick(algorithms)!, 10).then((maze) => {
        maze.draw();
        setTimeout(() => {
          //maze.drawDistances();
          // eslint-disable-next-line promise/no-nesting
          void randomPick(solvers)!({ maze, context: contextSolve1 })
            .solve({})
            .then(() => {
              setTimeout(() => {
                setRedraw((x) => x + 1);
              }, 5000);
            });
        }, 0);
      });
    }
  }, [redraw]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasMaze}
        width={boxWidth}
        height={boxHeight}
        style={{ position: 'absolute', zIndex: 1 }}
      />
      <canvas
        ref={canvasSolve1}
        width={boxWidth}
        height={boxHeight}
        style={{ position: 'absolute', zIndex: 2 }}
      />
      <canvas
        ref={canvasSolve2}
        width={boxWidth}
        height={boxHeight}
        style={{ position: 'absolute', zIndex: 3 }}
      />
    </div>
  );
};
