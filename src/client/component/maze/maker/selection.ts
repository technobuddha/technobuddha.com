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
} from '#maze/generator';
import {
  BrickMaze,
  CircularMaze,
  CubicMaze,
  DotMaze,
  HexagonMaze,
  type Maze,
  type MazeProperties,
  OctagonDiamond,
  OctagonSquare,
  PentagonMaze,
  type ShowDistances,
  SquareMaze,
  TriangleMaze,
  WedgeMaze,
  ZetaMaze,
} from '#maze/geometry';
import {
  Chain,
  FibonaccisRabbits,
  Filler,
  type MazeSolver,
  type MazeSolverProperties,
  Roboto,
} from '#maze/solver';

type GeometrySelection = {
  title: string;
  weight: number;
  variations: GeometryVariation[];
  sizes: GeometrySize[];
};

type GeometryVariation = {
  title: string;
  weight: number;
  maker: (props: MazeProperties) => Maze;
};

type GeometrySize = {
  title: string;
  weight: number;
  cellSize: number;
  wallSize: number;
  voidSize: number;
};

export const geometries: GeometrySelection[] = [
  {
    title: 'Brick',
    weight: 1,
    variations: [{ title: 'Brick', weight: 1, maker: (props) => new BrickMaze(props) }],
    sizes: [
      { title: 'Brick', weight: 1, cellSize: 20, wallSize: 1, voidSize: 1 },
      { title: 'Large', weight: 1, cellSize: 32, wallSize: 2, voidSize: 4 },
    ],
  },
  {
    title: 'Circular',
    weight: 1,
    variations: [
      { title: 'Circular', weight: 1, maker: (props) => new CircularMaze(props) },
      {
        title: 'Center Exit',
        weight: 1,

        maker: (props) =>
          new CircularMaze({ ...props, exit: { x: 0, y: 0 }, entrance: 'random edge' }),
      },
      {
        title: 'Center Entrance',
        weight: 1,

        maker: (props) =>
          new CircularMaze({ ...props, entrance: { x: 0, y: 0 }, exit: 'random edge' }),
      },
      {
        title: 'The Void',
        weight: 1,

        maker: (props) => new CircularMaze({ ...props, centerRadius: 128, centerSegments: 16 }),
      },
    ],
    sizes: [
      { title: 'Circular', weight: 1, cellSize: 18, wallSize: 2, voidSize: 2 },
      { title: 'Large', weight: 1, cellSize: 30, wallSize: 3, voidSize: 3 },
      { title: 'Small', weight: 1, cellSize: 14, wallSize: 1, voidSize: 1 },
    ],
  },
  {
    title: 'Cubic',
    weight: 1,
    variations: [{ title: 'Cubic', weight: 1, maker: (props) => new CubicMaze(props) }],
    sizes: [{ title: 'Cubic', weight: 1, cellSize: 28, wallSize: 2, voidSize: 2 }],
  },
  {
    title: 'Dot',
    weight: 1,
    variations: [
      { title: 'Dot', weight: 1, maker: (props) => new DotMaze(props) },
      { title: 'Zeta', weight: 1, maker: (props) => new ZetaMaze(props) },
    ],
    sizes: [{ title: 'Dot', weight: 1, cellSize: 32, wallSize: 8, voidSize: 2 }],
  },
  {
    title: 'Hexagon',
    weight: 1,
    variations: [{ title: 'Hexagon', weight: 1, maker: (props) => new HexagonMaze(props) }],
    sizes: [{ title: 'Hexagon', weight: 1, cellSize: 40, wallSize: 2, voidSize: 2 }],
  },
  {
    title: 'Octagon',
    weight: 1,
    variations: [
      { title: 'Diamond', weight: 1, maker: (props) => new OctagonDiamond(props) },
      { title: 'Square', weight: 1, maker: (props) => new OctagonSquare(props) },
    ],
    sizes: [{ title: 'Octagon', weight: 1, cellSize: 48, wallSize: 3, voidSize: 2 }],
  },
  {
    title: 'Pentagon',
    weight: 1,
    variations: [{ title: 'Pentagon', weight: 1, maker: (props) => new PentagonMaze(props) }],
    sizes: [{ title: 'Pentagon', weight: 1, cellSize: 28, wallSize: 2, voidSize: 1 }],
  },
  {
    title: 'Square',
    weight: 1,
    variations: [
      {
        title: 'Square',
        weight: 1,
        maker: (props) => new SquareMaze(props),
      },
    ],
    sizes: [
      { weight: 1, title: 'Square', cellSize: 28, wallSize: 2, voidSize: 2 },
      { weight: 1, title: 'Tiny', cellSize: 12, wallSize: 1, voidSize: 0 },
      { weight: 1, title: 'Tiny Weave', cellSize: 13, wallSize: 1, voidSize: 1 },
      {
        weight: 1,
        title: 'Large',
        cellSize: 32,
        wallSize: 1,
        voidSize: 0,
      },
      {
        weight: 1,
        title: 'Mine',
        cellSize: 24,
        wallSize: 6,
        voidSize: 0,
      },
    ],
  },
  {
    title: 'Triangle',
    weight: 1,
    variations: [{ title: 'Triangle', weight: 1, maker: (props) => new TriangleMaze(props) }],
    sizes: [
      { title: 'Triangle', weight: 1, cellSize: 32, wallSize: 2, voidSize: 1 },
      { title: 'Weave', weight: 1, cellSize: 42, wallSize: 2, voidSize: 2 },
    ],
  },
  {
    title: 'Wedge',
    weight: 1,
    variations: [{ title: 'Wedge', weight: 1, maker: (props) => new WedgeMaze(props) }],
    sizes: [{ title: 'Wedge', weight: 1, cellSize: 32, wallSize: 1, voidSize: 2 }],
  },
];

