/* eslint-disable tsdoc/syntax */
//@ts-check

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
module.exports.shorthands = undefined;

const names = [ 'track', 'track_old', 'track_new' ];

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
module.exports.up = (pgm) => {
    for(const name of names) {
        pgm.createTable(
            name,
            {
                content_id:                 { type: 'uuid',          notNull: true,  primaryKey: true },
                path:                       { type: 'text',          notNull: true },
                modified:                   { type: 'timestamptz',   notNull: true },
                artist:                     { type: 'text[]',        notNull: true },
                album:                      { type: 'text',          notNull: true },
                performer:                  { type: 'text[]' },
                composer:                   { type: 'text[]' },
                conductor:                  { type: 'text[]' },
                writer:                     { type: 'text[]' },
                genre:                      { type: 'text[]' },
                subgenre:                   { type: 'text[]' },
                title:                      { type: 'text',          notNull: true },
                subtitle:                   { type: 'text' },
                track_number:               { type: 'int',           notNull: true },
                is_compilation:             { type: 'boolean' },
                lyrics:                     { type: 'text' },
                mood:                       { type: 'text' },
                initial_key:                { type: 'text' },
                disc_number:                { type: 'int',           notNull: true },
                discs_in_set:               { type: 'int' },
                disc_title:                 { type: 'text' },
                period:                     { type: 'text' },
                year:                       { type: 'int' },
                rating:                     { type: 'int' },
                comments:                   { type: 'text' },
                tags:                       { type: 'text' },
                language:                   { type: 'text' },
                publisher:                  { type: 'text' },
                metadata_content_provider:  { type: 'text' },
                encoded_by:                 { type: 'text' },
                author_url:                 { type: 'text' },
                copyright:                  { type: 'text' },
                collection_id:              { type: 'uuid',          notNull: true },
                collection_group_id:        { type: 'uuid',          notNull: true },
                date_released:              { type: 'timestamptz' },
                unique_file_identifier:     { type: 'text' },
                beats_per_minute:           { type: 'int' },
                content_provider:           { type: 'text' },
                promotion_url:              { type: 'text' },
                parental_rating:            { type: 'text' },
                parental_rating_reason:     { type: 'text' },
                provider_style:             { type: 'text' },
                provider_rating:            { type: 'int' },
                bitrate:                    { type: 'int' },
                is_vbr:                     { type: 'boolean' },
                filesize:                   { type: 'bigint',        notNull: true },
                duration:                   { type: 'interval',      notNull: true },
            }
        );

        pgm.createIndex(name, 'collection_id');
        pgm.createIndex(name, 'collection_group_id');
    }
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
module.exports.down = (pgm) => {
    for(const name of names) {
      pgm.dropTable(name);
    }
};
