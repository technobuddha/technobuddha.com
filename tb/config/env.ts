import fs           from 'fs-extra';
import paths        from './paths';
import { config }   from 'dotenv';
import dotenvExpand from 'dotenv-expand';

if(!process.env.NODE_ENV)
    process.env.NODE_ENV = 'development';

for(const path of
    [
        `${paths.env}.${process.env.NODE_ENV}.local`,
        `${paths.env}.${process.env.NODE_ENV}`,
        `${paths.env}.local`,
        paths.env,
    ]
    .filter(file => fs.existsSync(file))
)
    dotenvExpand(config({ path }));
