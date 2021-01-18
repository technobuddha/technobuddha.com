import { db }         from './driver';
import { SnakeCase }  from 'type-fest';
import type { Track } from '#schema/';

type DBTrack                     = {[Key in keyof Track as SnakeCase<Key>]: Track[Key]};
type Scalar<T extends unknown[]> = T[0];

type GetTrackPick = 'contentId'  | 'artist' | 'album' | 'discNumber'  | 'trackNumber'  | 'title' | 'genre';
type GetTracksInput = Pick<DBTrack, SnakeCase<GetTrackPick>>;
export type GetTracks = Pick<Track, GetTrackPick>;
export async function getTracks(): Promise<GetTracks[]> {
    return db.manyOrNone<GetTracksInput>(
        `
        SELECT  content_id, artist, album, disc_number, track_number, title, genre
        FROM    track;
        `
    )
    .then(data => data.map(row => ({ 
        contentId: row.content_id,
        artist: row.artist,
        album: row.album,
        discNumber: row.disc_number,
        trackNumber: row.track_number,
        title: row.title,
        genre: row.genre,
    })));
}


type GetNewAlbumsPick = 'artist' | 'album' | 'year' | 'genre' | 'subgenre';
type GetNewAlbumsInput = Pick<DBTrack, SnakeCase<GetNewAlbumsPick>>;
export type GetNewAlbums = Pick<Track,   GetNewAlbumsPick>; 
export async function getNewAlbums(): Promise<GetNewAlbums[]> {
    return db.manyOrNone<GetNewAlbumsInput>(
        `
        SELECT      DISTINCT ON (track.artist, track.album) track.artist, track.album, track.year, track.genre, track.subgenre
        FROM        track
        LEFT JOIN   track_old ON track.content_id = track_old.content_id
        WHERE       track_old.content_id IS NULL;
        `
    );
}


type GetArtistsPick = 'album' | 'year' | 'genre' | 'subgenre';
type GetArtistsInput = Pick<DBTrack, SnakeCase<GetArtistsPick>> & {artist: Scalar<DBTrack['artist']>};
export type GetArtists = Pick<Track,   GetArtistsPick> & {artist: Scalar<Track['artist']>}; 
export async function getArtists(): Promise<GetArtists[]> {
    return db.manyOrNone<GetArtistsInput>(
        `
        SELECT      DISTINCT ON (UNNEST(track.artist), album) UNNEST(track.artist) AS artist, track.album, track.year, track.genre, track.subgenre
        FROM        track
        `
    );
}

type GetGenresPick = 'artist' | 'album' | 'year' | 'subgenre';
type GetGenresInput = Pick<DBTrack, SnakeCase<GetGenresPick>> & {artist: Scalar<DBTrack['genre']>};
export type GetGenres = Pick<Track,   GetGenresPick> & {artist: Scalar<Track['genre']>}; 
export async function getGenres(): Promise<GetGenres[]> {
    return db.manyOrNone<GetGenresInput>(
        `
        SELECT      DISTINCT ON (UNNEST(track.genre)) UNNEST(track.genre) AS genre, track.subgenre, track.album, track.year, track.genre
        FROM        track
        `
    );
}

export default { getTracks, getNewAlbums, getArtists, getGenres }
