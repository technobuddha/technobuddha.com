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
  HexagonMaze,
  type Maze,
  type MazeProperties,
  OctogonMaze,
  PentagonMaze,
  SquareMaze,
  TriangleMaze,
  WedgeMaze,
} from '../maze/index.ts';
import { donutPlugin, ellipisePlugin, trianglePlugin } from '../plugins/index.ts';
import {
  Dijkstras,
  Filler,
  type MazeSolver,
  type MazeSolverProperties,
  Search,
  Tremaux,
  WallWalking,
} from '../solver/index.ts';

import { type Choice } from './chooser.ts';

export const squareMazes: Choice<MazeProperties, Maze> = {
  '1': (props) => new SquareMaze(props),
};

export const mazes: Choice<MazeProperties, Maze> = {
  '10:circle': (props) => new CircularMaze(props),
  '3:cubic': {
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
  '1:division': {
    '1': (props) => new Division(props),
    '0:9 threshold': (props) => new Division({ threshold: 9, ...props }),
    '0:27 threshold': (props) => new Division({ threshold: 27, ...props }),
    '0:81 threshold': (props) => new Division({ threshold: 81, ...props }),
  },
  '1:huntAndKill': {
    '1:random': (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
    '1:topLeft': (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
    '1:topRight': (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
    '1:bottomLeft': (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
    '1:bottomRight': (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
    '1:leftTop': (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
    '1:leftBottom': (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
    '1:rightTop': (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
    '1:rightBottom': (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
  },
  '1:growingTree': {
    '1:newest': (props) => new GrowingTree({ method: 'newest', ...props }),
    '1:random': (props) => new GrowingTree({ method: 'random', ...props }),
    '0:oldest': (props) => new GrowingTree({ method: 'oldest', ...props }),
    '0:middle': (props) => new GrowingTree({ method: 'middle', ...props }),
  },
  '1:kruskals': {
    '1': (props) => new Kruskals(props),
  },
  '1:prims': {
    '1': (props) => new Prims(props),
  },
  '1:recursizeBacktracker': {
    '1': (props) => new RecursiveBacktracker({ speed: 1, ...props }),
    '1:parallel': (props) => new RecursiveBacktracker({ parallel: 2, ...props }),
    '1:swirl': (props) =>
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
    '1:whirpool': (props) =>
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
  '1:wilsons': {
    '1': (props) => new Wilsons(props),
  },
};

export const solvers: Choice<MazeSolverProperties, MazeSolver> = {
  '1:trémaux': {
    '1': (props) => new Tremaux(props),
  },
  '1:search': {
    '1:random': (props) => new Search({ method: 'random', ...props }),
    '1:seekExit': (props) => new Search({ method: 'seek', ...props }),
    '1:leftTurn': (props) => new Search({ method: 'left-turn', ...props }),
    '1:rightTurn': (props) => new Search({ method: 'right-turn', ...props }),
  },
  '1:fill': {
    '1:deadEnd': (props) => new Filler({ ...props, method: 'dead-end' }),
    '1:culDeSac': (props) => new Filler({ ...props, method: 'cul-de-sac' }),
  },
  '1:followWall': {
    '1:right': (props) => new WallWalking({ ...props, turn: 'right' }),
    '1:left': (props) => new WallWalking({ ...props, turn: 'left' }),
  },
  '1:dijkstras': {
    '1': (props) => new Dijkstras(props),
  },
};

export const plugins: Choice<Maze, void> = {
  '0:ellipse': ellipisePlugin,
  '0:donut': donutPlugin,
  '0:triangle': trianglePlugin,
};
