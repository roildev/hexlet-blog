import Express from 'express';
import bodyParser from 'body-parser';

import Post from './entities/Post.js';


const posts = [
  new Post('hello', 'how are you?'),
  new Post('nodejs', 'story about nodejs'),
];

export default () => {
  const app = new Express();
  app.set('view engine', 'pug');
  app.use('/assets', Express.static('assets'));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.status(200).render('index');
  });

  app.get('/posts', (req, res) => {
    res.status(200).render('posts/index', {posts});
  });

  app.get('/posts/new', (req, res) => {
    res.status(200).render('posts/new');
  });

  app.get('/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);

    res.status(200).render('posts/show', {post});
  });

  app.post('/posts', (req, res) => {
    const { title, body } = req.body;

    if (title && body) {
      posts.push(new Post(title, body));

      const lastPostId = posts[posts.length - 1].id;

      res.redirect(`/posts/${lastPostId}`)
      return;
    }

    const errors = {
      title: [],
      body: [],
    };

    if (!title) {
      errors.title.push('Title is required');
    }

    if (!body) {
      errors.body.push('Body is required');
    }

    console.log('errors', errors)

    res.status(422).render('posts/new', { errors: errors });

  });

  return app;
}