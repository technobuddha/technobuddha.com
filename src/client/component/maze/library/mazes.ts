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
import { WeaveMaze } from '../geometry/weave-maze.ts';
import { experimentalPlugin } from '../plugins/experiment.ts';
import { donutPlugin, ellipisePlugin, trianglePlugin } from '../plugins/index.ts';
import { portalPlugin } from '../plugins/portal.ts';
import { DrunkardsWalk } from '../solver/drunkard.ts';
import { FibonaccisRabbits } from '../solver/fibonaccis-rabbits.ts';
import {
  Dijkstras,
  Filler,
  type MazeSolver,
  type MazeSolverProperties,
  Search,
  Tremaux,
  WallWalking,
} from '../solver/index.ts';
import { RandomMouse } from '../solver/random-mouse.ts';

import { type Choice } from './chooser.ts';

export const squareMazes: Choice<MazeProperties, Maze> = {
  '1': (props) => new SquareMaze(props),
};

export const mazes: Choice<MazeProperties, Maze> = {
  '10:weave': (props) => new WeaveMaze({ ...props }),
  '10:dot': {
    '10': (props) => new DotMaze(props),
    '10:zeta': (props) => new ZetaMaze(props),
  },
  '10:circle': {
    '10': (props) => new CircularMaze(props),
    '10:Find Center': (props) =>
      new CircularMaze({ exit: { x: 0, y: 0 }, entrance: 'random edge', ...props }),
    '10:Escape': (props) =>
      new CircularMaze({ entrance: { x: 0, y: 0 }, exit: 'random edge', ...props }),
    '10:Void': (props) => new CircularMaze({ centerRadius: 128, centerSegments: 16, ...props }),
  },
  '1:cubic': {
    '10': (props) => new CubicMaze(props),
  },
  '10:pentagon': {
    '10': (props) => new PentagonMaze(props),
  },
  '10:brick': (props) => new BrickMaze(props),
  '10:square': squareMazes,
  '10:triangle': {
    '10': (props) => new TriangleMaze(props),
  },
  '10:hexagon': {
    '10': (props) => new HexagonMaze(props),
  },
  '10:octogon': {
    '10': (props) => new OctogonMaze(props),
  },
  '10:wedge': (props) => new WedgeMaze(props),
};

export const generators: Choice<MazeGeneratorProperties, MazeGenerator> = {
  '10:division': {
    '10': (props) => new Division(props),
    '0:9 threshold': (props) => new Division({ threshold: 9, ...props }),
    '0:27 threshold': (props) => new Division({ threshold: 27, ...props }),
    '0:81 threshold': (props) => new Division({ threshold: 81, ...props }),
  },
  '10:huntAndKill': {
    '10:random': (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
    '10:topLeft': (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
    '10:topRight': (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
    '10:bottomLeft': (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
    '10:bottomRight': (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
    '10:leftTop': (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
    '10:leftBottom': (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
    '10:rightTop': (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
    '10:rightBottom': (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
  },
  '10:growingTree': {
    '10:newest': (props) => new GrowingTree({ method: 'newest', ...props }),
    '10:random': (props) => new GrowingTree({ method: 'random', ...props }),
    '0:oldest': (props) => new GrowingTree({ method: 'oldest', ...props }),
    '0:middle': (props) => new GrowingTree({ method: 'middle', ...props }),
  },
  '10:kruskals': {
    '10': (props) => new Kruskals(props),
  },
  '10:prims': {
    '10': (props) => new Prims(props),
  },
  '10:recursizeBacktracker': {
    '10': (props) => new RecursiveBacktracker({ speed: 1, ...props }),
    '0:bridge': (props) =>
      new RecursiveBacktracker({
        strategy: ['bridge-builder'],
        ...props,
      }),
    '10:parallel': (props) => new RecursiveBacktracker({ parallel: 2, ...props }),
    '10:swirl': (props) =>
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
    '10:whirpool': (props) =>
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
  '10:wilsons': {
    '10': (props) => new Wilsons(props),
  },
};

export const solvers: Choice<MazeSolverProperties, MazeSolver> = {
  '10:trémaux': {
    '10': (props) => new Tremaux(props),
  },
  '10:search': {
    '10:random': (props) => new Search({ method: 'random', ...props }),
    '10:seekExit': (props) => new Search({ method: 'seek', ...props }),
    '10:leftTurn': (props) => new Search({ method: 'left-turn', ...props }),
    '10:rightTurn': (props) => new Search({ method: 'right-turn', ...props }),
  },
  '10:fill': {
    '10:deadEnd': (props) => new Filler({ ...props, method: 'dead-end' }),
    '10:culDeSac': (props) => new Filler({ ...props, method: 'cul-de-sac' }),
  },
  '10:followWall': {
    '10:right': (props) => new WallWalking({ ...props, turn: 'right' }),
    '10:left': (props) => new WallWalking({ ...props, turn: 'left' }),
  },
  '10:dijkstras': {
    '10': (props) => new Dijkstras(props),
  },
  "0:Drunkard's Walk": (props) => new DrunkardsWalk(props),
  '0:Random Mouse': (props) => new RandomMouse({ ...props }),
  "0:Fibonacci's rabbits": (props) => new FibonaccisRabbits(props),
};

export const plugins: Choice<Maze, void> = {
  '0:portal:': portalPlugin,
  '0:experimental bridges': experimentalPlugin,
  '0:ellipse': ellipisePlugin,
  '0:donut': donutPlugin,
  '0:triangle': trianglePlugin,
};
