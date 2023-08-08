export default class User {
  static userId = 1;

  constructor(nickname, password) {
    this.id = User.userId;
    User.userId += 1;
    this.nickname = nickname;
    this.password = password;
  }
};