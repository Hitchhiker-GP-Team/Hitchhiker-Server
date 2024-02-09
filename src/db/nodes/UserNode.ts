import { INode } from "./INode";

class UserNode<User> implements INode<User> {
  create(user: User): boolean {
    throw new Error("Method not implemented.");
  }
  fetch(primaryKey: string): User {
    throw new Error("Method not implemented.");
  }
  update(user: User): boolean {
    throw new Error("Method not implemented.");
  }
  delete(primaryKey: string): boolean {
    throw new Error("Method not implemented.");
  }
}
