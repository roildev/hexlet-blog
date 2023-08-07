import request from 'supertest';

import solution from '../index.js';

describe('requests', () => {
  beforeAll(() => {
    expect.extend(matchers);
  });

  test('GET /', async () => {
    const res = await request(solution()).get('/');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /posts', async () => {
    const res = await request(solution()).get('/posts');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /posts/new', async () => {
    const res = await request(solution())
      .get('/posts/new');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /posts', async () => {
    const res = await request(solution())
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res.statusCode).toEqual(302);
  });

  it('POST /posts (errors)', async () => {
    const res = await request(solution())
      .post('/posts');
    expect(res.statusCode).toEqual(422);
  });

  it('GET /posts/:id', async () => {
    const query = request(solution());
    const res1 = await query
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    const res2 = await query.get(res1.headers.location);
    expect(res2.statusCode).toEqual(200);
  });
});
