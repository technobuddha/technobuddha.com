import React from 'react';
//import range from 'lodash/range';
import DataGrid from '#control/datagrid/DataGrid'; // TODO 'datagrid';
import useApi from '#context/api';
import Box from '@material-ui/core/Box';
import Album    from '@material-ui/icons/Album';
import MusicNote from '@material-ui/icons/MusicNote';
import Group from '@material-ui/icons/Group';
import DelayedCircularProgress from '#control/DelayedCircularProgress';

export const Tracks: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<any[]>(null!);

    React.useEffect(
        () => {
           //const dumdum  = range(250).map(i => (i % 9 ? new Date(i * 10000000000) : null));
           //const dumdum  = range(25).map(i => ({xx: 69, sx: [1,2,3], anything: { phil: 'hello', object: { i: i, j: i*2, k: [i*3,i*4,i*5]} , array: [i*6, i*7, i*8]}}));
           //setDataset(dumdum);
           api.music.readTracks().then(tracks => setDataset(tracks.payload));
        },
        []
    );

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={32}
                columns={[
                    {name: 'artist',        type: 'array',  sortBy: ['artist', 'album', 'discNumber', 'trackNumber']},
                    {name: 'album',         type: 'string', sortBy: ['album', 'discNumber', 'trackNumber']},
                    {name: 'discNumber',    type: 'number', width: 32, header: '#'},
                    {name: 'trackNumber',   type: 'number', width: 32, header: '#'},
                    {name: 'title',         type: 'string'},
                    {name: 'genre',         type: 'array'},
                ]}
                filters={[
                    {type: 'transfer',      name: 'artist', Icon: Group},
                    {type: 'checkbox-list', name: 'album',  Icon: Album},
                    {type: 'checkbox-list', name: 'genre',  Icon: MusicNote},
                ]}
                defaultSort="artist"
                useLocation={true}
            />
        );
    } else {
        return <Box display="flex" flexGrow={1} justifyContent="center" alignItems="center"><DelayedCircularProgress /></Box>;
    }

}

export default Tracks;