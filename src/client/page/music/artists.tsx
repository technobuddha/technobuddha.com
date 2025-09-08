import React from 'react';
import { DataGrid } from '@technobuddha/datagrid';

import { type Artist } from '#context/api';
import { useAPI } from '#context/api';
import { DelayedLoading } from '#control';

export const Artists: React.FC = () => {
  const api = useAPI();
  const [dataset, setDataset] = React.useState<Artist[] | null>(null);

  React.useEffect(() => {
    void api.music.artists().then((artists) => {
      setDataset(artists);
    });
  }, [api]);

  if (dataset) {
    return (
      <DataGrid
        data={dataset}
        rowHeight={32}
        columns={[
          { name: 'artist', type: 'string', sortBy: ['artist', 'album'] },
          { name: 'album', type: 'string', sortBy: ['album'] },
          { name: 'year', type: 'number', sortBy: ['year'], width: 40 },
          { name: 'genre', type: 'array', sortBy: ['genre', 'subgenre'] },
          { name: 'subgenre', type: 'array', sortBy: ['subgenre'] },
        ]}
        filters={
          [
            // {type: 'checkbox-list', name: 'genre',    Icon: MusicNote},
            // {type: 'checkbox-list', name: 'subgenre', Icon: MusicNote},
          ]
        }
        defaultSort="artist"
        useLocation
      />
    );
  }

  return <DelayedLoading />;
};
