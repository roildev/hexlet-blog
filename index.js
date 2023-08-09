import Express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import UAParser from 'ua-parser-js';

import errorsHandler from "./middlewares/errorsHandler.js";

import Post from './entities/Post.js';
import User from "./entities/User.js";
import Guest from "./entities/Guest.js";

import NotFoundError from "./errors/NotFoundError.js";

import {getPostById, postFormValidate, userFormValidate} from "./utils/validations.js";
import encrypt from "./utils/encrypt.js";

const posts = [
  new Post('hello', 'how are you?'),
  new Post('nodejs', 'story about nodejs'),
];

const users = [
  new User('admin', encrypt('qwerty'))
];

export default () => {
  const app = new Express();

  app.use(morgan('combined'));
  app.set('view engine', 'pug');
  app.use('/assets', Express.static('assets'));
  app.use(methodOverride('_method'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use((req, res, next) => {
    const parser = new UAParser(req.headers['user-agent']);
    req.useragent = parser.getResult();

    next();
  });

  app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
  }));

  app.use((req, res, next) => {
    if (req.session?.nickname) {
      const { nickname } = req.session;
      res.locals.currentUser = users.find((user) => user.nickname === nickname);
    } else {
      res.locals.currentUser = new Guest();
    }

    next();
  });

  app.get('/', (req, res) => {
    const { currentUser } = res.locals;
    res.status(200).render('index', {currentUser});
  });

  app.get('/users/new', (req, res) => {
    res.status(200).render('users/new', { form: {}, errors: {} });
  });

  app.post('/users', (req, res) => {
    const { nickname, password } = req.body;

    const errors = userFormValidate(req.body, users);

    if (Object.keys(errors).length > 0) {
      const options = { form: {}, errors };

      res.status(422).render('users/new', options);
      return;
    }

    users.push(new User(nickname, encrypt(password)));

    res.redirect('/session/new');
  });

  app.get('/session/new', (req, res) => {
    res.status(200).render('session/new', { form: { isSession: true }, errors: {} });
  });

  app.post('/session', (req, res) => {
    const { nickname, password } = req.body;
    const user = users.find(user => user.nickname === nickname);

    const options = {
      form: { isSession: true },
      errors: { common: 'Invalid nickname or password' }
    };

    if (!user) {
      res.status(422).render('session/new', options);
      return;
    }

    const passwordAreMatched = user.password === encrypt(password);

    if (!passwordAreMatched) {
      res.status(422).render('session/new', options);
      return;
    }

    req.session.nickname = nickname;
    res.redirect('/');
  });

  app.delete('/session', (req, res) => {
    req.session.destroy((err) => {
      console.error(err)
    });

    res.redirect('/');
  });

  app.get('/posts', (req, res) => {
    res.status(200).render('posts/index', { posts });
  });

  app.get('/posts/new', (req, res) => {
    res.status(200).render('posts/new', { form: {}, errors: {} });
  });

  app.get('/posts/:id', (req, res, next) => {
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);

    if (!post) {
      res.status(404);
      next(new NotFoundError('Post not found'))
    }

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

  app.use((req, res, next) => {
    next(new NotFoundError())
  });

  app.use(errorsHandler);

  return app;
}