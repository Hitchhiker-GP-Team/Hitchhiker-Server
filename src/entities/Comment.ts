export class Comment {
  private static counter: number = 0;
  private id: number;
  constructor() {
    this.id = Comment.counter;
    Comment.counter++;
  }
}
