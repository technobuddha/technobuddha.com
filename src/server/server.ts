import express from 'express';
// eslint-disable-next-line import-x/default
import ViteExpress from 'vite-express';

const app = express();

app.get('/hello', (_, res) => {
  res.send('Hello Vite + React + TypeScript!');
});

ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'));
