// 🚨 THIS FILE IS GENERATED, CHANGES TO THIS FILE WILL BE OVERRIDDEN
import { API, type APIOptions, type RequestValidator, type ResponseValidator } from '../api.ts';

import { type components, type paths } from './music.openapi.ts';

/**
 * title: Technobuddha API
 * version: 0.1.0
 *
 * @remarks
 *
 * Access the technobuddha music collection
 */
export class MusicAPI extends API {
  /**
   *
   * Get all music tracks
   *
   * @remarks
   *
   * Get all music tracks
   */
  public async getTracks(): Promise<MusicAPI.GetTracksResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<MusicAPI.GetTracksResponse>(
      { path: `/api/music/tracks`, method: 'GET', headers },
      'getTracks',
      undefined,
      getTracksRequestValidator,
      getTracksResponseValidator,
    );
  }
  /**
   *
   * Get new albums
   *
   * @remarks
   *
   * Get new albums
   */
  public async getNewAlbums(): Promise<MusicAPI.GetNewAlbumsResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<MusicAPI.GetNewAlbumsResponse>(
      { path: `/api/music/new-albums`, method: 'GET', headers },
      'getNewAlbums',
      undefined,
      getNewAlbumsRequestValidator,
      getNewAlbumsResponseValidator,
    );
  }
  /**
   *
   * Get artists
   *
   * @remarks
   *
   * Get artists
   */
  public async getArtists(): Promise<MusicAPI.GetArtistsResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<MusicAPI.GetArtistsResponse>(
      { path: `/api/music/artists`, method: 'GET', headers },
      'getArtists',
      undefined,
      getArtistsRequestValidator,
      getArtistsResponseValidator,
    );
  }
  /**
   *
   * Get genres
   *
   * @remarks
   *
   * Get genres
   */
  public async getGenres(): Promise<MusicAPI.GetGenresResponse> {
    const headers: [string, string][] = [];
    return this.httpRequest<MusicAPI.GetGenresResponse>(
      { path: `/api/music/genres`, method: 'GET', headers },
      'getGenres',
      undefined,
      getGenresRequestValidator,
      getGenresResponseValidator,
    );
  }

  public constructor(options: APIOptions) {
    super(options);
  }
}
export namespace MusicAPI {
  export type GetTracksResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/tracks']['get']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 400;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/tracks']['get']['responses']['400']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/tracks']['get']['responses']['500']['content']['application/json'];
      };

  export type GetNewAlbumsResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/new-albums']['get']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 400;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/new-albums']['get']['responses']['400']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/new-albums']['get']['responses']['500']['content']['application/json'];
      };

  export type GetArtistsResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/artists']['get']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 400;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/artists']['get']['responses']['400']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/artists']['get']['responses']['500']['content']['application/json'];
      };

  export type GetGenresResponse =
    | {
        ok: true;
        status: 200;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/genres']['get']['responses']['200']['content']['application/json'];
      }
    | {
        ok: false;
        status: 400;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/genres']['get']['responses']['400']['content']['application/json'];
      }
    | {
        ok: false;
        status: 500;
        statusText: string;
        contentType: 'application/json';
        headers: Headers;
        payload: paths['/api/music/genres']['get']['responses']['500']['content']['application/json'];
      };

  export type Album = components['schemas']['Album'];
  export type Artist = components['schemas']['Artist'];
  export type Genre = components['schemas']['Genre'];
  export type Track = components['schemas']['Track'];
  export type Exception400 = components['schemas']['Exception400'];
  export type Exception500 = components['schemas']['Exception500'];
}

export const getTracksRequestValidator: RequestValidator = [];

const getTracksResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content_id: { type: 'string', format: 'uuid' },
            artist: { type: 'array', items: { type: 'string' } },
            album: { type: 'string' },
            disc_number: { type: 'string' },
            track_number: { type: 'string' },
            title: { type: 'string' },
            genre: { type: 'array', items: { type: 'string' } },
          },
          required: ['artist', 'album', 'disc_number', 'track_number', 'title', 'genre'],
          additionalProperties: false,
        },
      },
    },
  },
  400: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const getNewAlbumsRequestValidator: RequestValidator = [];

const getNewAlbumsResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            artist: { type: 'array', items: { type: 'string' } },
            album: { type: 'string' },
            year: { type: 'number' },
            genre: { type: 'array', items: { type: 'string' } },
            subgenre: { type: 'array', items: { type: 'string' } },
            title: { type: 'array', items: { type: 'string' } },
          },
          required: ['artist', 'album', 'year', 'genre', 'subgenre', 'title'],
          additionalProperties: false,
        },
      },
    },
  },
  400: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const getArtistsRequestValidator: RequestValidator = [];

const getArtistsResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            artist: { type: 'string' },
            album: { type: 'string' },
            genre: { type: 'array', items: { type: 'string' } },
            subgenre: { type: 'array', items: { type: 'string' } },
            year: { type: 'number' },
          },
          required: ['artist', 'album', 'genre', 'subgenre', 'year'],
          additionalProperties: false,
        },
      },
    },
  },
  400: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};

export const getGenresRequestValidator: RequestValidator = [];

const getGenresResponseValidator: ResponseValidator = {
  200: {
    headers: {
      'cache-control': { type: 'string' },
    },
    content: {
      'application/json': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            genre: { type: 'array', items: { type: 'string' } },
            subgenre: { type: 'array', items: { type: 'string' } },
            album: { type: 'string' },
            year: { type: 'number' },
          },
          required: ['genre', 'subgenre', 'album', 'year'],
          additionalProperties: false,
        },
      },
    },
  },
  400: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
  500: {
    content: {
      'application/json': {
        type: 'object',
        properties: {
          exception: { type: 'string' },
          message: { type: 'array', items: { type: 'string' } },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          method: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
};
