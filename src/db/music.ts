import { db }       from './driver';
import { Track }    from '#interface/Track';

export async function getTracks() {
    return db.many<Track>(
        `
        SELECT  contentid,
                mldata->'Artist'      AS artist,
                mldata->'Album'       AS album,
                mldata->'PartOfSet'   AS partofset,
                mldata->'TrackNumber' AS tracknumber,
                mldata->'Title'       AS title,
                mldata->'Genre'       AS genre
        FROM    track;
        `
    )
}

export default { getTracks };
