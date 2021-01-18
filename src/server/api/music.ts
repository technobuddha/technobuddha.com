import express  from 'express';
import db       from '#server/db/music';

export const music = express.Router();

music.get(
    '/tracks',
    async (_req, res) => {
        const tracks = await db.getTracks();
        res.status(200).json(tracks);
    }
)
.get(
    '/newAlbums',
    async (_req, res) => {
        const albums = await db.getNewAlbums();
        res.status(200).json(albums);
    }
)
.get(
    '/artists',
    async (_req, res) => {
        const artists = await db.getArtists();
        res.status(200).json(artists);
    }
)
.get(
    '/genres',
    async (_req, res) => {
        const artists = await db.getGenres();
        res.status(200).json(artists);
    }
);

export type { GetTracks, GetNewAlbums, GetArtists, GetGenres } from '#server/db/music';
export default music;
