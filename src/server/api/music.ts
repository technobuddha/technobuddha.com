import express  from 'express';
import db       from '#db/music';

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

export default music;
