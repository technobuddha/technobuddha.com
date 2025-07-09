import {
  Division,
  type DivisionProperties,
  GrowingTree,
  type GrowingTreeProperties,
  HuntAndKill,
  type HuntAndKillProperties,
  Kruskals,
  type KruskalsProperties,
  Prims,
  type PrimsProperties,
  RecursiveBacktracker,
  type RecursiveBacktrackerProperties,
  Wilsons,
  type WilsonsProperties,
} from '../generator/index.ts';
import {
  BrickMaze,
  type BrickMazeProperties,
  CircularMaze,
  type CircularMazeProperties,
  CubicMaze,
  type CubicMazeProperties,
  DotMaze,
  type DotMazeProperties,
  HexagonMaze,
  type HexagonMazeProperties,
  type Maze,
  OctogonMaze,
  type OctogonMazeProperties,
  PentagonMaze,
  type PentagonMazeProperties,
  SquareMaze,
  type SquareMazeProperties,
  TriangleMaze,
  type TriangleMazeProperties,
  WedgeMaze,
  type WedgeMazeProperties,
  ZetaMaze,
  type ZetaMazeProperties,
} from '../geometry/index.ts';
import { type Choices } from '../library/index.ts';
import { donutPlugin, ellipisePlugin, portalPlugin, trianglePlugin } from '../plugins/index.ts';
import {
  Chain,
  type ChainProperties,
  Dijkstras,
  type DijkstrasProperties,
  DrunkardsWalk,
  type DrunkardsWalkProperties,
  FibonaccisRabbits,
  type FibonaccisRabbitsProperties,
  Filler,
  type FillerProperties,
  Roboto,
  type RobotoProperties,
} from '../solver/index.ts';

type PropsMazeGeometry =
  | ({ geometry: typeof BrickMaze } & BrickMazeProperties)
  | ({ geometry: typeof CircularMaze } & CircularMazeProperties)
  | ({ geometry: typeof CubicMaze } & CubicMazeProperties)
  | ({ geometry: typeof DotMaze } & DotMazeProperties)
  | ({ geometry: typeof HexagonMaze } & HexagonMazeProperties)
  | ({ geometry: typeof OctogonMaze } & OctogonMazeProperties)
  | ({ geometry: typeof PentagonMaze } & PentagonMazeProperties)
  | ({ geometry: typeof SquareMaze } & SquareMazeProperties)
  | ({ geometry: typeof TriangleMaze } & TriangleMazeProperties)
  | ({ geometry: typeof WedgeMaze } & WedgeMazeProperties)
  | ({ geometry: typeof ZetaMaze } & ZetaMazeProperties);

export const mazes: Choices<PropsMazeGeometry> = [
  {
    weight: 1,
    title: 'Dot',
    props: {
      geometry: DotMaze,
    },
  },
  {
    weight: 1,
    title: 'Zeta',
    props: {
      geometry: ZetaMaze,
    },
  },
  {
    weight: 1,
    items: [
      {
        weight: 1,
        title: 'Circle',
        props: { geometry: CircularMaze },
      },
      {
        weight: 1,
        title: 'Circle (Center Exit)',
        props: {
          geometry: CircularMaze,
          exit: { x: 0, y: 0 },
          entrance: 'random edge',
        },
      },
      {
        weight: 1,
        title: 'Circle (Center Entrance)',
        props: { geometry: CircularMaze, entrance: { x: 0, y: 0 }, exit: 'random edge' },
      },
      {
        weight: 1,
        title: 'Circle (The Void)',
        props: { geometry: CircularMaze, centerRadius: 128, centerSegments: 16 },
      },
    ],
  },
  {
    weight: 1,
    title: 'Cubic',
    props: { geometry: CubicMaze },
  },
  {
    weight: 1,
    title: 'Pentagon',
    props: { geometry: PentagonMaze },
  },
  {
    weight: 1,
    title: 'Brick',
    props: { geometry: BrickMaze },
  },
  {
    weight: 1,
    title: 'Square',
    props: { geometry: SquareMaze },
  },
  {
    weight: 1,
    title: 'Triangle',
    props: { geometry: TriangleMaze },
  },
  {
    weight: 1,
    title: 'Hexagon',
    props: { geometry: HexagonMaze },
  },
  {
    weight: 1,
    title: 'Octogon',
    props: { geometry: OctogonMaze },
  },
  {
    weight: 1,
    title: 'Wedge',
    props: { geometry: WedgeMaze },
  },
];

