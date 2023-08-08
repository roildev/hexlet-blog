import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import Post from './entities/Post.js';

import {getPostById, postFormValidate} from "./utils/validations.js";

export default () => {
  const app = new Express();
  app.use(morgan('combined'));
  app.set('view engine', 'pug');
  app.use('/assets', Express.static('assets'));
  app.use(methodOverride('_method'));
  app.use(bodyParser.urlencoded({ extended: false }));

  const posts = [
    new Post('hello', 'how are you?'),
    new Post('nodejs', 'story about nodejs'),
  ];

  app.get('/', (req, res) => {
    res.status(200).render('index');
  });

  app.get('/posts', (req, res) => {
    res.status(200).render('posts/index', { posts });
  });

  app.get('/posts/new', (req, res) => {
    res.status(200).render('posts/new', { form: {}, errors: {} });
  });

  app.get('/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);

    res.status(200).render('posts/show', { post });
  });

  app.get('/posts/:id/edit', (req, res) => {
    const postId = Number(req.params.id);
    const post = getPostById(posts, postId);

    const options = {
      post,
      form: { title: post.title, body: post.body },
      errors: {}
    };

    res.status(200).render('posts/edit', options);
  });

  app.post('/posts', (req, res) => {
    const { title, body } = req.body;

    if (title && body) {
      posts.push(new Post(title, body));

      const lastPostId = posts[posts.length - 1].id;

      res.redirect(`/posts/${lastPostId}`)
      return;
    }

    const errors = postFormValidate(req.body);

    res.status(422).render('posts/new', { errors });
  });

  app.patch('/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    const updatedPost = getPostById(posts, postId);
    const { title, body } = req.body;

    const errors = postFormValidate(req.body);

    if (Object.keys(errors).length > 0) {
      const options = {
        post: updatedPost,
        form: req.body,
        errors
      };

      res.status(422).render('posts/edit', options);
      return;
    }

    updatedPost.title = title;
    updatedPost.body = body;

    res.redirect(`/posts/${postId}/edit`);
  });

  app.delete('/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    const deletedPost = getPostById(posts, postId);
    const deletedPostIndex = posts.indexOf(deletedPost);

    if (deletedPostIndex !== -1) {
      posts.splice(deletedPostIndex, 1);
    }

    res.redirect('/posts');
  });

  return app;
}