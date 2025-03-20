/* eslint-disable react/no-multi-comp */
import React from 'react';
import { randomPick, toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import { Size } from '@technobuddha/mui-size';

import { Drawing } from './drawing/drawing.js';
import { Blob } from './generator/blob.js';
import { GrowingTree } from './generator/growing-tree.js';
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

const algorithms: Record<string, (props: MazeGeneratorProperties) => MazeGenerator> = {
  blob: (props) => new Blob(props),
  growingTree: (props) => new GrowingTree(props),
  kruskals: (props) => new Kruskals(props),
  prims: (props) => new Prims(props),
  recursizeBacktracker: (props) => new RecursiveBacktracker(props),
  wilsons: (props) => new Wilsons(props),
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
      const contextMaze = new Drawing(canvasMaze.current.getContext('2d')!);
      const contextSolve = new Drawing(canvasSolve.current.getContext('2d')!);

      const factory = new MazeFactory({ context: contextMaze });

      const name = randomPick(Object.keys(mazes))!;
      const selectedMaze = mazes[name];

      const algorithm = randomPick(Object.keys(algorithms))!;
      const selectedAlgorithm = algorithms[algorithm];

      setMazeName(name);
      setAlgorithmName(algorithm);

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
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', zIndex: 4, top: 0, left: boxWidth - 100 }}>
        Maze Shape:
        <br />
        {toCapitalWordCase(toHumanCase(mazeName))}
        <br />
        <br />
        Generator:
        <br />
        {toCapitalWordCase(toHumanCase(algorithmName))}
        <br />
        <br />
        Solver:
        <br />
        {toCapitalWordCase(toHumanCase(solverName))}
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={canvasMaze}
        width={boxWidth - 100}
        height={boxHeight}
        style={{ position: 'absolute', zIndex: 1 }}
      />
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={canvasSolve}
        width={boxWidth - 100}
        height={boxHeight}
        style={{ position: 'absolute', zIndex: 2 }}
      />
    </div>
  );
};
