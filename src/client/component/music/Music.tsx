import React from 'react';
import TabbedRouter from '#control/tabbedRouter';
import NewAlbums from './NewAlbums';
import Tracks from './Tracks';
import { GiMusicSpell, GiMusicalScore } from 'react-icons/gi';

/**
 * GiMusicalKeyboard
 * GiDrum
 * GiFlute
 * GiPanFlute
 */

export const Music: React.FC = () => {
    return (
        <TabbedRouter
            tabs={[
                //TODO translate
                {url: 'new_albums',  label: 'New Albums', content: NewAlbums,  icon: <GiMusicSpell/>},
                {url: 'all_tracks', label: 'All Tracks', content: Tracks,     icon: <GiMusicalScore />},
            ]}
        />
    );
}

export default Music;