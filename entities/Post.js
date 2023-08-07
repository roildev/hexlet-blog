class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;

  }

  getThis() {
    console.log('this', this)
  }
}

export default Post;