type PropsMazeGenerator =
  | ({ generator: typeof Division } & Omit<DivisionProperties, 'maze'>)
  | ({ generator: typeof HuntAndKill } & Omit<HuntAndKillProperties, 'maze'>)
  | ({ generator: typeof GrowingTree } & Omit<GrowingTreeProperties, 'maze'>)
  | ({ generator: typeof Kruskals } & Omit<KruskalsProperties, 'maze'>)
  | ({ generator: typeof Prims } & Omit<PrimsProperties, 'maze'>)
  | ({ generator: typeof RecursiveBacktracker } & Omit<RecursiveBacktrackerProperties, 'maze'>)
  | ({ generator: typeof Wilsons } & Omit<WilsonsProperties, 'maze'>);

export const generators: Choices<PropsMazeGenerator> = [
  {
    weight: 1,
    title: 'Division',
    props: {
      generator: Division,
    },
  },
  {
    weight: 1,
    items: [
      {
        weight: 1,
        title: 'Hunt & Kill (Random)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'random',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Top Left)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'top-left',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Top Right)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'top-right',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Bottom Left)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'bottom-left',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Bottom Right)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'bottom-right',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Left Top)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'left-top',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Left Bottom)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'left-bottom',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Right Top)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'right-top',
        },
      },
      {
        weight: 1,
        title: 'Hunt & Kill (Right Bottom)',
        props: {
          generator: HuntAndKill,
          huntMethod: 'right-bottom',
        },
      },
    ],
  },
  {
    weight: 1,
    items: [
      {
        weight: 1,
        title: 'Growing Tree (Newest)',
        props: {
          generator: GrowingTree,
          method: 'newest',
        },
      },
      {
        weight: 1,
        title: 'Growing Tree (Random)',
        props: {
          generator: GrowingTree,
          method: 'random',
        },
      },
      {
        weight: 0,
        title: 'Growing Tree (Oldest)',
        props: {
          generator: GrowingTree,
          method: 'oldest',
        },
      },
      {
        weight: 0,
        title: 'Growing Tree (Middle)',
        props: {
          generator: GrowingTree,
          method: 'middle',
        },
      },
    ],
  },
  {
    weight: 1,
    title: 'Kruskals',
    props: {
      generator: Kruskals,
    },
  },
  {
    weight: 1,
    title: 'Prims',
    props: {
      generator: Prims,
    },
  },
  {
    weight: 1,
    items: [
      {
        weight: 1,
        title: 'Recursive Backtracker',
        props: {
          generator: RecursiveBacktracker,
          speed: 1,
        },
      },
      {
        weight: 1,
        title: 'Parallel',
        props: {
          generator: RecursiveBacktracker,
          parallel: 2,
        },
      },
      {
        weight: 1,
        title: 'Swirl',
        props: {
          generator: RecursiveBacktracker,
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
        },
      },
      {
        weight: 1,
        title: 'Whirpool',
        props: {
          generator: RecursiveBacktracker,
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
        },
      },
    ],
  },
  {
    weight: 0,
    title: 'Bridge Builder',
    props: {
      generator: RecursiveBacktracker,
      strategy: ['bridge-builder'],
      forced: 0.25,
      bridgeMinLength: 1,
      bridgeMaxLength: 1,
      stepsAfterBridge: 1,
    },
  },
  {
    weight: 1,
    title: 'Wilsons',
    props: {
      generator: Wilsons,
    },
  },
];

type PropsMazeSolver =
  | ({ solver: typeof Roboto } & Omit<RobotoProperties, 'maze'>)
  | ({ solver: typeof Filler } & Omit<FillerProperties, 'maze'>)
  | ({ solver: typeof Chain } & Omit<ChainProperties, 'maze'>)
  | ({ solver: typeof Dijkstras } & Omit<DijkstrasProperties, 'maze'>)
  | ({ solver: typeof DrunkardsWalk } & Omit<DrunkardsWalkProperties, 'maze'>)
  | ({ solver: typeof FibonaccisRabbits } & Omit<FibonaccisRabbitsProperties, 'maze'>);

