import { DbHelper } from "../../db/DbHelper.js";
import { Comment } from "../../entities/Comment.js";
import { v4 as uuidv4 } from "uuid";
import { likeCommentNotificationService } from "../../entities/Notifications/LikeCommentNotificationService.js";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export async function fetchPostComments(
  _: any,
  { postId }: { postId: string }
): Promise<Comment[]> {
  try {
    const fetchedComments = await DbHelper.CommentNode.FetchPostComments(
      postId
    );
    console.log("Comment fetched:", fetchedComments);
    return fetchedComments;
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
}
export async function addComment(
  _: any,
  {
    text,
    date,
    authorUsername,
    postId,
  }: { text: string; date: number; authorUsername: string; postId: string }
): Promise<Comment[]> {
  try {
    const comment: Comment = {
      id: uuidv4(), // Generate a UUID for the comment ID
      text,
      date,
      likesCounter: 0,
      repliesCntr: 0,
      author: { username: authorUsername },
      likedBy: [],
      replies: [],
    };
    const commentId = await DbHelper.CommentNode.addComment(comment, postId);
    console.log("Comment added:", commentId);
    return [comment];
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}
export async function replyComment(
  _: any,
  {
    text,
    date,
    authorUsername,
    parentId,
  }: { text: string; date: number; authorUsername: string; parentId: string }
): Promise<Comment[]> {
  try {
    const comment: Comment = {
      id: uuidv4(),
      text,
      date,
      likesCounter: 0,
      repliesCntr: 0,
      author: { username: authorUsername },
      likedBy: [],
      replies: [],
    };
    const commentId = await DbHelper.CommentNode.replyComment(
      comment,
      parentId
    );
    console.log("Reply added:", commentId);
    return [comment];
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
}
export async function likeComment(
  _: any,
  { username, commentId }: { username: string; commentId: string }
): Promise<void> {
  try {
    await DbHelper.CommentNode.LikeComment(username, commentId);

    //initialize notification service
    const notiService = new likeCommentNotificationService();

    //call notification service method
    const noti = await notiService.gnerateNotification(username, commentId);

    //push the notification to the reciver
    pubsub.publish(`NOTIFICATION_ADDED_${noti.receiver}`, {
      notificationAdded: noti,
    });

    console.log(`Comment ${commentId} liked by ${username}`);
  } catch (error) {
    console.error(`Error liking comment: ${error}`);
    throw error;
  }
}
export async function unLikeComment(
  _: any,
  { username, commentId }: { username: string; commentId: string }
): Promise<void> {
  try {
    await DbHelper.CommentNode.unLikeComment(username, commentId);
    console.log(`Comment ${commentId} unliked by ${username}`);
  } catch (error) {
    console.error(`Error unliking comment: ${error}`);
    throw error;
  }
}
export async function fetchComment(
  _: any,
  { commentId }: { commentId: string }
): Promise<Comment[]> {
  try {
    const fetchedComment = await DbHelper.CommentNode.fetchComment(commentId);
    console.log("Comment fetched:", fetchedComment);
    return [fetchedComment];
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
}
export async function updateComment(
  _: any,
  {
    commentId,
    text,
    date,
    likesCounter,
    repliesCntr,
  }: {
    commentId: string;
    text: string;
    date: number;
    likesCounter: number;
    repliesCntr: number;
  }
): Promise<Comment[]> {
  try {
    const updatedComment: Comment = {
      id: commentId,
      text,
      date,
      likesCounter,
      repliesCntr,
    };

    await DbHelper.CommentNode.UpdateComment(commentId, updatedComment);
    console.log(`Comment updated: ${commentId}`);
    return [updatedComment]; // Return the updated comment in an array
  } catch (error) {
    console.error(`Error updating comment: ${error}`);
    throw new Error("Failed to update comment.");
  }
}
export async function fetchReplies(
  _: any,
  { parentCommentId }: { parentCommentId: string }
): Promise<Comment[]> {
  try {
    const parentComment = await DbHelper.CommentNode.fetchReplies(
      parentCommentId
    );
    console.log("Replies fetched for comment:", parentCommentId);
    return [parentComment];
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}
export async function deleteComment(
  _: any,
  { commentId }: { commentId: string }
): Promise<void> {
  try {
    await DbHelper.CommentNode.DeleteComment(commentId);
    console.log(`Comment deleted: ${commentId}`);
  } catch (error) {
    console.error(`Error deleting comment: ${error}`);
    throw error;
  }
}
