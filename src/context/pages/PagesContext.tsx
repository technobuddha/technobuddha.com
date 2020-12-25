import React                        from 'react';
import {useTranslation}             from '#context/i18n';
import type { IconType }            from 'react-icons';
import {GiHouse}            from 'react-icons/gi';
import {GiMusicalNotes}     from 'react-icons/gi';
import {GiConwayLifeGlider} from 'react-icons/gi';
import {GiOrbital}          from 'react-icons/gi';
import {GiThornyTentacle}   from 'react-icons/gi';
import {GiChessKnight}      from 'react-icons/gi';
import Home                 from '#component/Home';
import NBody                from '#component/NBody';
import Music                from '#component/Music';
import Knight               from '#component/Knight';
import Life                 from '#component/Life';
import Chaos                from '#component/Chaos';

export type Page = {
    icon: IconType;
    primary: string;
    secondary?: string;
    location: string;
    component: React.FunctionComponent<any> | React.ComponentClass<any, any>;
}

const PagesContext = React.createContext<Page[]>(null!);

export function usePages() {
   return React.useContext(PagesContext);
}

type PagesProviderProps = {
    children?: React.ReactNode;
}

export const PagesProvider: React.FC = ({children}: PagesProviderProps = {}) => {
    const {t, i18n} = useTranslation();
    const control   = React.useMemo<Page[]>(() => 
        [
            { icon: GiHouse,            primary: t('Home'),                                              location: '/home',     component: Home     },
            { icon: GiMusicalNotes,     primary: t('Music'),  secondary: t('Music collection'),          location: '/music',    component: Music    },
            { icon: GiConwayLifeGlider, primary: t('Life'),   secondary: t('Conway\'s Game of Life'),    location: '/life',     component: Life     },
            { icon: GiOrbital,          primary: t('Space'),  secondary: t('Gravitational Simulation'),  location: '/nbody',    component: NBody    },
            { icon: GiThornyTentacle,   primary: t('Chaos'),  secondary: t('The Mandelbrot Set'),        location: '/chaos',    component: Chaos    },
            { icon: GiChessKnight,      primary: t('Knight'), secondary: t('The Knight Move Problem'),   location: '/knight',   component: Knight   },
        ],
        [i18n.language]
    );

    return (
        <PagesContext.Provider value={control}>
            {children}
        </PagesContext.Provider>
    )
}

export default usePages;