export const solvers: Choices<PropsMazeSolver> = [
  {
    weight: 100,
    items: [
      {
        weight: 1,
        title: 'Follow the Right Wall',
        props: {
          solver: Roboto,
          robots: [{ algorithm: 'wall-walking', turn: 'right', trails: 20 }],
        },
      },
      {
        weight: 1,
        title: 'Follow the Left Wall',
        props: {
          solver: Roboto,
          robots: [{ algorithm: 'wall-walking', turn: 'left', trails: 20 }],
        },
      },
    ],
  },
  {
    weight: 100,
    title: 'Trémaux',
    props: {
      solver: Roboto,
      robots: [{ algorithm: 'tremaux', showMarks: true }],
    },
  },
  {
    weight: 100,
    items: [
      {
        weight: 1,
        title: 'Backtracking (Random)',
        props: {
          solver: Roboto,
          robots: [
            { algorithm: 'backtracking', program: 'random', showMarks: true, showPath: true },
          ],
        },
      },
      {
        weight: 1,
        title: 'Backtracking (Left Turn)',
        props: {
          solver: Roboto,
          robots: [
            { algorithm: 'backtracking', program: 'left-turn', showMarks: true, showPath: true },
          ],
        },
      },
      {
        weight: 1,
        title: 'Backtracking (Right Turn)',
        props: {
          solver: Roboto,
          robots: [
            { algorithm: 'backtracking', program: 'right-turn', showMarks: true, showPath: true },
          ],
        },
      },
      {
        weight: 1,
        title: 'Backtracking (Straight)',
        props: {
          solver: Roboto,
          robots: [
            { algorithm: 'backtracking', program: 'straight', showMarks: true, showPath: true },
          ],
        },
      },
      {
        weight: 1,
        title: 'Backtracking (Seek Exit)',
        props: {
          solver: Roboto,
          robots: [{ algorithm: 'backtracking', program: 'seek', showMarks: true, showPath: true }],
        },
      },
    ],
  },
  {
    weight: 0,
    title: 'Random Mouse',
    props: {
      solver: Roboto,
      robots: [{ algorithm: 'random-mouse', trails: 20 }],
    },
  },
  {
    weight: 100,
    title: 'The Great Race',
    props: {
      solver: Roboto,
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
    },
  },
  {
    weight: 100,
    items: [
      {
        weight: 1,
        title: 'Dead End Filler',
        props: {
          solver: Filler,
          method: 'dead-end',
        },
      },
      {
        weight: 1,
        title: 'Blind Alley Filler',
        props: {
          solver: Filler,
          method: 'cul-de-sac',
        },
      },
    ],
  },
  {
    weight: 100,
    items: [
      {
        weight: 1,
        title: 'Chain (Wall-Walking)',
        props: {
          solver: Chain,
          robot: 'wall-walking',
        },
      },
      {
        weight: 1,
        title: 'Chain (Backtracking)',
        props: {
          solver: Chain,
          robot: 'backtracking',
        },
      },
      {
        weight: 1,
        title: 'Chain (Tremaux)',
        props: {
          solver: Chain,
          robot: 'tremaux',
        },
      },
    ],
  },
  {
    weight: 100,
    title: "Dijkstra's",
    props: {
      solver: Dijkstras,
    },
  },
  {
    weight: 0,
    title: "Drunkard's Walk",
    props: {
      solver: DrunkardsWalk,
    },
  },
  {
    weight: 0,
    title: "Fibonacci's Rabbits",
    props: {
      solver: FibonaccisRabbits,
    },
  },
];

type PluginProps = {
  plugin: (maze: Maze) => void;
};

export const plugins: Choices<PluginProps> = [
  {
    weight: 0,
    title: 'Portal',
    props: { plugin: portalPlugin },
  },
  {
    weight: 0,
    title: 'Ellipse',
    props: { plugin: ellipisePlugin },
  },
  {
    weight: 0,
    title: 'Donut',
    props: { plugin: donutPlugin },
  },
  {
    weight: 0,
    title: 'Triangle',
    props: { plugin: trianglePlugin },
  },
];
