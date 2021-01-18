import React            from 'react';
import useTranslation   from '#context/i18n';
import TabbedRouter     from '#control/tabbedRouter';
import NewAlbums        from './NewAlbums';
import Tracks           from './Tracks';
import Artists          from './Artists';
import Genres           from './Genres';
import { GiMusicSpell, GiMusicalScore, GiMeepleGroup, GiMusicalKeyboard } from 'react-icons/gi';

/**
 * GiMusicalKeyboard
 * GiDrum
 * GiFlute
 * GiPanFlute
 */

export const Music: React.FC = () => {
    const { t } = useTranslation();

    return (
        <TabbedRouter
            tabs={[
                {url: 'new_albums',  label: t('New Albums'), content: NewAlbums,  icon: <GiMusicSpell/>},
                {url: 'artists',     label: t('Artists'),    content: Artists,    icon: <GiMeepleGroup/>},
                {url: 'genres ',     label: t('Genres'),     content: Genres,     icon: <GiMusicalKeyboard/>},
                {url: 'all_tracks',  label: t('All Tracks'), content: Tracks,     icon: <GiMusicalScore />},
            ]}
        />
    );
}

export default Music;