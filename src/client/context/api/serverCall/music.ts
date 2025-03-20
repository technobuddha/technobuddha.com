import type { FetchAPI } from '../api-context';
import type { GetTracks, GetNewAlbums, GetArtists, GetGenres } from '#server/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
    return fetchAPI<GetGenres[]>('/api/music/genre', { method: 'GET', validStatuses: [200] });
  },
});
