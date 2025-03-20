import React from 'react';
import { DataGrid } from '@technobuddha/datagrid';

import { type APIValue } from '#context/api';
import { useAPI } from '#context/api';
import { DelayedLoading } from '#control';

export const Genres: React.FC = () => {
  const api = useAPI();
  const [dataset, setDataset] = React.useState<APIValue<
    Awaited<ReturnType<typeof api.music.genres>>
  > | null>(null);

  React.useEffect(() => {
    void api.music.genres().then((tracks) => {
      setDataset(tracks.payload);
    });
  }, [api]);

  if (dataset) {
    return (
      <DataGrid
        data={dataset}
        rowHeight={32}
        columns={[
          { name: 'genre', type: 'array', sortBy: ['genre', 'subgenre'] },
          { name: 'subgenre', type: 'array', sortBy: ['subgenre'] },
          { name: 'artist', type: 'string', sortBy: ['artist', 'album'] },
          { name: 'album', type: 'string', sortBy: ['album'] },
          { name: 'year', type: 'number', sortBy: ['year'], width: 40 },
        ]}
        filters={
          [
            // {type: 'checkbox-list', name: 'genre',    Icon: MusicNote},
            // {type: 'checkbox-list', name: 'subgenre', Icon: MusicNote},
          ]
        }
        defaultSort="genre"
        useLocation
      />
    );
  }

  return <DelayedLoading />;
};
