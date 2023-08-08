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

const userFormValidate = (requestBody, users) => {
  const { nickname, password  } = requestBody;

  const errors = {};

  if (!nickname) {
    errors.nickname = 'Nickname is required';
  } else {
    const user = users.find((user) => user.nickname === nickname);

    if (user) {
      errors.nickname = 'Nickname should be unique';
    }
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

const getPostById = (posts, id) => posts.find(post => post.id === id);

export { postFormValidate, userFormValidate, getPostById };