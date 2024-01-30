export class Category {
  private static counter: number = 0;
  private id: number;
  constructor() {
    this.id = Category.counter;
    Category.counter++;
  }
}
