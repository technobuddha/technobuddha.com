import { type GetArtists, type GetGenres, type GetNewAlbums, type GetTracks } from '#server/api';

import { type FetchAPI } from '../api-context.tsx';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const music = (fetchAPI: FetchAPI) => ({
  async tracks() {
    return fetchAPI<GetTracks[]>('/api/music/tracks', { method: 'GET', validStatuses: [200] });
  },

  async newAlbums() {
    return fetchAPI<GetNewAlbums[]>('/api/music/newAlbums', {
      method: 'GET',
      validStatuses: [200],
    });
  },

  async artists() {
    return fetchAPI<GetArtists[]>('/api/music/artists', { method: 'GET', validStatuses: [200] });
  },

  async genres() {
    return fetchAPI<GetGenres[]>('/api/music/genres', { method: 'GET', validStatuses: [200] });
  },
});
