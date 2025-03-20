import express from 'express';
import { getTracks, getNewAlbums, getArtists, getGenres } from '#server/db/music.js';

import type { Logger } from 'winston';
import type { Router } from 'express';

export function music(_logger: Logger): Router {
  return express
    .Router()
    .get('/tracks', (_req, res) => {
      void (async () => {
        const tracks = await getTracks();
        res.status(200).json(tracks);
      })();
    })
    .get('/newAlbums', (_req, res) => {
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

export {
  type GetTracks,
  type GetNewAlbums,
  type GetArtists,
  type GetGenres,
} from '#server/db/music.js';
