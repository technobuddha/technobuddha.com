// import Color                from '#component/color';
import type React from 'react';
import { type IconType } from 'react-icons';
import {
  GiChessKnight,
  GiConwayLifeGlider,
  GiHouse,
  GiMaze,
  GiMusicalNotes,
  GiOilySpiral,
  GiOrbital,
  GiPalette,
} from 'react-icons/gi';
// import { GiMusicalNotes } from 'react-icons/gi';
import { HiColorSwatch } from 'react-icons/hi';

// import Music                from '#component/music';
import { Chaos } from '#component/chaos';
import { Color } from '#component/color';
import { Home } from '#component/home';
import { Knight } from '#component/knight';
import { Life } from '#component/life';
import { MazeDebugger, MazeMaker } from '#component/maze';
import { NBody } from '#component/n-body';
import { Theme } from '#component/theme';
import { type TFunction } from '#context/i18n';

export type Component = {
  active: boolean;
  name: string;
  icon: IconType;
  primary: string;
  secondary?: string;
  location: string;
  component: React.ComponentType;
  description?: React.ReactElement;
  todo?: string[];
};

export const components: (t: TFunction) => Component[] = (t) => [
  {
    active: true,
    name: 'home',
    icon: GiHouse,
    primary: t('Home'),
    location: '/home',
    description: (
      <div>
        <div>
          Learn some things about the Technobuddha, and delve into his various projects designed
          soley for his amusement (though you might be amused also).
        </div>
        <div>
          The maze generator and solver can be seen in the background, you can get more interesting
          mazes on the <a href="/maze">Mazes Page</a>
        </div>
        <div>
          The source code for this website can be found on{' '}
          <a href="https://github.com/technobuddha/technobuddha.com">GitHub</a>
        </div>
      </div>
    ),
    component: Home,
    todo: [
      t('Add a description to this component'),
      t("Add some interactive features so people don't have to wait"),
      t('Add a "What\'s new" section.'),
    ],
  },
  {
    active: false,
    name: 'music',
    icon: GiMusicalNotes,
    primary: t('Music'),
    secondary: t('Music Collection'),
    location: '/music',
    component: () => <div />, //Music,
    todo: [
      t('Add a description to this component'),
      t('Increase functionality to show individual artists/albums/genres'),
    ],
  },
  {
    active: true,
    name: 'maze',
    icon: GiMaze,
    primary: t('Maze'),
    secondary: t('Maze generator & solver'),
    description: (
      <div>
        <div>
          Mazes and computers go hand-in-hand because a maze mimics the common computer science
          problem of graph traversal.
        </div>
        <div>
          Thousands of types of Mazes can be made by combining maze topologies (like: square,
          triable, hexagon, octogon and pentagon) with maze generation algorithms (like:
          Prim&apos;s, Hunt and Kill, and Recursive Backtracker) and maze solving algorithms (like:
          Dijkstra&apos;s, wall-walking and filler).
        </div>
        <div>
          You can watch as mazes are generated and solved, animating each algorithm to show how it
          works.
        </div>
      </div>
    ),
    location: '/maze',
    component: MazeMaker,
    todo: [t('Add a description to this component')],
  },
  {
    active: true,
    name: 'chaos',
    icon: GiOilySpiral,
    primary: t('Chaos'),
    secondary: t('The Mandelbrot Set'),
    description: (
      <div>
        <div>
          The <a href="https://en.wikipedia.org/wiki/Mandelbrot_set">Mandelbrot set</a> a{' '}
          <a href="https://en.wikipedia.org/wiki/Fractal_curve">fractal curve</a> created by a
          simple mathamatical equation. It demonstrates{' '}
          <a href="https://en.wikipedia.org/wiki/Chaos_theory">Chaos theory</a> by showing how small
          changes in a non-linear system can lead to large differences.
        </div>
        <div>
          This implementation uses a{' '}
          <a href="https://en.wikipedia.org/wiki/Web_worker">web worker</a> to offload the huge
          amount of calculations needed to render the set to another thread. Otherwise the entire
          user interface would lock up while the set is being computed.
        </div>
      </div>
    ),
    location: '/chaos',
    component: Chaos,
    todo: [t('Add a description to this component'), t('Clean up the UI')],
  },
  {
    active: true,
    name: 'life',
    icon: GiConwayLifeGlider,
    primary: t('Life'),
    secondary: t("John Conway's Game of Life"),
    description: (
      <div>
        <div>
          A <a href="https://en.wikipedia.org/wiki/Cellular_automaton">cellular automaton</a>{' '}
          devised by the British mathematician{' '}
          <a href="https://en.wikipedia.org/wiki/John_Horton_Conway">John Horton Conway</a> in 1970.
          It is a <a href="https://en.wikipedia.org/wiki/Zero-player_game">zero-player game</a>,
          meaning that its evolution is determined by its initial state, requiring no further input.
          One interacts with the Game of Life by creating an initial configuration and observing how
          it evolves. It is{' '}
          <a href="https://en.wikipedia.org/wiki/Turing_complete">Turing complete</a> and can
          simulate a{' '}
          <a href="https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor">
            universal constructor
          </a>{' '}
          or any other <a href="https://en.wikipedia.org/wiki/Turing_machine">Turing machine</a>.
        </div>
        <div>
          This implementation is designed to run as fast as possible without using any graphic
          accelaration, or multi-threading.
        </div>
      </div>
    ),
    location: '/life',
    component: Life,
    todo: [
      t('Add ability to specify starting configuration'),
      t('Add controls to start/stop and control speed'),
    ],
  },
  {
    active: true,
    name: 'space',
    icon: GiOrbital,
    primary: t('Space'),
    secondary: t('N-body Gravitational Simulation'),
    description: (
      <div>
        Take a lot of data from{' '}
        <a href="https://ssd.jpl.nasa.gov/horizons/app.html#/">JPL&apos;s Horizons System</a> and
        plug that into the basic mathamatical equations for gravity, and you get a{' '}
        <a href="https://en.wikipedia.org/wiki/N-body_simulation">N-body similation</a>
      </div>
    ),
    location: '/nbody',
    component: NBody,
    todo: [t('Add zoom and pan ability'), t('Add ability to add a new body')],
  },
  {
    active: false,
    name: 'knight',
    icon: GiChessKnight,
    primary: t('Knight'),
    secondary: t('The Knight Move Problem'),
    location: '/knight',
    component: Knight,
    todo: [t('Add a description to this component'), t('Clean up the UI')],
  },
  {
    active: true,
    name: 'maze-debugger',
    icon: GiMaze,
    primary: t('Maze'),
    secondary: t('Maze debugger'),
    location: '/maze/debug',
    component: MazeDebugger,
    todo: [t('Add a description to this component')],
  },
  {
    active: false,
    name: 'theme',
    icon: GiPalette,
    primary: t('Theme'),
    secondary: t('Visualization of the MUI theme'),
    location: '/theme',
    component: Theme,
    todo: [t('Add a description to this component')],
  },
  {
    active: false,
    name: 'color',
    icon: HiColorSwatch,
    primary: t('Color'),
    secondary: t('Colors'),
    location: '/colors',
    component: Color,
    todo: [t('Add a description to this component')],
  },
];
