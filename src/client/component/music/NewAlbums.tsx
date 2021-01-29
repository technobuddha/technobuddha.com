import React          from 'react';
import MusicNote      from '@material-ui/icons/MusicNote';
import DelayedLoading from '#control/delayedLoading';
import DataGrid       from '#control/datagrid';
import useApi         from '#context/api';
import css            from './NewAlbums.module.css';

import type { RowRenderer }  from '#control/datagrid';
import type { APIValue }     from '#context/api';
import type { PromiseValue } from 'type-fest';

export const NewAlbums: React.FC = () => {
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<APIValue<PromiseValue<ReturnType<typeof api.music.newAlbums>>> | null>(null);

    React.useEffect(
        () => {
            api.music.newAlbums().then(tracks => { setDataset(tracks.payload); });
        },
        []
    );

    //todo translate
    const rowRenderer: RowRenderer = ({ datum }: { datum: any }) => (
        <div className={css.row}>
            <img className={css.img} alt="Album Artwork" src={`/art/${datum.collectionGroupId.toUpperCase()}`}  />
            <div className={css.artist}>{datum.artist.join('; ')}</div>
            <div className={css.album}>{datum.album}</div>
            <div className={css.year}>{datum.year}</div>
            <div className={css.genre}>{datum.genre?.join('; ')}</div>
            <div className={css.subgenre}>{datum.subgenre?.join('; ')}</div>
            <div className={css.title}>
                {datum.title?.sort().map((title: any, i: number) => (
                    <div key={i}>{title}</div>
                ))}
            </div>
        </div>
    );

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={136}
                columns={[
                    { name: 'artist',        type: 'array',  sortBy: [ 'artist', 'album' ]},
                    { name: 'album',         type: 'string', sortBy: [ 'album' ]},
                    { name: 'year',          type: 'number', sortBy: [ 'year' ]}, //, width: 40},
                    { name: 'genre',         type: 'array',  sortBy: [ 'genre', 'subgenre' ]},
                    { name: 'subgenre',      type: 'array',  sortBy: [ 'subgenre' ]},
                ]}
                rowRenderer={rowRenderer}
                filters={[
                    { type: 'checkbox-list', name: 'genre',    Icon: MusicNote },
                    { type: 'checkbox-list', name: 'subgenre', Icon: MusicNote },
                ]}
                defaultSort="artist"
                useLocation={true}
            />
        );
    }

    return <DelayedLoading />;
};

export default NewAlbums;
