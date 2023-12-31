import request from 'supertest';

import blog from '../index.js';

describe('requests', () => {
  test('GET /', async () => {
    const res = await request(blog()).get('/');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /posts', async () => {
    const res = await request(blog()).get('/posts');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /posts/new', async () => {
    const res = await request(blog())
      .get('/posts/new');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /posts', async () => {
    const res = await request(blog())
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res.statusCode).toEqual(302);
  });

  it('POST /posts (errors)', async () => {
    const res = await request(blog())
      .post('/posts');
    expect(res.statusCode).toEqual(422);
  });

  it('GET /posts/:id', async () => {
    const query = request(blog());
    const res1 = await query
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const res2 = await query.get(res1.headers.location);
    expect(res2.statusCode).toEqual(200);
  });

  it('GET posts/:id/edit', async () => {
    const app = blog();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res1.statusCode).toEqual(302);
    const url = res1.headers.location;
    const res2 = await request(app)
      .get(url);
    expect(res2.statusCode).toEqual(200);
  });

  it('PATCH posts/:id', async () => {
    const app = blog();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .patch(url)
      .type('form')
      .send({ title: 'new post title', body: 'new post body' });
    expect(res2.statusCode).toEqual(302);
  });

  it('PATCH posts/:id (unproccessable entity)', async () => {
    const app = blog();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .patch(url);
    expect(res2.statusCode).toEqual(422);
  });

  it('DELETE posts/:id', async () => {
    const app = blog();
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .delete(url);
    expect(res2.statusCode).toEqual(302);
  });
});
