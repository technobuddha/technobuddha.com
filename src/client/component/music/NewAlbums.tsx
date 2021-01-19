import React                   from 'react';
import Box                     from '@material-ui/core/Box';
import MusicNote               from '@material-ui/icons/MusicNote';
import DelayedCircularProgress from '#control/delayedCircularProgress';
import DataGrid                from '#control/datagrid';
import useApi                  from '#context/api';

//import type { RowRenderer } from '#control/datagrid/DataGrid/Row'; //TODO path

export const NewAlbums: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<any[]>(null!);

    React.useEffect(
        () => {
           api.music.newAlbums().then(tracks => setDataset(tracks.payload));
        },
        []
    );

    //const rowRenderer: RowRenderer = ({datum}) => (<div>{JSON.stringify(datum)}</div>);

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={32}
                columns={[
                    {name: 'artist',        type: 'array',  sortBy: ['artist', 'album']},
                    {name: 'album',         type: 'string', sortBy: ['album']},
                    {name: 'year',          type: 'number', sortBy: ['year'], width: 40},
                    {name: 'genre',         type: 'array',  sortBy: ['genre', 'subgenre']},
                    {name: 'subgenre',      type: 'array',  sortBy: ['subgenre']}
                ]}
                //rowRenderer={rowRenderer}
                filters={[
                    {type: 'checkbox-list', name: 'genre',    Icon: MusicNote},
                    {type: 'checkbox-list', name: 'subgenre', Icon: MusicNote},
                ]}
                defaultSort="artist"
                useLocation={true}
            />
        );
    } else {
        return <Box display="flex" flexGrow={1} justifyContent="center" alignItems="center"><DelayedCircularProgress /></Box>;
    }

}

export default NewAlbums;
