import React          from 'react';
import DelayedLoading from '#control/delayedLoading';
import DataGrid       from '#control/datagrid';
import useApi         from '#context/api';

import type { APIValue }     from '#context/api';
import type { PromiseValue } from 'type-fest';

export const NewAlbums: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<APIValue<PromiseValue<ReturnType<typeof api.music.genres>>> | null>(null);

    React.useEffect(
        () => {
            api.music.genres().then(tracks => { setDataset(tracks.payload); });
        },
        []
    );

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={32}
                columns={[
                    { name: 'genre',         type: 'array',  sortBy: [ 'genre', 'subgenre' ]},
                    { name: 'subgenre',      type: 'array',  sortBy: [ 'subgenre' ]},
                    { name: 'artist',        type: 'string', sortBy: [ 'artist', 'album' ]},
                    { name: 'album',         type: 'string', sortBy: [ 'album' ]},
                    { name: 'year',          type: 'number', sortBy: [ 'year' ], width: 40 },

                ]}
                filters={[
                    // {type: 'checkbox-list', name: 'genre',    Icon: MusicNote},
                    // {type: 'checkbox-list', name: 'subgenre', Icon: MusicNote},
                ]}
                defaultSort="genre"
                useLocation={true}
            />
        );
    }

    return <DelayedLoading />;
};

export default NewAlbums;