type DebugSelection = {
  title: string;
  weight: number;
  showCoordinates: boolean;
  showKind: boolean;
};

export const debugs: DebugSelection[] = [
  {
    title: 'None',
    weight: 1,
    showCoordinates: false,
    showKind: false,
  },
  {
    title: 'Coordinates',
    weight: 0,
    showCoordinates: true,
    showKind: false,
  },
  {
    title: 'Kind',
    weight: 0,
    showCoordinates: false,
    showKind: true,
  },
];

type GeneratorSelection = {
  title: string;
  weight: number;
  variations: GeneratorVariation[];
};

type GeneratorVariation = {
  title: string;
  weight: number;
  maker: (props: MazeGeneratorProperties) => MazeGenerator;
};

export const generators: GeneratorSelection[] = [
  {
    title: 'Division',
    weight: 1,
    variations: [{ title: 'Division', weight: 1, maker: (props) => new Division(props) }],
  },
  {
    title: 'Hunt & Kill',
    weight: 1,
    variations: [
      {
        title: 'Random',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'random', ...props }),
      },
      {
        title: 'Top Left',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'top-left', ...props }),
      },
      {
        title: 'Top Right',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'top-right', ...props }),
      },
      {
        title: 'Bottom Left',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'bottom-left', ...props }),
      },
      {
        title: 'Bottom Right',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'bottom-right', ...props }),
      },
      {
        title: 'Left Top',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'left-top', ...props }),
      },
      {
        title: 'Left Bottom',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'left-bottom', ...props }),
      },
      {
        title: 'Right Top',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'right-top', ...props }),
      },
      {
        title: 'Right Bottom',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
      },
      {
        title: 'Right Bottom',
        weight: 1,
        maker: (props) => new HuntAndKill({ huntMethod: 'right-bottom', ...props }),
      },
    ],
  },
  {
    title: 'Growing Tree',
    weight: 1,
    variations: [
      {
        title: 'Newest',
        weight: 1,
        maker: (props) => new GrowingTree({ method: 'newest', ...props }),
      },
      {
        title: 'Random',
        weight: 1,
        maker: (props) => new GrowingTree({ method: 'random', ...props }),
      },
      {
        title: 'Oldest',
        weight: 0,
        maker: (props) => new GrowingTree({ method: 'oldest', ...props }),
      },
      {
        title: 'Middle',
        weight: 0,
        maker: (props) => new GrowingTree({ method: 'middle', ...props }),
      },
    ],
  },
  {
    title: 'Kruskals',
    weight: 1,
    variations: [
      {
        title: 'Kruskals',
        weight: 1,
        maker: (props) => new Kruskals(props),
      },
    ],
  },
  {
    title: 'Prims',
    weight: 1,
    variations: [
      {
        title: 'Prims',
        weight: 1,
        maker: (props) => new Prims(props),
      },
    ],
  },
  {
    title: 'Backtracker',
    weight: 1,
    variations: [
      {
        title: 'Backtracker',
        weight: 1,
        maker: (props) => new RecursiveBacktracker(props),
      },
      {
        title: 'Parallel',
        weight: 1,
        maker: (props) => new RecursiveBacktracker({ ...props, parallel: 2 }),
      },
      {
        title: 'Swirl',
        weight: 1,
        maker: (props) =>
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
      },
      {
        title: 'Whirlpool',
        weight: 1,
        maker: (props) =>
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
    ],
  },
  {
    title: 'Bridge Builder',
    weight: 0,
    variations: [
      {
        title: 'Weave',
        weight: 1,
        maker: (props) =>
          new RecursiveBacktracker({
            strategy: ['bridge-builder'],
            forced: 0.25,
            bridgeMinLength: 1,
            bridgeMaxLength: 1,
            stepsAfterBridge: 0,
            ...props,
          }),
      },
      {
        title: 'Long Bridges',
        weight: 1,
        maker: (props) =>
          new RecursiveBacktracker({
            strategy: ['bridge-builder'],
            forced: 0.25,
            bridgeMinLength: 5,
            bridgeMaxLength: 15,
            stepsAfterBridge: 5,
            ...props,
          }),
      },
      {
        title: 'One Huge Bridge',
        weight: 1,
        maker: (props) =>
          new RecursiveBacktracker({
            strategy: ['bridge-builder'],
            forced: 0.25,
            bridgeMinLength: 15,
            bridgeMaxLength: Infinity,
            stepsAfterBridge: Infinity,
            ...props,
          }),
      },
    ],
  },
  {
    title: 'Wilsons',
    weight: 1,
    variations: [
      {
        title: 'Wilsons',
        weight: 1,
        maker: (props) => new Wilsons(props),
      },
    ],
  },
];

