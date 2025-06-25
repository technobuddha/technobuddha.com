/* eslint-disable @typescript-eslint/naming-convention */
import {
  Division,
  GrowingTree,
  HuntAndKill,
  Kruskals,
  type MazeGenerator,
  type MazeGeneratorProperties,
  Prims,
  RecursiveBacktracker,
  Wilsons,
} from '../generator/index.ts';
import {
  BrickMaze,
  CircularMaze,
  CubicMaze,
  DotMaze,
  HexagonMaze,
  type Maze,
  type MazeProperties,
  OctogonMaze,
  PentagonMaze,
  SquareMaze,
  TriangleMaze,
  WedgeMaze,
  ZetaMaze,
} from '../geometry/index.ts';
import { experimentalPlugin } from '../plugins/experiment.ts';
import { donutPlugin, ellipisePlugin, trianglePlugin } from '../plugins/index.ts';
import { portalPlugin } from '../plugins/portal.ts';
import {
  Chain,
  Dijkstras,
  DrunkardsWalk,
  FibonaccisRabbits,
  Filler,
  type MazeSolver,
  type MazeSolverProperties,
  RandomMouse,
  Search,
  Tremaux,
  WallWalking,
} from '../solver/index.ts';

import { type Choice } from './chooser.ts';

export const squareMazes: Choice<MazeProperties, Maze> = {
  '1': (props) => new SquareMaze(props),
};

export const mazes: Choice<MazeProperties, Maze> = {
  '0:Dot': {
    '10': (props) => new DotMaze(props),
    '0:=Zeta': (props) => new ZetaMaze(props),
  },
  '0:Circle': {
    '10': (props) => new CircularMaze(props),
    '10:Find Center': (props) =>
      new CircularMaze({ exit: { x: 0, y: 0 }, entrance: 'random edge', ...props }),
    '10:Escape': (props) =>
      new CircularMaze({ entrance: { x: 0, y: 0 }, exit: 'random edge', ...props }),
    '10:Void': (props) => new CircularMaze({ centerRadius: 128, centerSegments: 16, ...props }),
  },
  '0:Cubic': {
    '10': (props) => new CubicMaze(props),
  },
  '0:Pentagon': {
    '10': (props) => new PentagonMaze(props),
  },
  '0:Brick': (props) => new BrickMaze(props),
  '1:Square': squareMazes,
  '0:Triangle': {
    '10': (props) => new TriangleMaze(props),
  },
  '0:Hexagon': {
    '10': (props) => new HexagonMaze(props),
  },
  '0:Octogon': {
    '10': (props) => new OctogonMaze(props),
  },
  '0:Wedge': (props) => new WedgeMaze(props),
};

export const generators: Choice<MazeGeneratorProperties, MazeGenerator> = {
  '0:Division': {
    '10': (props) => new Division(props),
  },
  '0:Hunt & Kill -': {
    '10:Random': (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
    '10:Top Left': (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
    '10:Top Right': (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
    '10:Bottom Left': (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
    '10:Bottom Right': (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
    '10:Left Top': (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
    '10:Left Bottom': (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
    '10:Right Top': (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
    '10:Right Bottom': (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
  },
  '0:Growing Tree ': {
    '10:Newest': (props) => new GrowingTree({ method: 'newest', ...props }),
    '10:Random': (props) => new GrowingTree({ method: 'random', ...props }),
    '0:Oldest': (props) => new GrowingTree({ method: 'oldest', ...props }),
    '0:Middle': (props) => new GrowingTree({ method: 'middle', ...props }),
  },
  '0:Kruskals': {
    '10': (props) => new Kruskals(props),
  },
  '0:Prims': {
    '10': (props) => new Prims(props),
  },
  '10:Recursize Backtracker': {
    '10': (props) => new RecursiveBacktracker({ speed: 1, ...props }),
    '0:Bridge Builder': (props) =>
      new RecursiveBacktracker({
        strategy: ['bridge-builder'],
        forced: 0.25,
        bridgeMinLength: 1,
        bridgeMaxLength: 1,
        stepsAfterBridge: 1,
        ...props,
      }),
    '0:Parallel': (props) => new RecursiveBacktracker({ parallel: 2, ...props }),
    '0:Swirl': (props) =>
      new RecursiveBacktracker({
        strategy: [
          'right-turn',
          'left-turn',
          'straight',
          'random',
          'random',
          'random',
          'random',
          'random',
        ],
        ...props,
      }),
    '0:Whirpool': (props) =>
      new RecursiveBacktracker({
        strategy: [
          'right-turn',
          'left-turn',
          'straight',
          'right-turn',
          'left-turn',
          'straight',
          'right-turn',
          'left-turn',
          'straight',
        ],
        ...props,
      }),
  },
  '0:Wilsons': {
    '10': (props) => new Wilsons(props),
  },
};

export const solvers: Choice<MazeSolverProperties, MazeSolver> = {
  '0:Trémaux': {
    '10': (props) => new Tremaux(props),
  },
  '0:Search': {
    '10:Random': (props) => new Search({ approach: 'random', ...props }),
    '10:Seek Exit': (props) => new Search({ approach: 'seek', ...props }),
    '10:Left Turn': (props) => new Search({ approach: 'left-turn', ...props }),
    '10:Right Turn': (props) => new Search({ approach: 'right-turn', ...props }),
    '10:Straight': (props) => new Search({ approach: 'straight', ...props }),
  },
  '0:Fill': {
    '10:Dead Ends': (props) => new Filler({ ...props, method: 'dead-end' }),
    '10:Cul-de-Sac': (props) => new Filler({ ...props, method: 'cul-de-sac' }),
  },
  '10': {
    '10:Follow the Right Wall': (props) => new WallWalking({ ...props, turn: 'right' }),
    '10:Follow the Left Wall': (props) => new WallWalking({ ...props, turn: 'left' }),
  },
  '0:Chain': {
    '10:Wall-Walking': (props) => new Chain({ ...props, robot: 'wall-walking' }),
    '10:Backtracking': (props) => new Chain({ ...props, robot: 'backtracking' }),
  },
  "0:Dijkstra's": {
    '10': (props) => new Dijkstras(props),
  },
  "00:Drunkard's Walk": (props) => new DrunkardsWalk(props),
  '00:Random Mouse': (props) => new RandomMouse({ ...props }),
  "00:Fibonacci's Rabbits": (props) => new FibonaccisRabbits(props),
};

export const plugins: Choice<Maze, void> = {
  '0:portal:': portalPlugin,
  '0:experimental bridges': experimentalPlugin,
  '0:ellipse': ellipisePlugin,
  '0:donut': donutPlugin,
  '0:triangle': trianglePlugin,
};
