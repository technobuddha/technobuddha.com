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
import { OctogonMaze } from './maze/octogon-maze.js';
import { PentagonMaze } from './maze/pentagon-maze.js';
import { SquareMaze } from './maze/square-maze.js';
import { TriangleMaze } from './maze/triangle-maze.js';
import { WedgeMaze } from './maze/wedge-maze.js';
import { ZetaMaze } from './maze/zeta-maze.js';
import { MazeFactory } from './maze-factory.js';
import { DeadEnd } from './solver/dead-end.js';
import { Dijkstras } from './solver/dijkstras.js';
import { type MazeSolver, type MazeSolverProperties } from './solver/maze-solver.js';
import { Search } from './solver/search.js';
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
  pentagon: (props) => new PentagonMaze(props),
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props),
  triangle: (props) => new TriangleMaze(props),
  hexagon: (props) => new HexagonMaze(props),
  octogon: (props) => new OctogonMaze(props),
  zeta: (props) => new ZetaMaze(props),
  wedge: (props) => new WedgeMaze(props),
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
  deadEnd: {
    filler: (props) => new DeadEnd({ ...props, method: 'fill' }),
    remover: (props) => new DeadEnd({ ...props, method: 'remove' }),
  },
  followWall: {
    right: (props) => new WallWalking({ ...props, turn: 'right' }),
    left: (props) => new WallWalking({ ...props, turn: 'left' }),
  },
  dijkstras: {
    normal: (props) => new Dijkstras(props),
  },
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

      const solver1 = randomPick(Object.keys(solvers))!;
      const solver2 = randomPick(Object.keys(solvers[solver1]))!;
      const selectedSolver = solvers[solver1][solver2];
      setSolverName(`${solver1} ${solver2}`);

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
        &nbsp;|&nbsp;Generator:&nbsp;
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
