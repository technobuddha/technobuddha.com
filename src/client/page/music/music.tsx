// cspell:words Meeple
import React from 'react';
import { GiMeepleGroup, GiMusicalKeyboard, GiMusicalScore, GiMusicSpell } from 'react-icons/gi';

import { useTranslation } from '#context/i18n';
import { TabbedRouter } from '#control';

import { Artists } from './artists.tsx';
import { Genres } from './genres.tsx';
import { NewAlbums } from './new-albums.tsx';
import { Tracks } from './tracks.tsx';

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
      path="/music"
      tabs={[
        {
          route: '/new-albums',
          label: t('New Albums'),
          content: NewAlbums,
          icon: <GiMusicSpell />,
        },
        { route: '/artists', label: t('Artists'), content: Artists, icon: <GiMeepleGroup /> },
        { route: '/genres', label: t('Genres'), content: Genres, icon: <GiMusicalKeyboard /> },
        {
          route: '/all-tracks',
          label: t('All Tracks'),
          content: Tracks,
          icon: <GiMusicalScore />,
        },
      ]}
    />
  );
};
