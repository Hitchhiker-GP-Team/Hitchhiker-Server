import { DbHelper } from "../../db/DbHelper.js";
import { Comment } from "../../entities/Comment.js";

// /////// ERROR  ////////
export async function addComment(_: any, { text, date, authorUsername, postId }: { text: string; date: number; authorUsername: string; postId: string; }): Promise<string> {
  try {
    const comment: Comment = {
      text,
      date,
      author: { username: authorUsername }
    };
    const commentId = await DbHelper.CommentNode.addComment(comment, postId);
    console.log("Comment added");
    return commentId;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// /////// ERROR  ////////
export async function replyComment(_: any, { reply ,parentId }: { reply: Comment , parentId :string }): Promise<string> {
  try {
    const replyId = await DbHelper.CommentNode.replyComment(reply);
    console.log("Reply added with ID:", replyId);
    return replyId;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
}
export async function likeComment(_: any, { username, commentId }: { username: string; commentId: string }): Promise<void> {
  try {
    await DbHelper.CommentNode.LikeComment(username, commentId);
    console.log(`Comment ${commentId} liked by ${username}`);
  } catch (error) {
    console.error(`Error liking comment: ${error}`);
    throw error;
  }
}
export async function unLikeComment(_: any, { username, commentId }: { username: string; commentId: string }): Promise<void> {
  try {
    await DbHelper.CommentNode.unLikeComment(username, commentId);
    console.log(`Comment ${commentId} unliked by ${username}`);
  } catch (error) {
    console.error(`Error unliking comment: ${error}`);
    throw error;
  }
}
// /////// ERROR  ////////
export async function fetchComment(_: any, { id }: { id: string }): Promise<Comment> {
  try {
    const fetchedComment = await DbHelper.CommentNode.fetchComment(id);
    console.log("Comment fetched:", fetchedComment);
    return fetchedComment;
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
}
// /////// ERROR  ////////
export async function updateComment(_: any, { commentId, updatedComment }: { commentId: string, updatedComment: Comment }): Promise<void> {
  try {
    await DbHelper.CommentNode.UpdateComment(commentId, updatedComment);
    console.log(`Comment updated: ${commentId}`);
  } catch (error) {
    console.error(`Error updating comment: ${error}`);
    throw error;
  }
}
export async function deleteComment(_: any, { commentId }: { commentId: string }): Promise<void> {
  try {
    await DbHelper.CommentNode.DeleteComment(commentId);
    console.log(`Comment deleted: ${commentId}`);
  } catch (error) {
    console.error(`Error deleting comment: ${error}`);
    throw error;
  }
}


