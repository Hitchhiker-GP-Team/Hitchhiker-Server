import { User } from "../../entities/User.js";

class UserNode {
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
