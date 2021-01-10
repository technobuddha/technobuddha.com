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

export default music;
