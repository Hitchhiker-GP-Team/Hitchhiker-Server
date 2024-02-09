import { Post } from "../entities/Post.js";
import { PostNode } from "./nodes/PostNode.js";

export class DbHelper {
  public static PostNode: PostNode<Post> = new PostNode<Post>();
}
