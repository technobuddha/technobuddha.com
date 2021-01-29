import React          from 'react';
import DataGrid       from '#control/datagrid';
import useApi         from '#context/api';
import Album          from '@material-ui/icons/Album';
import MusicNote      from '@material-ui/icons/MusicNote';
import Group          from '@material-ui/icons/Group';
import DelayedLoading from '#control/delayedLoading';

import type { APIValue }     from '#context/api';
import type { PromiseValue } from 'type-fest';

export const Tracks: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<APIValue<PromiseValue<ReturnType<typeof api.music.tracks>>> | null>(null);

    React.useEffect(
        () => {
            api.music.tracks().then(tracks => { setDataset(tracks.payload); });
        },
        []
    );

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={32}
                columns={[
                    { name: 'artist',        type: 'array',  sortBy: [ 'artist', 'album', 'discNumber', 'trackNumber' ]},
                    { name: 'album',         type: 'string', sortBy: [ 'album', 'discNumber', 'trackNumber' ]},
                    { name: 'discNumber',    type: 'number', width: 32, header: '#' },
                    { name: 'trackNumber',   type: 'number', width: 32, header: '#' },
                    { name: 'title',         type: 'string' },
                    { name: 'genre',         type: 'array' },
                ]}
                filters={[
                    { type: 'transfer',      name: 'artist', Icon: Group },
                    { type: 'checkbox-list', name: 'album',  Icon: Album },
                    { type: 'checkbox-list', name: 'genre',  Icon: MusicNote },
                ]}
                defaultSort="artist"
                useLocation={true}
            />
        );
    }

    return <DelayedLoading />;
};

export default Tracks;