type SolverSelection = {
  title: string;
  weight: number;
  variations: SolverVariation[];
};

type SolverVariation = {
  title: string;
  weight: number;
  maker: (props: MazeSolverProperties) => MazeSolver;
};

export const solvers: SolverSelection[] = [
  {
    title: 'Wall Walking',
    weight: 1,
    variations: [
      {
        title: 'Right',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [{ algorithm: 'wall-walking', turn: 'right', trails: 20 }],
          }),
      },
      {
        title: 'Left',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [{ algorithm: 'wall-walking', turn: 'left', trails: 20 }],
          }),
      },
    ],
  },
  {
    title: 'Trémaux',
    weight: 1,
    variations: [
      {
        title: 'Trémaux',
        weight: 1,
        maker: (props) =>
          new Roboto({ ...props, robots: [{ algorithm: 'tremaux', showMarks: true }] }),
      },
    ],
  },
  {
    title: 'Backtracking',
    weight: 1,
    variations: [
      {
        title: 'Random',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'random', showMarks: true, showPath: true },
            ],
          }),
      },
      {
        title: 'Left Turn',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'left-turn', showMarks: true, showPath: true },
            ],
          }),
      },
      {
        title: 'Right Turn',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'right-turn', showMarks: true, showPath: true },
            ],
          }),
      },
      {
        title: 'Straight',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'straight', showMarks: true, showPath: true },
            ],
          }),
      },
      {
        title: 'Seek Exit',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'seek', showMarks: true, showPath: true },
            ],
          }),
      },
    ],
  },
  {
    title: 'Random Mouse',
    weight: 0,
    variations: [
      {
        title: 'Random Mouse',
        weight: 1,
        maker: (props) =>
          new Roboto({ ...props, robots: [{ algorithm: 'random-mouse', trails: 20 }] }),
      },
    ],
  },
  {
    title: 'Wacky Race',
    weight: 1,
    variations: [
      {
        title: 'Backtracking vs. Trémaux',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'random', color: 'lime' },
              {
                algorithm: 'backtracking',
                program: 'left-turn',
                color: 'dodgerblue',
              },
              {
                algorithm: 'backtracking',
                program: 'right-turn',
                color: 'red',
              },
              {
                algorithm: 'backtracking',
                program: 'straight',
                color: 'magenta',
              },
              {
                algorithm: 'backtracking',
                program: 'seek',
                color: 'yellow',
              },
              { algorithm: 'tremaux', program: 'random', color: 'lime', showMarks: false },
              {
                algorithm: 'tremaux',
                program: 'left-turn',
                color: 'dodgerblue',
                showMarks: false,
              },
              {
                algorithm: 'tremaux',
                program: 'right-turn',
                color: 'red',
                showMarks: false,
              },
              {
                algorithm: 'tremaux',
                program: 'straight',
                color: 'magenta',
                showMarks: false,
              },
              {
                algorithm: 'tremaux',
                program: 'seek',
                color: 'yellow',
                showMarks: false,
              },
              // { algorithm: 'random-mouse', color: 'gray' },
              // {
              //   name: 'wall-right',
              //   trails: 0,
              //   algorithm: 'wall-walking',
              //   turn: 'right',
              //   color: 'pink',
              // },
              // { name: 'wall-left', algorithm: 'wall-walking', turn: 'left', color: 'cyan' },
            ],
          }),
      },
      {
        title: 'Backtracking vs. Dijkstra',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'backtracking', program: 'random', color: 'lime', trails: 10 },
              { algorithm: 'dijkstras', color: 'magenta', trails: 10 },
            ],
          }),
      },
    ],
  },
  {
    title: 'Filler',
    weight: 1,
    variations: [
      {
        title: 'Dead End',
        weight: 1,
        maker: (props) => new Filler({ ...props, method: 'dead-end' }),
      },
      {
        title: 'Blind Alley',
        weight: 1,
        maker: (props) => new Filler({ ...props, method: 'blind-alley' }),
      },
    ],
  },
  {
    title: 'Chain',
    weight: 1,
    variations: [
      {
        title: 'Wall-Walking',
        weight: 1,
        maker: (props) => new Chain({ ...props, robot: 'wall-walking' }),
      },
      {
        title: 'Backtracking',
        weight: 1,
        maker: (props) => new Chain({ ...props, robot: 'backtracking' }),
      },
      {
        title: 'Tremaux',
        weight: 1,
        maker: (props) => new Chain({ ...props, robot: 'tremaux' }),
      },
    ],
  },
  {
    title: "Dijkstra's",
    weight: 1,
    variations: [
      {
        title: "Dijkstra's",
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [{ algorithm: 'dijkstras', color: 'lime', showMarks: true }],
          }),
      },
    ],
  },
  {
    title: 'Pledge',
    weight: 0,
    variations: [
      {
        title: 'Pledge',
        weight: 1,
        maker: (props) =>
          new Roboto({
            ...props,
            robots: [
              { algorithm: 'pledge', color: 'lime', turn: 'right' },
              { algorithm: 'wall-walking', turn: 'right', color: 'magenta' },
            ],
          }),
      },
    ],
  },
  {
    title: "Drunkard's Walk",
    weight: 0,
    variations: [
      {
        title: "Drunkard's Walk",
        weight: 1,
        maker: (props) => new Roboto({ ...props, robots: [{ algorithm: 'drunkards-walk' }] }),
      },
    ],
  },
  {
    title: "Fibonacci's Rabbits",
    weight: 0,
    variations: [
      {
        title: "Fibonacci's Rabbits",
        weight: 1,
        maker: (props) => new FibonaccisRabbits(props),
      },
    ],
  },
];

