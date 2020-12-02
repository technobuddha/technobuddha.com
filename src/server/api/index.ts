import path             from 'path';
import express          from 'express';
import authentication   from './authentication';
import music            from './music';
import paths            from 'config/paths';

const apiHome               = path.join(paths.server, 'api');

export const api = express();

api.set('view engine', 'ejs');
api.set('views',        path.join(apiHome, 'views'));           // TODO consolidate the two views direcory

api.use('/authentication', authentication);
api.use('/music', music);

api.use(
    (_req, res) =>
    {
        res.status(404).render('error/404.ejs');
    }
);

export default api;