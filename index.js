import Express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import Post from "./entities/Post.js";


const posts = [
  new Post('hello', 'how are you?'),
  new Post('nodejs', 'story about nodejs'),
];

export default () => {
  const app = new Express();
  app.set('view engine', 'pug');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use('/assets', Express.static(path.join(__dirname, 'assets')));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.render('index');
  });

  return app;
}