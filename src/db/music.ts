import { db }       from './driver';
import { Track }    from '#interface/Track';

export async function getTracks() {
    return db.many<Track>(
        `
        SELECT  "contentID", "artist", "album", "discNumber", "trackNumber", "title", "genre"
        FROM    track;
        `
    )
}

export default { getTracks };
