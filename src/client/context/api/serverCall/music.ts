import fetchAPI from '../fetchAPI';

// TODO unknown, number, these should be defined by the api
export const music = {
    async readTracks() {
        return fetchAPI<Record<string, unknown>[]>('/api/music/tracks', {method: 'GET', validStatuses: [200]});
    },

    async countTracks() {
        return fetchAPI<number>('/api/music/tracks', {method: 'POST', validStatuses: [200]})
    },

    async newAlbums() {
        return fetchAPI<Record<string, unknown>[]>('/api/music/newAlbums', {method: 'GET', validStatuses: [200]});
    }
};

export default music;
