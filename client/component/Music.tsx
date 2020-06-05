import React from 'react';
//import range from 'lodash/range';
import DataGrid from '$client/control/mui-datagrid/DataGrid'; // TODO 'mui-datagrid';
import useApi from '$client/context/api';
import Box from '$client/control/Box';
import Album    from '@material-ui/icons/Album';
import MusicNote from '@material-ui/icons/MusicNote';
import Group from '@material-ui/icons/Group';
import DelayedCircularProgress from '$client/control/DelayedCircularProgress';

export const Music: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<any[]>(null!);

    React.useEffect(
        () => {
//            const dumdum  = range(25).map(i => (i % 7 ? new Date(i * 10000000000) : null));
//            setDataset(dumdum);
            api.music.readTracks().then(tracks => setDataset(tracks.payload));
        },
        []
    )

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                selection={true}
                columns={[
                    {name: 'Artist',        type: 'string', sortBy: ['Artist', 'Album', 'TrackNumber']},
                    {name: 'Album',         type: 'string'},
                    {name: 'PartOfSet',     type: 'string', width: 32, header: '#'},
                    {name: 'TrackNumber',   type: 'number', width: 32, header: '#'},
                    {name: 'Title',         type: 'string'},
                    {name: 'Genre',         type: 'string'},
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