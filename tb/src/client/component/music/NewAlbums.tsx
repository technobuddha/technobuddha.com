import React          from 'react';
import MusicNote      from '@material-ui/icons/MusicNote';
import DelayedLoading from '#control/delayedLoading';
import DataGrid       from '@technobuddha/datagrid';
import useApi         from '#context/api';
import useTranslation from '#context/i18n';
import css            from './NewAlbums.css';

import type { RowRenderer }  from '@technobuddha/datagrid';
import type { APIValue }     from '#context/api';
import type { PromiseValue } from 'type-fest';

export const NewAlbums: React.FC = () => {
    const { t } = useTranslation();
    const api   = useApi();
    const [ dataset, setDataset ]   = React.useState<APIValue<PromiseValue<ReturnType<typeof api.music.newAlbums>>> | null>(null);

    React.useEffect(
        () => {
            api.music.newAlbums().then(tracks => { setDataset(tracks.payload); });
        },
        []
    );

    const rowRenderer: RowRenderer = ({ datum }: { datum: any }) => (
        <div className={css.row}>
            <img className={css.img} alt={t('Album Artwork')} src={`/art/${datum.collectionGroupId.toUpperCase()}`}  />
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

    // TODO [2021-12-31] Figure out why translations are giving a type error if used directly
    const artist    = t('Artist');
    const album     = t('Album');
    const year      = t('Year');
    const genre     = t('Genre');
    const subgenre  = t('Style');

    if(dataset) {
        return (
            <DataGrid
                data={dataset}
                rowHeight={136}
                columns={[
                    { name: 'artist',        header: artist,   type: 'array',  sortBy: [ 'artist', 'album' ]},
                    { name: 'album',         header: album,    type: 'string', sortBy: [ 'album' ]},
                    { name: 'year',          header: year,     type: 'number', sortBy: [ 'year' ]},
                    { name: 'genre',         header: genre,    type: 'array',  sortBy: [ 'genre', 'subgenre' ]},
                    { name: 'subgenre',      header: subgenre, type: 'array',  sortBy: [ 'subgenre' ]},
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
