import React from 'react';
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
  GiSpottedBug,
} from 'react-icons/gi';
import { HiColorSwatch } from 'react-icons/hi';

import { Chaos } from '#component/chaos';
import { Color } from '#component/color';
import { Home } from '#component/home';
import { Knight } from '#component/knight';
import { Life } from '#component/life';
import { MazeDebugger, MazeMaker } from '#component/maze';
import { Music } from '#component/music';
import { NBody } from '#component/n-body';
import { Theme } from '#component/theme';
import { type TFunction } from '#context/i18n';
import { Link, Typography } from '#control';

export type Component = {
  active: boolean;
  loggedIn: boolean;
  name: string;
  icon: IconType;
  primary: string;
  secondary?: string;
  location: string;
  route?: string;
  component: React.ComponentType;
  description?: React.ReactElement;
  todo?: string[];
};

export const components: (t: TFunction) => Component[] = (t) => [
  {
    active: true,
    loggedIn: false,
    name: 'home',
    icon: GiHouse,
    primary: t('Home'),
    location: '/home',
    description: (
      <div>
        <Typography>
          {t(
            'Learn some things about the Technobuddha, and delve into his various projects designed  solely for his amusement (though you might be amused also).',
          )}
        </Typography>
        <Typography>
          {t(
            'The maze generator and solver can be seen in the background, you can get more interesting mazes on the',
          )}{' '}
          <Link to="/maze">{t('Mazes Page')}</Link>
        </Typography>
        <Typography>
          {t('The source code for this website can be found on')}{' '}
          <Link to="https://github.com/technobuddha/technobuddha.com">GitHub</Link>
        </Typography>
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
    active: true,
    loggedIn: true,
    name: 'music',
    icon: GiMusicalNotes,
    primary: t('Music'),
    secondary: t('Music Collection'),
    location: '/music',
    route: '/music/*',
    component: Music,
    todo: [
      t('Add a description to this component'),
      t('Increase functionality to show individual artists/albums/genres'),
    ],
  },
  {
    active: true,
    loggedIn: false,
    name: 'maze',
    icon: GiMaze,
    primary: t('Maze'),
    secondary: t('Maze generator & solver'),
    description: (
      <div>
        <Typography>
          {t(
            'Mazes and computers go hand-in-hand because a maze mimics the common computer science problem of graph traversal.',
          )}
          {t(
            "Thousands of types of Mazes can be made by combining maze topologies (like: square, triangle, hexagon, octagon and pentagon) with maze generation algorithms (like: Prim's, Hunt and Kill, and Recursive Backtracker) and maze solving algorithms (like: Dijkstra's, wall-walking and filler.",
          )}
          {t(
            'You can watch as mazes are generated and solved, animating each algorithm to show how it works.',
          )}
        </Typography>
      </div>
    ),
    location: '/maze',
    component: MazeMaker,
    todo: [t('Add a description to this component')],
  },
  {
    active: true,
    loggedIn: false,
    name: 'chaos',
    icon: GiOilySpiral,
    primary: t('Chaos'),
    secondary: t('The Mandelbrot Set'),
    description: (
      <div>
        <Typography>
          {t('The')} <Link to="https://en.wikipedia.org/wiki/Mandelbrot_set">Mandelbrot set</Link>{' '}
          {t('is a')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Fractal_curve">{t('fractal curve')}</Link>{' '}
          {t('created by a simple mathematical equation. It demonstrates')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Chaos_theory">{t('Chaos theory')}</Link>{' '}
          {t('by showing how small changes in a non-linear system can lead to large differences.')}
        </Typography>
        <Typography>
          {t('This implementation uses a')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Web_worker">{t('web worker')}</Link>{' '}
          {t(
            'to offload the huge amount of calculations needed to render the set to another thread. Otherwise the entire user interface would lock up while the set is being computed.',
          )}
        </Typography>
      </div>
    ),
    location: '/chaos',
    component: Chaos,
    todo: [t('Add a description to this component'), t('Clean up the UI')],
  },
  {
    active: true,
    loggedIn: false,
    name: 'life',
    icon: GiConwayLifeGlider,
    primary: t('Life'),
    secondary: t("John Conway's Game of Life"),
    description: (
      <>
        <Typography>
          {t('A')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Cellular_automaton">
            {t('cellular automaton')}
          </Link>{' '}
          {t('devised by the British mathematician')}{' '}
          <Link to="https://en.wikipedia.org/wiki/John_Horton_Conway">John Horton Conway</Link>{' '}
          {t('in 1970.')}
          {t('It is a')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Zero-player_game">{t('zero-player game')}</Link>,
          {t(
            'meaning that its evolution is determined by its initial state, requiring no further input.',
          )}
          {t(
            'One interacts with the Game of Life by creating an initial configuration and observing how it evolves.',
          )}
          {t('It is')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Turing_complete">{t('Turing complete')}</Link>{' '}
          {t('and can simulate an')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor">
            {t('universal constructor')}
          </Link>{' '}
          {t('or any other')}{' '}
          <Link to="https://en.wikipedia.org/wiki/Turing_machine">{t('Turing machine')}</Link>.
        </Typography>
        <Typography>
          {t(
            'This implementation is designed to run as fast as possible without using any graphic acceleration, or multi-threading.',
          )}
        </Typography>
      </>
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
    loggedIn: false,
    name: 'space',
    icon: GiOrbital,
    primary: t('Space'),
    secondary: t('N-body Gravitational Simulation'),
    description: (
      <Typography>
        {t('Take a lot of data from')}{' '}
        <Link to="https://ssd.jpl.nasa.gov/horizons/app.html#/">{t("JPL's Horizons System")}</Link>{' '}
        {t('and plug that into the basic mathematical equations for gravity, and you get a')}{' '}
        <Link to="https://en.wikipedia.org/wiki/N-body_simulation">{t('N-body simulation')}</Link>
      </Typography>
    ),
    location: '/nbody',
    component: NBody,
    todo: [t('Add zoom and pan ability'), t('Add ability to add a new body')],
  },
  {
    active: true,
    loggedIn: true,
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
    loggedIn: true,
    name: 'maze-debugger',
    icon: GiSpottedBug,
    primary: t('Maze'),
    secondary: t('Maze debugger'),
    location: '/debug',
    component: MazeDebugger,
    todo: [t('Add a description to this component')],
  },
  {
    active: true,
    loggedIn: true,
    name: 'theme',
    icon: GiPalette,
    primary: t('Theme'),
    secondary: t('Visualization of the MUI theme'),
    location: '/theme',
    component: Theme,
    todo: [t('Add a description to this component')],
  },
  {
    active: true,
    loggedIn: true,
    name: 'color',
    icon: HiColorSwatch,
    primary: t('Color'),
    secondary: t('Colors'),
    location: '/colors',
    component: Color,
    todo: [t('Add a description to this component')],
  },
];
