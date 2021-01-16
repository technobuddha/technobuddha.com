import React from 'react';
import type { IconType }            from 'react-icons';
import type { TFunction } from 'react-i18next';
import {GiHouse}            from 'react-icons/gi';
import {GiMusicalNotes}     from 'react-icons/gi';
import {GiConwayLifeGlider} from 'react-icons/gi';
import {GiOrbital}          from 'react-icons/gi';
import {GiThornyTentacle}   from 'react-icons/gi';
import {GiChessKnight}      from 'react-icons/gi';
import Home                 from '~src/client/component/home';
import NBody                from '#component/NBody';
import { Tracks, NewAlbums, Music } from '#component/music';
import Knight               from '#component/Knight';
import Life                 from '#component/Life';
import Chaos                from '#component/Chaos';

export type Component = {
    icon: IconType;
    primary: string;
    secondary?: string;
    location: string;
    component: React.ComponentType;
    description?: React.ReactElement,
    todo?: string[];

}

export const components: (t: TFunction<string>) => Component[] = (t) => [
    {
        icon: GiHouse,
        primary: t('Home'),
        location: '/home',
        component: Home,
        todo: [
            t('Add a description to this component'),
            t('Add some interactive features so people don\'t have to wait'),
            t('Add a "What\'s new" section.')
        ]
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
        ]
    },
    {
        icon: GiMusicalNotes,   //TODO better icon
        primary: t('New Albums'),
        secondary: t('Recently Acquired Albums'),
        location: '/albums',
        component: NewAlbums,
        todo: [
            t('Merge with the Music Collection'),
        ]
    },
    { 
        icon: GiMusicalNotes,
        primary: t('Music'),
        secondary: t('Music collection'),
        location: '/music',
        component: Tracks,
        todo: [
            t('Add a description to this component'),
            t('Increase functionality to show individual artists/albums/genres'),
        ]
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
        ]
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
        ]
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
            t('Add ability to zoom into a section')
        ]
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
        ]
    },
];

export default components;
