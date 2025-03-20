import { type SnakeCase } from 'type-fest';

import { type Track } from '#schema/track.js';

import { db } from './driver.js';

type DBTrack = { [Key in keyof Track as SnakeCase<Key>]: Track[Key] };
type Scalar<T extends unknown[]> = T[0];

type GetTrackPick =
  | 'contentId'
  | 'artist'
  | 'album'
  | 'discNumber'
  | 'trackNumber'
  | 'title'
  | 'genre';
type GetTracksInput = Pick<DBTrack, SnakeCase<GetTrackPick>>;
export type GetTracks = Pick<Track, GetTrackPick>;
export async function getTracks(): Promise<GetTracks[]> {
  return db
    .manyOrNone<GetTracksInput>(
      `
        SELECT  content_id, artist, album, disc_number, track_number, title, genre
        FROM    track;
        `,
    )
    .then((data) =>
      data.map((row) => ({
        contentId: row.content_id,
        artist: row.artist,
        album: row.album,
        discNumber: row.disc_number,
        trackNumber: row.track_number,
        title: row.title,
        genre: row.genre,
      })),
    );
}

type GetNewAlbumsPick = 'artist' | 'album' | 'collectionGroupId' | 'year' | 'genre' | 'subgenre';
type GetNewAlbumsInput = Pick<DBTrack, SnakeCase<GetNewAlbumsPick>> & { title: string[] };
export type GetNewAlbums = Pick<Track, GetNewAlbumsPick> & { title: string[] };
export async function getNewAlbums(): Promise<GetNewAlbums[]> {
  return db
    .manyOrNone<GetNewAlbumsInput>(
      `
        SELECT      track.artist, track.album, track.collection_group_id, track.year, track.genre, track.subgenre,
                    ARRAY_AGG(LPAD(track.disc_number::text, 2, '0') || '-' || LPAD(track.track_number::text, 3, '0') || ' ' || track.title) as title
        FROM        track
        LEFT JOIN   track_old ON track.content_id = track_old.content_id
        WHERE       track_old.content_id IS NULL
        GROUP BY    track.artist, track.album, track.collection_group_id, track.year, track.genre, track.subgenre;
        `,
    )
    .then((data) =>
      data.map((row) => ({
        artist: row.artist,
        album: row.album,
        collectionGroupId: row.collection_group_id,
        year: row.year,
        genre: row.genre,
        subgenre: row.subgenre,
        title: row.title,
      })),
    );
}

type GetArtistsPick = 'album' | 'year' | 'genre' | 'subgenre';
type GetArtistsInput = Pick<DBTrack, SnakeCase<GetArtistsPick>> & {
  artist: Scalar<DBTrack['artist']>;
};
export type GetArtists = Pick<Track, GetArtistsPick> & { artist: Scalar<Track['artist']> };
export async function getArtists(): Promise<GetArtists[]> {
  return db.manyOrNone<GetArtistsInput>(
    `
        SELECT      DISTINCT ON (UNNEST(track.artist), album) UNNEST(track.artist) AS artist, track.album, track.year, track.genre, track.subgenre
        FROM        track
        `,
  );
}

type GetGenresPick = 'artist' | 'album' | 'year' | 'subgenre';
type GetGenresInput = Pick<DBTrack, SnakeCase<GetGenresPick>> & { genre: Scalar<DBTrack['genre']> };
export type GetGenres = Pick<Track, GetGenresPick> & { genre: Scalar<Track['genre']> };
export async function getGenres(): Promise<GetGenres[]> {
  return db.manyOrNone<GetGenresInput>(
    `
        SELECT      DISTINCT ON (UNNEST(track.genre)) UNNEST(track.genre) AS genre, track.subgenre, track.album, track.year, track.genre
        FROM        track
        `,
  );
}
