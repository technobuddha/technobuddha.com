/* eslint-disable react/no-multi-comp */
import React from 'react';
import { randomPick, toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import { Size } from '@technobuddha/mui-size';

import { CanvasDrawing } from './drawing/canvas-drawing.js';
import { Blob } from './generator/blob.js';
import { GrowingTree } from './generator/growing-tree.js';
import { HuntAndKill } from './generator/hunt-and-kill.js';
import { Kruskals } from './generator/kruskals.js';
import { type MazeGenerator, type MazeGeneratorProperties } from './generator/maze-generator.js';
import { Prims } from './generator/prims.js';
import { RecursiveBacktracker } from './generator/recursive-backtracker.js';
import { Wilsons } from './generator/wilsons.js';
import { BrickMaze } from './maze/brick-maze.js';
import { HexagonMaze } from './maze/hexagon-maze.js';
import { type Maze, type MazeProperties } from './maze/maze.js';
import { MazeFactory } from './maze/maze-factory.js';
import { OctogonMaze } from './maze/octogon-maze.js';
import { SquareMaze } from './maze/square-maze.js';
import { TriangleMaze } from './maze/triangle-maze.js';
import { ZetaMaze } from './maze/zeta-maze.js';
import { BreadthFirstSearch } from './solver/breadth-first-search.js';
import { DeadEndFiller } from './solver/dead-end-filler.js';
import { DeadEndRemover } from './solver/dead-end-remover.js';
import { DepthFirstSearch } from './solver/depth-first-search.js';
import { type MazeSolver, type MazeSolverProperties } from './solver/maze-solver.js';
import { WallWalking } from './solver/wall-walking.js';

type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => (
  <Size width="100%" height="100%">
    {({ width, height }) => <MazeBoard boxWidth={width} boxHeight={height} />}
  </Size>
);

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props),
  triangle: (props) => new TriangleMaze(props),
  hexagon: (props) => new HexagonMaze(props),
  octogon: (props) => new OctogonMaze(props),
  zeta: (props) => new ZetaMaze(props),
};

const algorithms: Record<
  string,
  Record<string, (props: MazeGeneratorProperties) => MazeGenerator>
> = {
  blob: {
    normal: (props) => new Blob(props),
  },
  huntAndKill: {
    random: (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
    rows: (props) => new HuntAndKill({ huntMethod: 'rows', ...props }),
    columns: (props) => new HuntAndKill({ huntMethod: 'columns', ...props }),
    reverseRows: (props) => new HuntAndKill({ huntMethod: 'reverse-rows', ...props }),
    reverseColumns: (props) => new HuntAndKill({ huntMethod: 'reverse-columns', ...props }),
  },
  growingTree: {
    random: (props) => new GrowingTree({ method: 'random', ...props }),
    oldest: (props) => new GrowingTree({ method: 'oldest', ...props }),
    newest: (props) => new GrowingTree({ method: 'newest', ...props }),
    middle: (props) => new GrowingTree({ method: 'middle', ...props }),
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

const solvers: Record<string, (props: MazeSolverProperties) => MazeSolver> = {
  depthFirstSearch: (props) => new DepthFirstSearch(props),
  deadEndFiller: (props) => new DeadEndFiller(props),
  deadEndRemover: (props) => new DeadEndRemover(props),
  followTheRightWall: (props) => new WallWalking({ ...props, turn: 'right' }),
  followTheLeftWall: (props) => new WallWalking({ ...props, turn: 'left' }),
  breadthFirstSearch: (props) => new BreadthFirstSearch(props),
};

type MazeBoardProps = {
  readonly boxWidth: number;
  readonly boxHeight: number;
  readonly children?: never;
};

export const MazeBoard: React.FC<MazeBoardProps> = ({ boxWidth, boxHeight }) => {
  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSolve = React.useRef<HTMLCanvasElement | null>(null);
  const [redraw, setRedraw] = React.useState(0);
  const [mazeName, setMazeName] = React.useState('');
  const [algorithmName, setAlgorithmName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');

  React.useEffect(() => {
    if (canvasMaze.current && canvasSolve.current) {
      const contextMaze = new CanvasDrawing(canvasMaze.current);
      const contextSolve = new CanvasDrawing(canvasSolve.current);

      const factory = new MazeFactory({ drawing: contextMaze });

      const name = randomPick(Object.keys(mazes))!;
      const selectedMaze = mazes[name];

      const algorithm1 = randomPick(Object.keys(algorithms))!;
      const algorithm2 = randomPick(Object.keys(algorithms[algorithm1]))!;
      const selectedAlgorithm = algorithms[algorithm1][algorithm2];

      setMazeName(name);
      setAlgorithmName(`${algorithm1} ${algorithm2}`);

      const solver = randomPick(Object.keys(solvers))!;
      const selectedSolver = solvers[solver];
      setSolverName(solver);

      void factory.create(selectedMaze, selectedAlgorithm).then((maze) => {
        maze.draw();
        setTimeout(() => {
          void selectedSolver({ maze, context: contextSolve })
            .solve({})
            .then(() => {
              setTimeout(() => {
                setRedraw((x) => x + 1);
              }, 10000);
            });
        }, 0);
      });
    }
  }, [redraw, boxHeight, boxWidth]);

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        width: boxWidth,
        height: boxHeight,
      }}
    >
      <div style={{ position: 'absolute', zIndex: 4, top: 0, left: 0 }}>
        Maze Shape:&nbsp;
        {toCapitalWordCase(toHumanCase(mazeName))}
        Generator:&nbsp;
        {toCapitalWordCase(toHumanCase(algorithmName))}
        &nbsp;|&nbsp; Solver:&nbsp;
        {toCapitalWordCase(toHumanCase(solverName))}
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={canvasMaze}
        width={boxWidth - 12}
        height={boxHeight - 20}
        style={{ position: 'absolute', top: 20, left: 6, zIndex: 1 }}
      />
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={canvasSolve}
        width={boxWidth - 12}
        height={boxHeight - 20}
        style={{ position: 'absolute', top: 20, left: 6, zIndex: 2 }}
      />
    </div>
  );
};
