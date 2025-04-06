import React from 'react';
import { DataGrid, type RowRenderer } from '@technobuddha/datagrid';
import { MdMusicNote } from 'react-icons/md';

import { type Album, useAPI } from '#context/api';
import { useTranslation } from '#context/i18n';
import { DelayedLoading } from '#control';

import css from './new-albums.module.css';

export const NewAlbums: React.FC = () => {
  const { t } = useTranslation();
  const api = useAPI();
  const [dataset, setDataset] = React.useState<Album[] | null>(null);

  React.useEffect(() => {
    void api.music.newAlbums().then((albums) => {
      setDataset(albums);
    });
  }, [api]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowRenderer: RowRenderer = ({ datum }: { datum: any }) => (
    <div className={css.row}>
      <img
        className={css.img}
        alt={t('Album Artwork')}
        src={`/art/${datum.collectionGroupId.toUpperCase()}`}
      />
      <div className={css.artist}>{datum.artist.join('; ')}</div>
      <div className={css.album}>{datum.album}</div>
      <div className={css.year}>{datum.year}</div>
      <div className={css.genre}>{datum.genre?.join('; ')}</div>
      <div className={css.subgenre}>{datum.subgenre?.join('; ')}</div>
      <div className={css.title}>
        {/* eslint-disable-next-line react/no-array-index-key, @typescript-eslint/no-explicit-any */}
        {datum.title?.sort().map((title: any, i: number) => <div key={i}>{title}</div>)}
      </div>
    </div>
  );

  // TODO [2025-12-31]: Figure out why translations are giving a type error if used directly
  const artist = t('Artist');
  const album = t('Album');
  const year = t('Year');
  const genre = t('Genre');
  const subgenre = t('Style');

  if (dataset) {
    return (
      <DataGrid
        data={dataset}
        rowHeight={136}
        columns={[
          { name: 'artist', header: artist, type: 'array', sortBy: ['artist', 'album'] },
          { name: 'album', header: album, type: 'string', sortBy: ['album'] },
          { name: 'year', header: year, type: 'number', sortBy: ['year'] },
          { name: 'genre', header: genre, type: 'array', sortBy: ['genre', 'subgenre'] },
          { name: 'subgenre', header: subgenre, type: 'array', sortBy: ['subgenre'] },
        ]}
        // eslint-disable-next-line react/jsx-no-bind
        rowRenderer={rowRenderer}
        filters={[
          { type: 'checkbox-list', name: 'genre', Icon: MdMusicNote },
          { type: 'checkbox-list', name: 'subgenre', Icon: MdMusicNote },
        ]}
        defaultSort="artist"
        useLocation
      />
    );
  }

  return <DelayedLoading />;
};
