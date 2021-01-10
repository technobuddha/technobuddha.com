exports.shorthands = undefined;

const names = ['track', 'trackold', 'tracknew'];

exports.up = pgm => {
    for(const name of names) {
        pgm.createTable(
            name,
            {
                contentid:          {type: 'uuid',          notNull: true,  primaryKey: true},
                mldata:             {type: 'jsonb',         notNull: true},
            }            
        );
    }
};

exports.down = pgm => {
    for(const name of names) {
        pgm.dropTable(name);
    }
};