export const wraparounds: {
  weight: number;
  title: string;
  wrapHorizontal: boolean;
  wrapVertical: boolean;
}[] = [
  {
    weight: 12,
    title: 'None',
    wrapHorizontal: false,
    wrapVertical: false,
  },
  {
    weight: 1,
    title: 'Horizontal',
    wrapHorizontal: true,
    wrapVertical: false,
  },
  {
    weight: 1,
    title: 'Vertical',
    wrapHorizontal: false,
    wrapVertical: true,
  },
  {
    weight: 1,
    title: 'Both',
    wrapHorizontal: true,
    wrapVertical: true,
  },
];

export const distances: { weight: number; title: string; showDistances: ShowDistances }[] = [
  {
    weight: 1,
    title: 'None',
    showDistances: 'none',
  },
  {
    weight: 0,
    title: 'Greyscale',
    showDistances: 'greyscale',
  },
  {
    weight: 0,
    title: 'Color',
    showDistances: 'primary',
  },
  {
    weight: 0,
    title: 'Spectrum',
    showDistances: 'spectrum',
  },
];

export const braids: { weight: number; title: string; braiding: number }[] = [
  {
    weight: 12,
    title: 'None',
    braiding: 0,
  },
  {
    weight: 1,
    title: 'Light Braiding',
    braiding: 0.5,
  },
  {
    weight: 1,
    title: 'Medium Braiding',
    braiding: 0.75,
  },
  {
    weight: 1,
    title: 'Full Braiding',
    braiding: 1,
  },
];
