exports.shorthands = undefined;

const names = ['track', 'track_old', 'track_new'];

exports.up = pgm => {
    for(const name of names) {
        pgm.createTable(
            name,
            {
                contentID:                  {type: 'uuid',          notNull: true,  primaryKey: true},
                path:                       {type: 'text',          notNull: true},
                modified:                   {type: 'timestamptz',   notNull: true},
                artist:                     {type: 'text[]',        notNull: true},
                album:                      {type: 'text',          notNull: true},
                performer:                  {type: 'text[]',        notNull: false},
                composer:                   {type: 'text[]',        notNull: false},
                conductor:                  {type: 'text[]',        notNull: false},
                writer:                     {type: 'text[]',        notNull: false},
                genre:                      {type: 'text[]',        notNull: false},
                subgenre:                   {type: 'text[]',        notNull: false},
                title:                      {type: 'text',          notNull: true},
                subtitle:                   {type: 'text',          notNull: false},
                trackNumber:                {type: 'int',           notNull: true},
                isCompilation:              {type: 'boolean',       notNull: false},
                lyrics:                     {type: 'text',          notNull: false},
                mood:                       {type: 'text',          notNull: false},
                initialKey:                 {type: 'text',          notNull: false},
                discNumber:                 {type: 'int',           notNull: true},
                discsInSet:                 {type: 'int',           notNull: false},
                discTitle:                  {type: 'text',          notNull: false},
                period:                     {type: 'text',          notNull: false},
                year:                       {type: 'int',           notNull: false},
                rating:                     {type: 'int',           notNull: false},
                comments:                   {type: 'text',          notNull: false},
                tags:                       {type: 'text',          notNull: false},
                language:                   {type: 'text',          notNull: false},
                publisher:                  {type: 'text',          notNull: false},
                metadataContentProvider:    {type: 'text',          notNull: false},
                encodedBy:                  {type: 'text',          notNull: false},
                authorURL:                  {type: 'text',          notNull: false},
                copyright:                  {type: 'text',          notNull: false},
                collectionID:               {type: 'uuid',          notNull: true},
                collectionGroupID:          {type: 'uuid',          notNull: true},
                dateReleased:               {type: 'timestamptz',   notNull: false},
                uniqueFileIdentifier:       {type: 'text',          notNull: false},
                beatsPerMinute:             {type: 'int',           notNull: false},
                contentProvider:            {type: 'text',          notNull: false},
                promotionURL:               {type: 'text',          notNull: false},
                parentalRating:             {type: 'text',          notNull: false},
                parentalRatingReason:       {type: 'text',          notNull: false},
                providerStyle:              {type: 'text',          notNull: false},
                providerRating:             {type: 'int',           notNull: false},
                bitrate:                    {type: 'int',           notNull: false},
                isVBR:                      {type: 'boolean',       notNull: false},
                filesize:                   {type: 'bigint',        notNull: true},
                duration:                   {type: 'interval',      notNull: true},
            }
        );
    }
};
// const track = 
// {
//     "Path":"V\\Voïvod\\Kronik\\01-007 Ion.mp3",
//     "Modified":"2018-12-07T19:53:49.4333275Z",
//     "Artist":["Voïvod"],
//     "Album":"Kronik",
//     "Performer":["Voivod"],
//     "Genre":["Rock"],
//     "Subgenre":["Thrash"],
//     "Title":"Ion",
//     "TrackNumber":7,
//     "PartOfSet":"1/1",
//     "Year":1998,
//     "ContentID":"16ed1659-6ecf-4526-8ab6-e8ad13e988d7",
//     "CollectionID":"407b60b1-dcdc-4af0-8702-fca27be265f9",
//     "CollectionGroupID":"cb06452f-1d56-4659-8090-a27132dc173a",
//     "BitRate":320000,
//     "IsVBR":false,
//     "Filesize":10897331,
//     "Duration":"00:04:32.0652750"
// }


exports.down = pgm => {
    for(const name of names) {
        pgm.dropTable(name);
    }
};
