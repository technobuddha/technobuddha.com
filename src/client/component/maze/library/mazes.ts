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
  Roboto,
  Search,
  Tremaux,
  WallWalking,
} from '../solver/index.ts';

import { type Choice } from './chooser.ts';

export const squareMazes: Choice<MazeProperties, Maze> = {
  '1': (props) => new SquareMaze(props),
};

export const mazes: Choice<MazeProperties, Maze> = {
  '1:Dot': {
    '10': (props) => new DotMaze(props),
    '0:=Zeta': (props) => new ZetaMaze(props),
  },
  '1:Circle': {
    '10': (props) => new CircularMaze(props),
    '10:Find Center': (props) =>
      new CircularMaze({ exit: { x: 0, y: 0 }, entrance: 'random edge', ...props }),
    '10:Escape': (props) =>
      new CircularMaze({ entrance: { x: 0, y: 0 }, exit: 'random edge', ...props }),
    '10:Void': (props) => new CircularMaze({ centerRadius: 128, centerSegments: 16, ...props }),
  },
  '1:Cubic': {
    '10': (props) => new CubicMaze(props),
  },
  '1:Pentagon': {
    '10': (props) => new PentagonMaze(props),
  },
  '1:Brick': (props) => new BrickMaze(props),
  '1:Square': squareMazes,
  '1:Triangle': {
    '10': (props) => new TriangleMaze(props),
  },
  '1:Hexagon': {
    '10': (props) => new HexagonMaze(props),
  },
  '1:Octogon': {
    '10': (props) => new OctogonMaze(props),
  },
  '1:Wedge': (props) => new WedgeMaze(props),
};

export const generators: Choice<MazeGeneratorProperties, MazeGenerator> = {
  '1:Division': {
    '1': (props) => new Division(props),
  },
  '1:Hunt & Kill -': {
    '1:Random': (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
    '1:Top Left': (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
    '1:Top Right': (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
    '1:Bottom Left': (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
    '1:Bottom Right': (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
    '1:Left Top': (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
    '1:Left Bottom': (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
    '1:Right Top': (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
    '1:Right Bottom': (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
  },
  '1:Growing Tree ': {
    '1:Newest': (props) => new GrowingTree({ method: 'newest', ...props }),
    '1:Random': (props) => new GrowingTree({ method: 'random', ...props }),
    '0:Oldest': (props) => new GrowingTree({ method: 'oldest', ...props }),
    '0:Middle': (props) => new GrowingTree({ method: 'middle', ...props }),
  },
  '1:Kruskals': {
    '1': (props) => new Kruskals(props),
  },
  '1:Prims': {
    '1': (props) => new Prims(props),
  },
  '0:Recursize Backtracker': {
    '1': (props) => new RecursiveBacktracker({ speed: 1, ...props }),
    '0:Bridge Builder': (props) =>
      new RecursiveBacktracker({
        strategy: ['bridge-builder'],
        forced: 0.25,
        bridgeMinLength: 1,
        bridgeMaxLength: 1,
        stepsAfterBridge: 1,
        ...props,
      }),
    '1:Parallel': (props) => new RecursiveBacktracker({ parallel: 2, ...props }),
    '1:Swirl': (props) =>
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
    '1:Whirpool': (props) =>
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
  '1:Wilsons': {
    '10': (props) => new Wilsons(props),
  },
};

export const solvers: Choice<MazeSolverProperties, MazeSolver> = {
  '1:Roboto': {
    '10:Follow the left wall': (props) =>
      new Roboto({ robots: [{ algorithm: 'wall-walking', turn: 'left' }], ...props }),
    '10:Follow the right wall': (props) =>
      new Roboto({ robots: [{ algorithm: 'wall-walking', turn: 'right' }], ...props }),
    '10:Trémaux': (props) =>
      new Roboto({ robots: [{ algorithm: 'tremaux', showMarks: true }], ...props }),
    '10:Backtracking': (props) =>
      new Roboto({
        robots: [{ algorithm: 'backtracking', program: 'random', trails: 0 }],
        ...props,
      }),
    '10:The great race': (props) =>
      new Roboto({
        robots: [
          { algorithm: 'wall-walking', turn: 'right', color: 'lime' },
          { algorithm: 'wall-walking', turn: 'left', color: 'magenta' },
          { algorithm: 'tremaux', color: 'blue', showMarks: false },
          { algorithm: 'backtracking', color: 'red', program: 'random' },
        ],
        ...props,
      }),
    '10:Backtracler tag': (props) =>
      new Roboto({
        robots: [
          { name: 'rando', algorithm: 'backtracking', program: 'random', color: 'lime' },
          { name: 'south-paw', algorithm: 'backtracking', program: 'left-turn', color: 'magenta' },
          { name: 'righty', algorithm: 'backtracking', program: 'right-turn', color: 'yellow' },
          {
            name: 'straight arrow',
            algorithm: 'backtracking',
            program: 'straight',
            color: 'orange',
          },
          { name: 'seeker', algorithm: 'backtracking', program: 'seek', color: 'blue' },
        ],
        ...props,
      }),
  },
  '0:Trémaux': {
    '10': (props) => new Tremaux(props),
  },
  '0:Search': {
    '1:Random': (props) => new Search({ program: 'random', ...props }),
    '1:Seek Exit': (props) => new Search({ program: 'seek', ...props }),
    '1:Left Turn': (props) => new Search({ program: 'left-turn', ...props }),
    '1:Right Turn': (props) => new Search({ program: 'right-turn', ...props }),
    '1:Straight': (props) => new Search({ program: 'straight', ...props }),
  },
  '0:Fill': {
    '1:Dead Ends': (props) => new Filler({ ...props, method: 'dead-end' }),
    '1:Cul-de-Sac': (props) => new Filler({ ...props, method: 'cul-de-sac' }),
  },
  '0': {
    '1:Follow the Right Wall': (props) => new WallWalking({ ...props, turn: 'right' }),
    '1:Follow the Left Wall': (props) => new WallWalking({ ...props, turn: 'left' }),
  },
  '0:Chain': {
    '10:Wall-Walking': (props) => new Chain({ ...props, robot: 'wall-walking' }),
    '10:Backtracking': (props) => new Chain({ ...props, robot: 'backtracking' }),
  },
  "0:Dijkstra's": {
    '10': (props) => new Dijkstras(props),
  },
  "0:Drunkard's Walk": (props) => new DrunkardsWalk(props),
  '0:Random Mouse': (props) => new RandomMouse({ ...props }),
  "0:Fibonacci's Rabbits": (props) => new FibonaccisRabbits(props),
};

export const plugins: Choice<Maze, void> = {
  '0:portal:': portalPlugin,
  '0:experimental bridges': experimentalPlugin,
  '0:ellipse': ellipisePlugin,
  '0:donut': donutPlugin,
  '0:triangle': trianglePlugin,
};
