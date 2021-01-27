import fs           from 'fs-extra';
import paths        from './paths';
import { config }   from 'dotenv';
import dotenvExpand from 'dotenv-expand';

if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

[
    `${paths.env}.${process.env.NODE_ENV}.local`,
    `${paths.env}.${process.env.NODE_ENV}`,
    `${paths.env}.local`,
    paths.env,
]
.filter(fs.existsSync)
.forEach(path => dotenvExpand(config({ path })));
