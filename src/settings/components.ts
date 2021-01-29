import { GiHouse }            from '%icons/gi/GiHouse';
import { GiMusicalNotes }     from '%icons/gi/GiMusicalNotes';
import { GiConwayLifeGlider } from '%icons/gi/GiConwayLifeGlider';
import { GiOrbital }          from '%icons/gi/GiOrbital';
import { GiThornyTentacle }   from '%icons/gi/GiThornyTentacle';
import { GiChessKnight }      from '%icons/gi/GiChessKnight';
import Home                 from '#component/home';
import NBody                from '#component/nBody';
import Music                from '#component/music';
import Knight               from '#component/knight';
import Life                 from '#component/life';
import Chaos                from '#component/chaos';

import type React         from 'react';
import type { IconType }  from '%icons';
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

export const components: (t: TFunction) => Component[] = t => [
    {
        icon: GiHouse,
        primary: t('Home'),
        location: '/home',
        component: Home,
        todo: [
            t('Add a description to this component'),
            t('Add some interactive features so people don\'t have to wait'),
            t('Add a "What\'s new" section.'),
        ],
    },
    {
        icon: GiMusicalNotes,
        primary: t('Music'),
        secondary: t('Music Collection'),
        location: '/music',
        component: Music,
        todo: [
            t('Add a description to this component'),
            t('Increase functionality to show individual artists/albums/genres'),
        ],
    },
    {
        icon: GiConwayLifeGlider,
        primary: t('Life'),
        secondary: t('Conway\'s Game of Life'),
        location: '/life',
        component: Life,
        todo: [
            t('Add a description to this component'),
            t('Add ability to specify starting configuration'),
            t('Add controls to start/stop and control speed'),
        ],
    },
    {
        icon: GiOrbital,
        primary: t('Space'),
        secondary: t('Gravitational Simulation'),
        location: '/nbody',
        component: NBody,
        todo: [
            t('Add a description to this component'),
            t('Add zoom and pan ability'),
            t('Add ability to add a new body'),
        ],
    },
    {
        icon: GiThornyTentacle,
        primary: t('Chaos'),
        secondary: t('The Mandelbrot Set'),
        location: '/chaos',
        component: Chaos,
        todo: [
            t('Add a description to this component'),
            t('Fix scaling so that image is not stretched'),
            t('Add ability to zoom into a section'),
        ],
    },
    {
        icon: GiChessKnight,
        primary: t('Knight'),
        secondary: t('The Knight Move Problem'),
        location: '/knight',
        component: Knight,
        todo: [
            t('Add a description to this component'),
            t('Clean up the UI'),
        ],
    },
];

export default components;
