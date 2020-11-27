import path             from 'path';
import express          from 'express';
import authentication   from './authentication';
import music            from './music';
import home             from '$/home';

const apiHome               = path.join(home, 'server', 'api');

export const api = express();

api.set('view engine', 'ejs');
api.set('views',        path.join(apiHome, 'views'));

api.use('/authentication', authentication);
api.use('/music', music);

api.use(
    (_req, res) =>
    {
        res.status(404).render('error/404.ejs');
    }
);

export default api;