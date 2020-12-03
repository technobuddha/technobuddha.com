import React from 'react';
//import range from 'lodash/range';
import DataGrid from '$client/control/mui-datagrid/DataGrid'; // TODO 'mui-datagrid';
import useApi from '#context/api';
import Box from '@material-ui/core/Box';
import Album    from '@material-ui/icons/Album';
import MusicNote from '@material-ui/icons/MusicNote';
import Group from '@material-ui/icons/Group';
import DelayedCircularProgress from '$client/control/DelayedCircularProgress';

export const Music: React.FC = () => {
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
                selection={true}
                columns={[
                    {name: 'Artist',        type: 'array',  sortBy: ['Artist', 'Album', 'PartOfSet', 'TrackNumber']},
                    {name: 'Album',         type: 'string', sortBy: ['Album', 'PartOfSet', 'TrackNumber']},
                    {name: 'PartOfSet',     type: 'string', width: 32, header: '#'},
                    {name: 'TrackNumber',   type: 'number', width: 32, header: '#'},
                    {name: 'Title',         type: 'string'},
                    {name: 'Genre',         type: 'array'},
                ]}
                filters={[
                    {type: 'transfer',      name: 'Artist', Icon: Group},
                    {type: 'checkbox-list', name: 'Album',  Icon: Album},
                    {type: 'checkbox-list', name: 'Genre',  Icon: MusicNote},
                ]}
                defaultSort="Artist"
                useLocation={true}
            />
        );
    } else {
        return <Box display="flex" flexGrow={1} justifyContent="center" alignItems="center"><DelayedCircularProgress /></Box>;
    }

}

export default Music;