export class User {
  private static counter: number = 0;
  private id: number;
  private username: String;
  constructor(username: String) {
    this.id = User.counter;
    User.counter++;
    this.username = username;
  }
}
