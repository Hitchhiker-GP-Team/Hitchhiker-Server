import { Post } from "./Post.js";
import { User } from "./User.js";

export class Journey {
  id?: string;
  author?: User;
  title?: string;
  date?: number;
  posts?: Post[];
}
