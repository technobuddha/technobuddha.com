import React from 'react';
import DataGrid from '@technobuddha/datagrid';
import { MdAlbum, MdGroup, MdMusicNote } from 'react-icons/md';

import { type APIValue } from '#context/api';
import { useAPI } from '#context/api';
import { DelayedLoading } from '#control';

export const Tracks: React.FC = () => {
  const api = useAPI();
  const [dataset, setDataset] = React.useState<APIValue<
    Awaited<ReturnType<typeof api.music.tracks>>
  > | null>(null);

  React.useEffect(() => {
    void api.music.tracks().then((tracks) => {
      setDataset(tracks.payload);
    });
  }, [api]);

  if (dataset) {
    return (
      <DataGrid
        data={dataset}
        rowHeight={32}
        columns={[
          {
            name: 'artist',
            type: 'array',
            sortBy: ['artist', 'album', 'discNumber', 'trackNumber'],
          },
          { name: 'album', type: 'string', sortBy: ['album', 'discNumber', 'trackNumber'] },
          { name: 'discNumber', type: 'number', width: 32, header: '#' },
          { name: 'trackNumber', type: 'number', width: 32, header: '#' },
          { name: 'title', type: 'string' },
          { name: 'genre', type: 'array' },
        ]}
        filters={[
          { type: 'transfer', name: 'artist', Icon: MdGroup },
          { type: 'checkbox-list', name: 'album', Icon: MdAlbum },
          { type: 'checkbox-list', name: 'genre', Icon: MdMusicNote },
        ]}
        defaultSort="artist"
        useLocation
      />
    );
  }

  return <DelayedLoading />;
};
