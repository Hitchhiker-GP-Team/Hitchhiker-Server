export class Review {
  private static counter: number = 0;
  private id: number;
  constructor() {
    this.id = Review.counter;
    Review.counter++;
  }
}
