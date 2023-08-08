class Post {
  static id = 1;

  constructor(title, body, id) {
    if (!id) {
      this.id = Post.id;
      Post.id += 1;
    } else {
      this.id = id;
    }
    this.title = title;
    this.body = body;
  }
}

export default Post;