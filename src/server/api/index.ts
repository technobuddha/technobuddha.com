import express          from 'express';
import authentication   from './authentication';
import music            from './music';

export const api = express.Router();

api.use('/authentication', authentication);
api.use('/music', music);

api.use(
    (_req, res) =>
    {
        res.status(404).render('error/404.ejs');
    }
);

export default api;