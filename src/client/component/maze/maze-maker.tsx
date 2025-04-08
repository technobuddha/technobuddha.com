import React from 'react';
import { randomPick, toCapitalWordCase, toHumanCase } from '@technobuddha/library';
import { useMeasure } from 'react-use';

import { animate } from './drawing/animate.ts';
import { CanvasDrawing } from './drawing/canvas-drawing.ts';
import { Blob } from './generator/blob.ts';
import { GrowingTree } from './generator/growing-tree.ts';
import { HuntAndKill } from './generator/hunt-and-kill.ts';
import { Kruskals } from './generator/kruskals.ts';
import { type MazeGenerator, type MazeGeneratorProperties } from './generator/maze-generator.ts';
import { Prims } from './generator/prims.ts';
import { RecursiveBacktracker } from './generator/recursive-backtracker.ts';
import { Wilsons } from './generator/wilsons.ts';
// import { Sample } from './generator/wip/sample.ts';
import { donutMask } from './masks/donut.ts';
import { ellipiseMask } from './masks/ellipse.ts';
import { triangleMask } from './masks/triangle.ts';
import { BrickMaze } from './maze/brick-maze.ts';
// import { CubicMaze } from './maze/cubic-maze.js';
import { HexagonMaze } from './maze/hexagon-maze.ts';
import { type Maze, type MazeProperties } from './maze/maze.ts';
import { OctogonMaze } from './maze/octogon-maze.ts';
import { PentagonMaze } from './maze/pentagon-maze.ts';
import { SquareMaze } from './maze/square-maze.ts';
import { TriangleMaze } from './maze/triangle-maze.ts';
import { WedgeMaze } from './maze/wedge-maze.ts';
import { ZetaMaze } from './maze/zeta-maze.ts';
import { MazeFactory } from './maze-factory.ts';
import { Dijkstras } from './solver/dijkstras.ts';
import { Filler } from './solver/filler.ts';
import { type MazeSolver, type MazeSolverProperties } from './solver/maze-solver.ts';
import { Search } from './solver/search.ts';
import { Tremaux } from './solver/tremaux.ts';
import { WallWalking } from './solver/wall-walking.ts';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  // cubic: (props) => new CubicMaze(props),
  pentagon: (props) => new PentagonMaze(props),
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props), //({ ...props, entrance: { x: 0, y: 0 }, exit: { x: 12, y: 14 } }),
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
  division: {
    normal: (props) => new Blob(props),
  },
  huntAndKill: {
    random: (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
    topLeft: (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
    topRight: (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
    bottomLeft: (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
    bottomRight: (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
    leftTop: (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
    leftBottom: (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
    rightTop: (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
    rightBottom: (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
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
    parallel: (props) => new RecursiveBacktracker({ parallel: 2, ...props }),
    swirl: (props) =>
      new RecursiveBacktracker({
        strategy: [
          'right-turn',
          'left-turn',
          'random',
          'random',
          'random',
          'random',
          'random',
          'random',
        ],
        ...props,
      }),
    whirpool: (props) =>
      new RecursiveBacktracker({
        strategy: [
          'right-turn',
          'left-turn',
          'right-turn',
          'left-turn',
          'right-turn',
          'left-turn',
          'right-turn',
          'left-turn',
        ],
        ...props,
      }),
  },
  wilsons: {
    normal: (props) => new Wilsons(props),
  },
  // sample: {
  //   normal: (props) => new Sample(props),
  // },
};

const solvers: Record<string, Record<string, (props: MazeSolverProperties) => MazeSolver>> = {
  trémaux: {
    normal: (props) => new Tremaux(props),
  },
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

const masks: Record<string, (maze: Maze) => void> = {
  ellipse: ellipiseMask,
  donut: donutMask,
  triangle: triangleMask,
};

type MazeMakerProps = {
  children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
  const [div, { width, height }] = useMeasure<HTMLDivElement>();

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSolve = React.useRef<HTMLCanvasElement | null>(null);
  const [redraw, setRedraw] = React.useState(0);
  const [mazeName, setMazeName] = React.useState('');
  const [algorithmName, setAlgorithmName] = React.useState('');
  const [solverName, setSolverName] = React.useState('');
  const [maskName, setMaskName] = React.useState('');

  React.useEffect(() => {
    if (canvasMaze.current && canvasSolve.current) {
      const drawingMaze = new CanvasDrawing(canvasMaze.current);
      const drawingSolve = new CanvasDrawing(canvasSolve.current);

      drawingMaze.clear();
      drawingSolve.clear();

      const factory = new MazeFactory({ drawing: drawingMaze });

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

      let mask: ((maze: Maze) => void) | undefined = undefined;
      if (Math.random() < 0) {
        const key = randomPick(Object.keys(masks))!;
        setMaskName(key);
        mask = masks[key];
      } else {
        setMaskName('');
      }

      void factory.create(selectedMaze, selectedAlgorithm, mask, selectedSolver).then((maze) => {
        setTimeout(() => {
          setRedraw((x) => x + 1);
        }, 6000);
      });
    }
  }, [redraw, height, width]);

  return (
    <div
      ref={div}
      style={{
        position: 'relative',
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        width: '100%',
        height: '100%',
      }}
    >
      {width > 0 && height > 0 && (
        <>
          <div style={{ position: 'absolute', zIndex: 4, top: 0, left: 0 }}>
            Maze Shape:&nbsp;
            {toCapitalWordCase(toHumanCase(mazeName))}
            &nbsp;|&nbsp;Generator:&nbsp;
            {toCapitalWordCase(toHumanCase(algorithmName))}
            &nbsp;|&nbsp; Solver:&nbsp;
            {toCapitalWordCase(toHumanCase(solverName))}
            {maskName !== '' && (
              <span>&nbsp;|&nbsp; Mask:&nbsp;{toCapitalWordCase(toHumanCase(maskName))}</span>
            )}
          </div>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <canvas
            ref={canvasMaze}
            width={width - 12}
            height={height - 20}
            style={{ position: 'absolute', top: 20, left: 6, zIndex: 1 }}
          />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <canvas
            ref={canvasSolve}
            width={width - 12}
            height={height - 20}
            style={{ position: 'absolute', top: 20, left: 6, zIndex: 2 }}
          />
        </>
      )}
    </div>
  );
};
