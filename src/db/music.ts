import { db }       from './driver';
import type { dbTrack } from './table/track';
import { Track }    from '#interface/Track';

type GetTracksInput  = Pick<dbTrack, 'content_id' | 'artist' | 'album' | 'disc_number' | 'track_number' | 'genre'>;
type GetTracksOutput = Pick<Track,   'contentID'  | 'artist' | 'album' | 'discNumber'  | 'trackNumber'  | 'genre'>; 
export async function getTracks(): Promise<GetTracksOutput[]> {
    return db.manyOrNone<GetTracksInput>(
        `
        SELECT  content_id, artist, album, disc_number, trackNumber, title, genre
        FROM    track;
        `
    )
    .then(data => data.map(row => ({ 
        contentID: row.content_id,
        artist: row.artist,
        album: row.album,
        discNumber: row.disc_number,
        trackNumber: row.track_number,
        genre: row.genre,
    })));
}

type GetNewAlbumsInput  = Pick<dbTrack, 'artist' | 'album' | 'year' | 'genre' | 'subgenre'>;
type GetNewAlbumsOutput = Pick<Track,   'artist' | 'album' | 'year' | 'genre' | 'subgenre'>; 
export async function getNewAlbums(): Promise<GetNewAlbumsOutput[]> {
    return db.manyOrNone<GetNewAlbumsInput>(
        `
        SELECT      DISTINCT ON (track.artist, track.album) track.artist, track.album, track.year, track.genre, track.subgenre
        FROM        track
        LEFT JOIN   track_old ON track.content_id = track_old.content_id
        WHERE       track_old.content_id IS NULL;
        `
    );
}

export default { getTracks, getNewAlbums };
