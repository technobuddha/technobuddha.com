import React from 'react';
import { GiMeepleGroup, GiMusicalKeyboard, GiMusicalScore, GiMusicSpell } from 'react-icons/gi';

import { useTranslation } from '#context/i18n';
import { TabbedRouter } from '#control';

import { Artists } from './artists.js';
import { Genres } from './genres.js';
import { NewAlbums } from './new-albums.js';
import { Tracks } from './tracks.js';

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
        { url: 'new_albums', label: t('New Albums'), content: NewAlbums, icon: <GiMusicSpell /> },
        { url: 'artists', label: t('Artists'), content: Artists, icon: <GiMeepleGroup /> },
        { url: 'genres ', label: t('Genres'), content: Genres, icon: <GiMusicalKeyboard /> },
        { url: 'all_tracks', label: t('All Tracks'), content: Tracks, icon: <GiMusicalScore /> },
      ]}
    />
  );
};
