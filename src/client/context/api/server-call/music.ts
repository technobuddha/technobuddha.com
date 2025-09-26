import camelcaseKeys from 'camelcase-keys';
import { type CamelCasedPropertiesDeep } from 'type-fest';

import { MusicAPI } from '#api/music';

import { FetchStatusError } from '../fetch-status-error.tsx';
import { type Album, type Artist, type Genre, type Track } from '../schema.ts';

const api = new MusicAPI({ host: 'http://localhost:3000' });

export async function tracks(): Promise<Track[]> {
  return api.getTracks().then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload) as CamelCasedPropertiesDeep<Track[]>;
      }

      case 400:
      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function newAlbums(): Promise<Album[]> {
  return api.getNewAlbums().then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload) as CamelCasedPropertiesDeep<Album[]>;
      }

      case 400:
      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function artists(): Promise<Artist[]> {
  return api.getArtists().then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload) as CamelCasedPropertiesDeep<Artist[]>;
      }

      case 400:
      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}

export async function genres(): Promise<Genre[]> {
  return api.getGenres().then((response) => {
    switch (response.status) {
      case 200: {
        return camelcaseKeys(response.payload) as CamelCasedPropertiesDeep<Genre[]>;
      }

      case 400:
      case 500:
      default: {
        throw new FetchStatusError(response);
      }
    }
  });
}
