#!/bin/env -S ts-node --prefer-ts-exts  -r ./config/env.ts -r tsconfig-paths/register
import path        from 'path';
import paths       from '#config/paths';
import { db }      from '#db/driver';
import nReadLines  from 'n-readlines';
import cliProgress from 'cli-progress';
import chalk       from 'chalk';

const partOfSet = /^([0-9]+)(\/[0-9]+)?(\s*.*)$/;
function parsePartOfSet(text: string | null | undefined) {
    let disc                 = 1;
    let set                  = 1;
    let title: string | null = null;

    if(text) {
        const m = text.match(partOfSet);
        if(m) {
            disc = Number.parseInt(m[1]);
            if(m[2])
                set = Number.parseInt(m[2].slice(1));
            if(m[3])
                title = m[3].trim();
        }
        else {
            disc = Number.parseInt(text);
            if(Number.isNaN(disc)) disc = 1;
        }
    }

    if(!title) title = null;

    return { disc, set, title };
}

(async function main() {

    const b1 = new cliProgress.SingleBar({
        format: `Tracks |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    await db.task(async t => {
        await t.none('TRUNCATE track_new;');

        const lineReader = new nReadLines(path.join(paths.data, 'tracks.mldata'));

        let line: Buffer | false;
        let index = 0;
        // eslint-disable-next-line no-cond-assign
        while(line = lineReader.next()) {
            if(index++ === 0) {
                b1.start(Number.parseInt(line.toString()), 0, { speed: "N/A"  });
            } else {
                const json = JSON.parse(line.toString());
                const {
                    ContentID,
                    Path,
                    Modified,
                    Artist,
                    Album,
                    Performer,
                    Composer,
                    Conductor,
                    Writer,
                    Genre,
                    Subgenre,
                    Title,
                    Subtitle,
                    TrackNumber,
                    IsCompilation,
                    Lyrics,
                    Mood,
                    InitialKey,
                    PartOfSet,
                    Period,
                    Year,
                    Rating,
                    Comments,
                    Tags,
                    Language,
                    Publisher,
                    MetadataContentProvider,
                    EncodedBy,
                    AuthorURL,
                    Copyright,
                    CollectionID,
                    CollectionGroupID,
                    DateReleased,
                    UniqueFileIdentifier,
                    BeatsPerMinute,
                    ContentProvider,
                    PromotionURL,
                    ParentalRating,
                    ParentalRatingReason,
                    ProviderStyle,
                    ProviderRating,
                    Bitrate,
                    IsVBR,
                    Filesize,
                    Duration,
                }   = json;

                const { disc, set, title } = parsePartOfSet(PartOfSet);

                await t.none(`
                    INSERT INTO track_new 
                    (
                        "contentID",
                        "path",
                        "modified",
                        "artist",
                        "album",
                        "performer",
                        "composer",
                        "conductor",
                        "writer",
                        "genre",
                        "subgenre",
                        "title",
                        "subtitle",
                        "trackNumber",
                        "isCompilation",
                        "lyrics",
                        "mood",
                        "initialKey",
                        "discNumber",
                        "discsInSet",
                        "discTitle",
                        "period",
                        "year",
                        "rating",
                        "comments",
                        "tags",
                        "language",
                        "publisher",
                        "metadataContentProvider",
                        "encodedBy",
                        "authorURL",
                        "copyright",
                        "collectionID",
                        "collectionGroupID",
                        "dateReleased",
                        "uniqueFileIdentifier",
                        "beatsPerMinute",
                        "contentProvider",
                        "promotionURL",
                        "parentalRating",
                        "parentalRatingReason",
                        "providerStyle",
                        "providerRating",
                        "bitrate",
                        "isVBR",
                        "filesize",
                        "duration"
                    )
                    VALUES
                    (
                        $(ContentID),
                        $(Path),
                        $(Modified),
                        $(Artist),
                        $(Album),
                        $(Performer),
                        $(Composer),
                        $(Conductor),
                        $(Writer),
                        $(Genre),
                        $(Subgenre),
                        $(Title),
                        $(Subtitle),
                        $(TrackNumber),
                        $(IsCompilation),
                        $(Lyrics),
                        $(Mood),
                        $(InitialKey),
                        $(DiscNumber),
                        $(DiscsInSet),
                        $(DiscTitle),
                        $(Period),
                        $(Year),
                        $(Rating),
                        $(Comments),
                        $(Tags),
                        $(Language),
                        $(Publisher),
                        $(MetadataContentProvider),
                        $(EncodedBy),
                        $(AuthorURL),
                        $(Copyright),
                        $(CollectionID),
                        $(CollectionGroupID),
                        $(DateReleased),
                        $(UniqueFileIdentifier),
                        $(BeatsPerMinute),
                        $(ContentProvider),
                        $(PromotionURL),
                        $(ParentalRating),
                        $(ParentalRatingReason),
                        $(ProviderStyle),
                        $(ProviderRating),
                        $(Bitrate),
                        $(IsVBR),
                        $(Filesize),
                        $(Duration)
                    )
                    `,
                    {
                        ContentID,
                        Path,
                        Modified,
                        Artist,
                        Album,
                        Performer,
                        Composer,
                        Conductor,
                        Writer,
                        Genre,
                        Subgenre,
                        Title,
                        Subtitle,
                        TrackNumber,
                        IsCompilation,
                        Lyrics,
                        Mood,
                        InitialKey,
                        DiscNumber: disc,
                        DiscsInSet: set,
                        DiscTitle: title,
                        Period,
                        Year,
                        Rating,
                        Comments,
                        Tags,
                        Language,
                        Publisher,
                        MetadataContentProvider,
                        EncodedBy,
                        AuthorURL,
                        Copyright,
                        CollectionID,
                        CollectionGroupID,
                        DateReleased,
                        UniqueFileIdentifier,
                        BeatsPerMinute,
                        ContentProvider,
                        PromotionURL,
                        ParentalRating,
                        ParentalRatingReason,
                        ProviderStyle,
                        ProviderRating,
                        Bitrate,
                        IsVBR,
                        Filesize,
                        Duration,
                    }
                );

                b1.increment();
            }
        }

        await t.none('ALTER TABLE track_new RENAME TO track_xxx;');
        await t.none('ALTER TABLE track_old RENAME TO track_new;');
        await t.none('ALTER TABLE track     RENAME TO track_old;');
        await t.none('ALTER TABLE track_xxx RENAME TO track;');
        await t.none('TRUNCATE track_new;');
    });

    // stop the bar
    b1.stop();
})();