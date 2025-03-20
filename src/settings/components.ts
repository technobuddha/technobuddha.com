import { GiHouse } from 'react-icons/gi';
// import { GiMusicalNotes } from 'react-icons/gi';
// import { GiConwayLifeGlider } from 'react-icons/gi';
// import { GiOrbital } from 'react-icons/gi';
// import { GiChessKnight } from 'react-icons/gi';
// import { GiThornyVine } from 'react-icons/gi';
// import { GiPalette } from 'react-icons/gi';
import { GiMaze } from 'react-icons/gi';
// import { HiColorSwatch } from 'react-icons/hi';

import { Home } from '#component/home';
// import NBody                from '#component/nBody';
// import Music                from '#component/music';
// import Chaos                from '#component/chaos';
// import Knight               from '#component/knight';
// import Life                 from '#component/life';
import { MazeMaker } from '#component/maze';
// import Theme                from '#component/theme';
// import Color                from '#component/color';

import type React from 'react';
import type { IconType } from 'react-icons';
import type { TFunction } from '#context/i18n';

export type Component = {
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
    icon: GiHouse,
    primary: t('Home'),
    location: '/home',
    component: Home,
    todo: [
      t('Add a description to this component'),
      t("Add some interactive features so people don't have to wait"),
      t('Add a "What\'s new" section.'),
    ],
  },
  // {
  //   icon: GiMusicalNotes,
  //   primary: t('Music'),
  //   secondary: t('Music Collection'),
  //   location: '/music',
  //   component: Music,
  //   todo: [
  //     t('Add a description to this component'),
  //     t('Increase functionality to show individual artists/albums/genres'),
  //   ],
  // },
  // {
  //   icon: GiConwayLifeGlider,
  //   primary: t('Life'),
  //   secondary: t("Conway's Game of Life"),
  //   location: '/life',
  //   component: Life,
  //   todo: [
  //     t('Add a description to this component'),
  //     t('Add ability to specify starting configuration'),
  //     t('Add controls to start/stop and control speed'),
  //   ],
  // },
  // {
  //   icon: GiOrbital,
  //   primary: t('Space'),
  //   secondary: t('Gravitational Simulation'),
  //   location: '/nbody',
  //   component: NBody,
  //   todo: [
  //     t('Add a description to this component'),
  //     t('Add zoom and pan ability'),
  //     t('Add ability to add a new body'),
  //   ],
  // },
  // {
  //   icon: GiChessKnight,
  //   primary: t('Knight'),
  //   secondary: t('The Knight Move Problem'),
  //   location: '/knight',
  //   component: Knight,
  //   todo: [t('Add a description to this component'), t('Clean up the UI')],
  // },
  // {
  //   icon: GiThornyVine,
  //   primary: t('Chaos'),
  //   secondary: t('The Mandelbrot Set'),
  //   location: '/chaos',
  //   component: Chaos,
  //   todo: [t('Add a description to this component'), t('Clean up the UI')],
  // },
  {
    icon: GiMaze,
    primary: t('Maze'),
    secondary: t('Maze generator & solver'),
    location: '/maze',
    component: MazeMaker,
    todo: [t('Add a description to this component')],
  },
  // {
  //   icon: GiPalette,
  //   primary: t('Theme'),
  //   secondary: t('Visualization of the MUI theme'),
  //   location: '/theme',
  //   component: Theme,
  //   todo: [t('Add a description to this component')],
  // },
  // {
  //   icon: HiColorSwatch,
  //   primary: t('Color'),
  //   secondary: t('Colors'),
  //   location: '/colors',
  //   component: Color,
  //   todo: [t('Add a description to this component')],
  // },
];
