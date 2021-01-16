import React from 'react';
import ScrollableTabsButton from '#control/scrollableTabsButton';
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
        <ScrollableTabsButton
            tabs={[
                //TODO translate
                {label: 'New Albums', content: NewAlbums,  icon: <GiMusicSpell/>},
                {label: 'All Tracks', content: Tracks,     icon: <GiMusicalScore />},
            ]}
        />
    );
}