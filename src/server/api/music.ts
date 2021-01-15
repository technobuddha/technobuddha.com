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
);

export type { GetTracks, GetNewAlbums } from '#server/db/music';
export default music;
