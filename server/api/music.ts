import express              from 'express';
import nReadLines           from 'n-readlines';

export const music = express.Router();

music.get(
    '/tracks',
    async (_req, res) => {
        let first = true;
        let second = true;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        const lineReader = new nReadLines('/home/phil/Development/hill.software/tracks.mldata');

        let line: Buffer | false;
        // eslint-disable-next-line no-cond-assign
        while(line = lineReader.next()) {
            if(first)
                res.write('[');
            else {
                if(!second) res.write(',');
                res.write(line.toString('utf-8'));
                second = false;
            }

            first = false;
        }

        res.write(']');
        res.end();
    }
)

music.post(
    '/tracks',
    async (_req, res) => {
        const lineReader = new nReadLines('/home/phil/Development/hill.software/tracks.mldata');

        let line: Buffer | false;
        // eslint-disable-next-line no-cond-assign
        while(line = lineReader.next()) {
            lineReader.close();
            res.write(line.toString('utf-8'));
            break;
        }

        res.end();
    }
)

export default music;
