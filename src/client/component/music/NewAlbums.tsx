import React                   from 'react';
import Box                     from '@material-ui/core/Box';
import MusicNote               from '@material-ui/icons/MusicNote';
import DelayedCircularProgress from '#control/delayedCircularProgress';
import DataGrid                from '#control/datagrid';
import useApi                  from '#context/api';

import type { RowRenderer } from '#control/datagrid/DataGrid/Row'; //TODO path

export const NewAlbums: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<any[]>(null!);

    React.useEffect(
        () => {
           api.music.newAlbums().then(tracks => setDataset(tracks.payload));
        },
        []
    );

    //todo translate
    const rowRenderer: RowRenderer = ({datum}: {datum: any}) => (
        <div style={{width: '100%', height: '100%'}}>
            <img style={{width: 100, height: 100, margin: 5, float: 'left'}} alt="Album Artwork" src={`/art/${datum.collectionGroupId.toUpperCase()}`} ></img>
            <div style={{fontSize: '125%'}}>{datum.artist.join('; ')}</div>
            <div style={{fontSize: '115%'}}>{datum.album}</div>
            <div>{datum.year}</div>
            <div>{datum.genre?.join('; ')}</div>
            <div>{datum.subgenre?.join('; ')}</div>
        </div>
    );

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={110}
                columns={[
                    {name: 'artist',        type: 'array',  sortBy: ['artist', 'album']},
                    {name: 'album',         type: 'string', sortBy: ['album']},
                    {name: 'year',          type: 'number', sortBy: ['year']},//, width: 40},
                    {name: 'genre',         type: 'array',  sortBy: ['genre', 'subgenre']},
                    {name: 'subgenre',      type: 'array',  sortBy: ['subgenre']}
                ]}
                rowRenderer={rowRenderer}
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
