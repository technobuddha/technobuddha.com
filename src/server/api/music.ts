import { type Router, Router as router } from 'express';
import { type Logger } from 'winston';

import { getArtists, getGenres, getNewAlbums, getTracks } from '../db/music.ts';

export function music(_logger: Logger): Router {
  return router()
    .get('/tracks', (_req, res) => {
      void (async () => {
        const tracks = await getTracks();
        res.status(200).json(tracks);
      })();
    })
    .get('/new-albums', (_req, res) => {
      void (async () => {
        const albums = await getNewAlbums();
        res.status(200).json(albums);
      })();
    })
    .get('/artists', (_req, res) => {
      void (async () => {
        const artists = await getArtists();
        res.status(200).json(artists);
      })();
    })
    .get('/genres', (_req, res) => {
      void (async () => {
        const artists = await getGenres();
        res.status(200).json(artists);
      })();
    });
}

export { type GetArtists, type GetGenres, type GetNewAlbums, type GetTracks } from '../db/music.ts';
