import { DbHelper } from "../../db/DbHelper.js";
import { Post } from "../../entities/Post.js";
import { ClassificationModel } from "../../models/ClassificationModel.js";
import { DetectionModel } from "../../models/DetectionModel.js";
import { Notification } from "../../entities/Notification.js";
import { likePostNotificationService } from "../../entities/Notifications/LikePostNotificationService.js";
import { PubSub } from "graphql-subscriptions";
import { v4 as uuidv4 } from "uuid";


const pubsub = new PubSub();

export async function getPostsFun(_: any, { username }: { username: string }) {
  try {
    // Fetch user posts using the database module function
    const userPosts = await DbHelper.PostNode.FetchUserProfilePosts(username);
    console.log(userPosts);
    return userPosts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}
export async function getFeedFun(_: any, { username }: { username: string }) {
  try {
    // Fetch feed posts using the database module function
    const feedPosts = await DbHelper.PostNode.FetchFollowingsPosts(username);
    //console.log(feedPosts);
    return feedPosts;
  } catch (error) {
    console.error("Error fetching user feed:", error);
    throw error;
  }
}
export async function getSavedPosts(
  _: any,
  { username }: { username: string }
) {
  try {
    // Fetch saved posts using the database module function
    const savedPosts = await DbHelper.PostNode.FetchSavedPosts(username);
    console.log(savedPosts);
    return savedPosts;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
}
export async function getLikedPosts(
  _: any,
  { username }: { username: string }
) {
  try {
    // Fetch liked posts using the database module function
    const likedPosts = await DbHelper.PostNode.FetchLikedPosts(username);
    console.log(likedPosts);
    return likedPosts;
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    throw error;
  }
}
export async function getPlacePosts(
  _: any,
  { username, placeId }: { username: string; placeId: string }
) {
  try {
    // Fetch place posts using the database module function
    const placePosts = await DbHelper.PostNode.FetchPlacePosts(
      username,
      placeId
    );
    console.log(placePosts);
    return placePosts;
  } catch (error) {
    console.error("Error fetching place posts:", error);
    throw error;
  }
}
export async function getCategoryPosts(
  _: any,
  { username, category }: { username: string; category: string }
) {
  try {
    // Fetch category posts using the database module function
    const categoryPosts = await DbHelper.PostNode.FetchCategoryPosts(
      username,
      category
    );
    console.log(categoryPosts);
    return categoryPosts;
  } catch (error) {
    console.error("Error fetching category posts:", error);
    throw error;
  }
}
export async function fetchPostById(_: any, { postId }: { postId: string }) {
  try {
    // Fetch category posts using the database module function
    const post = await DbHelper.PostNode.fetchPostById(postId);
    console.log(post);
    return post;
  } catch (error) {
    console.error("Error fetching category posts:", error);
    throw error;
  }
}
export async function getArchivedPosts(
  _: any,
  { username }: { username: string }
) {
  try {
    // Fetch archived posts using the database module function
    const archivedPosts = await DbHelper.PostNode.FetchArchivedPosts(username);
    console.log(archivedPosts);
    return archivedPosts;
  } catch (error) {
    console.error("Error fetching archived posts:", error);
    throw error;
  }
}

export async function createPost(
  _: any,
  {
    authorUsername,
    caption,
    date,
    likesCntr,
    mediaUrls,
    hashtags,
    commentsCntr,
    placeId,
    placeName,
  }: {
    placeName: string;
    authorUsername: string;
    caption: string;
    date: number;
    likesCntr: number;
    mediaUrls: string[];
    hashtags: string[];
    commentsCntr: number;
    tags: string[];
    placeId: string;
  }
): Promise<Post> {
  try {
    const Keywords = DetectionModel.predictClasses(mediaUrls[0]);
    const classi = ClassificationModel.predictClasses(mediaUrls[0]);
    console.log("classsssssss : " + classi);

    var category = "Origin";
    if (Keywords.length != 0) {
      category = DetectionModel.mapToCategory(Keywords[0].name as string);
    }

    const post: Post = {
      id: uuidv4(),
      author: { username: authorUsername },
      caption,
      date,
      likesCntr,
      mediaURL: mediaUrls,
      hashtags,
      commentsCntr,
      place: { id: placeId, name: placeName },
      keywords: Keywords,
      category: { name: category },
    };

    await DbHelper.PostNode.CreatePost(post);
    console.log("Post created:", post);
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function createNotification(
  _: any,
  { username, message }: { username: string; message: string }
): Promise<Notification> {
  const noti: Notification = {};

  // Publish the notification to a specific topic for the user
  pubsub.publish(`NOTIFICATION_ADDED_${username}`, { notificationAdded: noti });

  return noti;
}

export function subscsribe(
  _: any,
  { username }: { username: String }
): AsyncIterator<unknown, any, undefined> {
  return pubsub.asyncIterator(`NOTIFICATION_ADDED_${username}`);
}

export async function likePost(
  _: any,
  { username, postId }: { username: string; postId: string }
): Promise<void> {
  try {
    // Like the post in the database
    await DbHelper.PostNode.LikePost(username, postId);

    //initialize notification service
    const notiService = new likePostNotificationService();

    //call notification service method
    const noti = await notiService.gnerateNotification(username, postId);

    //push the notification to the reciver
    pubsub.publish(`NOTIFICATION_ADDED_${noti.receiver}`, {
      notificationAdded: noti,
    });

    console.log(`Post liked by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error liking post ${postId} by ${username}:`, error);
    throw error;
  }
}

export async function savePost(
  _: any,
  { username, postId }: { username: string; postId: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.SavePost(username, postId);
    console.log(`Post saved by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error saving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function archivePost(
  _: any,
  { username, postId }: { username: string; postId: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.ArchivePost(username, postId);
    console.log(`Post archived by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error archiving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function unlikePost(
  _: any,
  { username, postId }: { username: string; postId: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.UnLikePost(username, postId);
    console.log(`Post unliked by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error unliking post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function unsavePost(
  _: any,
  { username, postId }: { username: string; postId: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.UnSavePost(username, postId);
    console.log(`Post unsaved by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error unsaving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function unarchivePost(
  _: any,
  { username, postId }: { username: string; postId: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.UnArchivePost(username, postId);
    console.log(`Post unarchived by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error unarchiving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function deletePost(
  _: any,
  { postId }: { postId: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.DeletePost(postId);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
}
export async function deleteAllPosts(
  _: any,
  { username }: { username: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.DeleteALLPosts(username);
    console.log(`All posts deleted for user: ${username}`);
  } catch (error) {
    console.error(`Error deleting all posts for user ${username}:`, error);
    throw error;
  }
}
export async function deleteAllArchivedPosts(
  _: any,
  { username }: { username: string }
): Promise<void> {
  try {
    await DbHelper.PostNode.DeleteAllArchivedPosts(username);
    console.log(`All archived posts deleted for user: ${username}`);
  } catch (error) {
    console.error(
      `Error deleting all archived posts for user ${username}:`,
      error
    );
    throw error;
  }
}

