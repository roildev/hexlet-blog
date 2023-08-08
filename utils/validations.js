const postFormValidate = (requestBody) => {
  const { title, body } = requestBody;

  const errors = {};

  if (!title) {
    errors.title = 'Title is required';
  }

  if (!body) {
    errors.body = 'Body is required';
  }

  return errors;
};

const getPostById = (posts, id) => posts.find(post => post.id === id);

export { postFormValidate, getPostById };