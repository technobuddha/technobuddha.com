import fetchAPI from '../fetchAPI';

import type { GetTracks, GetNewAlbums } from '#server/api';

export const music = {
    async readTracks() {
        return fetchAPI<GetTracks[]>('/api/music/tracks', {method: 'GET', validStatuses: [200]});
    },

    async newAlbums() {
        return fetchAPI<GetNewAlbums[]>('/api/music/newAlbums', {method: 'GET', validStatuses: [200]});
    }
};

export default music;
