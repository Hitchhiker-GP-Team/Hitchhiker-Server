import { CategoryNode } from "./nodes/CategoryNode.js";
import { PostNode } from "./nodes/PostNode.js";
import { ReviewNode } from "./nodes/ReviewNode.js";

export class DbHelper {
  public static PostNode: PostNode = new PostNode();
  public static CategoryNode: CategoryNode = new CategoryNode();
  public static ReviewNode: ReviewNode = new ReviewNode();

}
