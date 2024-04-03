import { DbHelper } from "../../db/DbHelper.js";
import { dbDriver } from "../../db/dbConnection.js";
import { Category } from "../../entities/Category.js";
import { Comment } from "../../entities/Comment.js";
import { Journey } from "../../entities/Journey.js";
import { Coordinates, Place } from "../../entities/Place.js";
import { Post } from "../../entities/Post.js";
import { Review } from "../../entities/Review.js";
import { User , sex } from "../../entities/User.js";
import { v4 as uuidv4 } from 'uuid';

// USER NODE FUNCTIONALITES TILL LINE 66//
export async function addUser(_: any, { username, profilePic, email, password, Name, birthDate, sex, Bio, followingCntr, followersCntr, postCntr, reviewsCntr ,homeLocation }: { username: string; profilePic: string; email: string; password: string; Name: string; birthDate: number;sex: string; Bio: string; followingCntr: number; followersCntr: number; postCntr: number; reviewsCntr: number;homeLocation:[number] }): Promise<User[]> {
  try {
    const newUser: User = {
      username,
      profilePic,
      email,
      password,
      Name,
      birthDate,
      sex,
      Bio,
      followingCntr,
      followersCntr,
      postCntr,
      reviewsCntr,
      homeLocation
    };

    
    const u =[await DbHelper.UserNode.AddUser(newUser)];
    console.log("User added:", newUser);
    return u
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}
export async function updateUser(_: any, { username, profilePic, email, password, Name, Bio }: { username: string; profilePic: string; email: string; password: string; Name: string; Bio: string; }): Promise<User[]>{
  try {
    const updatedUser: User = {
      username: username,
      profilePic: profilePic,
      email: email,
      password: password, 
      Name: Name,
      Bio: Bio
    };

    const up = [await DbHelper.UserNode.UpdateUser(username, updatedUser)];
    console.log("User updated:", updatedUser);
    return up;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user.");
  }
}
export async function deleteUser(_: any, { username }: { username: string }): Promise<void> {
  try {
    await DbHelper.UserNode.DeleteUser(username);
    console.log("User deleted:", username);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
export async function getUserProfileFun(_: any, { username }: { username: string }) {
  try {
    // Fetch user posts using the database module function
    const userInfo = await DbHelper.UserNode.FetchUserProfile(username);
    const arr = [userInfo]; // return array is the error
    console.log(arr); // return array is the error
    return arr;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
export async function followUser(_: any, { username, userToFollow }: { username: string; userToFollow: string }): Promise<void> {
  try {
    await DbHelper.UserNode.FollowUser(username, userToFollow);
    console.log("User followed:", userToFollow);
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}
export async function unfollowUser(_: any, { username, userToUnfollow }: { username: string; userToUnfollow: string }): Promise<void> {
  try {
    await DbHelper.UserNode.UnfollowUser(username, userToUnfollow);
    console.log("User unfollowed:", userToUnfollow);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}
export async function SearchUser(_: any, { user }: { user: string }): Promise<User[]> {
  try {
      const users = await DbHelper.UserNode.SearchUser(user);
      console.log(`Users found with query '${user}':`, users);
      return users;
  } catch (error) {
      console.error(`Error searching for users: ${error}`);
      throw error;
  }
}

//END OF USER NODE FUNCTIONALITIES // 

// POST NODE FUNCTIONALITES  TILL LINE 205 BEL TARTEEB//
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
    console.log(feedPosts);
    return feedPosts;
  } catch (error) {
    console.error("Error fetching user feed:", error);
    throw error;
  }
}
export async function getSavedPosts(_: any, { username }: { username: string }) {
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
export async function getLikedPosts(_: any, { username }: { username: string }) {
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
export async function getPlacePosts(_: any, { username, placeId }: { username: string, placeId: string }) {
  try {
    // Fetch place posts using the database module function
    const placePosts = await DbHelper.PostNode.FetchPlacePosts(username, placeId);
    console.log(placePosts);
    return placePosts;
  } catch (error) {
    console.error("Error fetching place posts:", error);
    throw error;
  }
}
export async function getCategoryPosts(_: any, { username, category }: { username: string, category: string }) {
  try {
    // Fetch category posts using the database module function
    const categoryPosts = await DbHelper.PostNode.FetchCategoryPosts(username, category);
    console.log(categoryPosts);
    return categoryPosts;
  } catch (error) {
    console.error("Error fetching category posts:", error);
    throw error;
  }
}
export async function getArchivedPosts(_: any, { username }: { username: string }) {
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
// export async function createPost(_: any, { authorUsername, caption, date, likesCntr, mediaUrls, hashtags, commentsCntr, placeId, categoryName }: { authorUsername: string; caption: string; date: number; likesCntr: number; mediaUrls: string[]; hashtags: string[]; commentsCntr: number; tags: string[]; placeId: string; categoryName: string; }): Promise<Post> {
//   try {
//     const post: Post = {
//       id: '0ebe80ce-87da-43b5-a320-888706665605', // Assuming this is generated by your system
//       author: { username: authorUsername },
//       caption,
//       date,
//       likesCntr,
//       mediaURL: mediaUrls,
//       hashtags,
//       commentsCntr,
//       place: { id: placeId },
//       category: { name: categoryName }
//     };

//     await DbHelper.PostNode.CreatePost(post);
//     console.log("Post created:", post);
//     return post;
//   } catch (error) {
//     console.error("Error creating post:", error);
//     throw error;
//   }
// }
export async function createPost(_: any, { authorUsername, caption, date, likesCntr, mediaUrls, hashtags, commentsCntr, placeId, categoryName }: { authorUsername: string; caption: string; date: number; likesCntr: number; mediaUrls: string[]; hashtags: string[]; commentsCntr: number; tags: string[]; placeId: string; categoryName: string; }): Promise<Post> {
  try {
    const post: Post = {
      id: '', // Leave this empty, it will be generated automatically
      author: { username: authorUsername },
      caption,
      date,
      likesCntr,
      mediaURL: mediaUrls,
      hashtags,
      commentsCntr,
      place: { id: placeId },
      category: { name: categoryName }
    };

    await DbHelper.PostNode.CreatePost(post);
    console.log("Post created:", post);
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function likePost(_: any, { username, postId }: { username: string, postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.LikePost(username, postId);
    console.log(`Post liked by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error liking post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function savePost(_: any, { username, postId }: { username: string, postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.SavePost(username, postId);
    console.log(`Post saved by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error saving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function archivePost(_: any, { username, postId }: { username: string, postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.ArchivePost(username, postId);
    console.log(`Post archived by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error archiving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function unlikePost(_: any, { username, postId }: { username: string, postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.UnLikePost(username, postId);
    console.log(`Post unliked by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error unliking post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function unsavePost(_: any, { username, postId }: { username: string, postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.UnSavePost(username, postId);
    console.log(`Post unsaved by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error unsaving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function unarchivePost(_: any, { username, postId }: { username: string, postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.UnArchivePost(username, postId);
    console.log(`Post unarchived by ${username}: ${postId}`);
  } catch (error) {
    console.error(`Error unarchiving post ${postId} by ${username}:`, error);
    throw error;
  }
}
export async function deletePost(_: any, { postId }: { postId: string }): Promise<void> {
  try {
    await DbHelper.PostNode.DeletePost(postId);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
}
export async function deleteAllPosts(_: any, { username }: { username: string }): Promise<void> {
  try {
    await DbHelper.PostNode.DeleteALLPosts(username);
    console.log(`All posts deleted for user: ${username}`);
  } catch (error) {
    console.error(`Error deleting all posts for user ${username}:`, error);
    throw error;
  }
}
export async function deleteAllArchivedPosts(_: any, { username }: { username: string }): Promise<void> {
  try {
    await DbHelper.PostNode.DeleteAllArchivedPosts(username);
    console.log(`All archived posts deleted for user: ${username}`);
  } catch (error) {
    console.error(`Error deleting all archived posts for user ${username}:`, error);
    throw error;
  }
}
// END OF POST NODE FUNCTIONALITIES //

// PLACE NODE FUNCTIONALITES TILL LINE  281//
// export async function addPlace(_: any, { id, name, mapsId, type, description }: { id: string; name: string; mapsId: string; type: string; description: string; }): Promise<Place[]> {
//   try {
//     const newPlace: Place = {
//       id,
//       name,
//       mapsId,
//       type,
//       description
//     };

//     const p = [await DbHelper.PlaceNode.AddPlace(newPlace)];
//     console.log("Place added:", newPlace);
//     return p;
//   } catch (error) {
//     console.error("Error adding place:", error);
//     throw error;
//   }
// }

export async function addPlace(_: any, { name, mapsId, type, description }: { name: string; mapsId: string; type: string; description: string; }): Promise<Place[]> {
  try {
    const id = uuidv4(); // Generate a UUID for the place ID
    const newPlace: Place = {
      id,
      name,
      mapsId,
      type,
      description
    };

    const p = [await DbHelper.PlaceNode.AddPlace(newPlace)];
    console.log("Place added:", newPlace);
    return p;
  } catch (error) {
    console.error("Error adding place:", error);
    throw error;
  }
}



export async function updatePlace(_: any, { placeId, name, mapsId, type, description }: { placeId: string; name?: string; mapsId?: string; type?: string; description?: string; }): Promise<Place[]>{
  try {
    const updatedPlace: Place = {
      id: placeId,
      name,
      mapsId,
      type,
      description
    };

    const p = [await DbHelper.PlaceNode.EditPlace(placeId, updatedPlace)];
    console.log("Place updated:", updatedPlace);
    return p;
  } catch (error) {
    console.error("Error updating place:", error);
    throw new Error("Failed to update place.");
  }
}
export async function deletePlace(_: any, { placeId }: { placeId: string }): Promise<void> {
  try {
    await DbHelper.PlaceNode.DeletePlace(placeId);
    console.log(`Place deleted: ${placeId}`);
  } catch (error) {
    console.error(`Error deleting place: ${error}`);
    throw error;
  }
}
export async function addPostToPlace(_: any, { postId, placeId }: { postId: string; placeId: string }): Promise<void> {
  try {
    await DbHelper.PlaceNode.AddPostToPlace(postId, placeId);
    console.log(`Post ${postId} added to place ${placeId}`);
  } catch (error) {
    console.error(`Error adding post to place: ${error}`);
    throw error;
  }
}
export async function addPlaceToCategory(_: any, { placeId, categoryName }: { placeId: string; categoryName: string }): Promise<void> {
  try {
    await DbHelper.PlaceNode.AddPlaceToCategory(placeId, categoryName);
    console.log(`Place ${placeId} added to category ${categoryName}`);
  } catch (error) {
    console.error(`Error adding place to category: ${error}`);
    throw error;
  }
}
export async function addReviewToPlace(_: any, { reviewId, placeId }: { reviewId: string; placeId: string }): Promise<void> {
  try {
    await DbHelper.PlaceNode.AddReviewToPlace(reviewId, placeId);
    console.log(`Review ${reviewId} added to place ${placeId}`);
  } catch (error) {
    console.error(`Error adding review to place: ${error}`);
    throw error;
  }
}
export async function addRatingToPlace(_: any, { ratingId, placeId }: { ratingId: string; placeId: string }): Promise<void> {
  try {
    await DbHelper.PlaceNode.AddRatingToPlace(ratingId, placeId);
    console.log(`Rating ${ratingId} added to place ${placeId}`);
  } catch (error) {
    console.error(`Error adding rating to place: ${error}`);
    throw error;
  }
}
export async function addUserVisitedPlace(_: any, { username, placeId }: { username: string; placeId: string }): Promise<void> {
  try {
    await DbHelper.PlaceNode.AddUserVisitedPlace(username, placeId);
    console.log(`User ${username} visited place ${placeId}`);
  } catch (error) {
    console.error(`Error adding user visited place: ${error}`);
    throw error;
  }
}

export async function SearchPlace(_: any, { place }: { place: string }): Promise<Place[]> {
  try {
      const places = await DbHelper.PlaceNode.SearchPlace(place);
      console.log(`Places found for query "${place}":`, places);
      return places;
  } catch (error) {
      console.error(`Error searching places for query "${place}":`, error);
      throw error;
  }
}
//s//
//END OF PLACE NODE FUNCTIONALITIES // 

// // COMMENT NODE FUNCTIONALITES TILL LINE 351//
// /////// ERROR  ////////

// export async function addComment(_: any, { text, date, authorUsername, postId }: { text: string; date: number; authorUsername: string; postId: string; }): Promise<{ id: string }[]> {
//   try {
//     const comment: Comment = {
//       text,
//       date,
//       likesCounter: 0,
//       repliesCntr: 0,
//       author: { username: authorUsername },
//       likedBy: [],
//       replies: []
//     };
//     console.log("Comment to be added:", comment); // Check the comment object here to ensure it's correct
//     const commentId = await DbHelper.CommentNode.addComment(comment, postId);
//     console.log("Comment added:", commentId);
//     return [{ id: commentId }];
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     throw error;
//   }
// }

export async function addComment(_: any, { text, date, authorUsername, postId }: { text: string; date: number; authorUsername: string; postId: string; }): Promise<Comment[]> {
  try {
    const comment: Comment = {
      id: uuidv4(), // Generate a UUID for the comment ID
      text,
      date,
      likesCounter: 0,
      repliesCntr: 0,
      author: { username: authorUsername },
      likedBy: [],
      replies: []
    };
    const commentId = await DbHelper.CommentNode.addComment(comment, postId);
    console.log("Comment added:", commentId);
    return [comment];
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// // /////// ERROR  ////////

// export async function replyComment(_: any, { reply ,parentId }: { reply: Comment , parentId :string }): Promise<string> {
//   try {
//     const replyId = await DbHelper.CommentNode.replyComment(reply);
//     console.log("Reply added with ID:", replyId);
//     return replyId;
//   } catch (error) {
//     console.error("Error replying to comment:", error);
//     throw error;
//   }
// }



export async function replyComment(_: any, { text, date, authorUsername, parentId }: { text: string; date: number; authorUsername: string; parentId: string; }): Promise<Comment[]> {
  try {
    const comment: Comment = {
      id: uuidv4(),
      text,
      date,
      likesCounter: 0,
      repliesCntr: 0,
      author: { username: authorUsername },
      likedBy: [],
      replies: []
    };
    const commentId = await DbHelper.CommentNode.replyComment(comment, parentId);
    console.log("Reply added:", commentId);
    return [comment];
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
// // /////// ERROR  ////////
export async function fetchComment(_: any, { commentId }: { commentId: string }): Promise<Comment[]> {
  try {
    const fetchedComment = await DbHelper.CommentNode.fetchComment(commentId);
    console.log("Comment fetched:", fetchedComment);
    return [fetchedComment];
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
}
// // /////// ERROR  ////////
// export async function updateComment(_: any, { commentId, updatedComment }: { commentId: string, updatedComment: Comment }): Promise<void> {
//   try {
//     await DbHelper.CommentNode.UpdateComment(commentId, updatedComment);
//     console.log(`Comment updated: ${commentId}`);
//   } catch (error) {
//     console.error(`Error updating comment: ${error}`);
//     throw error;
//   }
// }

export async function updateComment(_: any, { commentId, text, date, likesCounter, repliesCntr }: { commentId: string, text: string, date: number, likesCounter: number, repliesCntr: number }): Promise<Comment[]> {
  try {
    const updatedComment: Comment = {
      id: commentId,
      text,
      date,
      likesCounter,
      repliesCntr
    };

    await DbHelper.CommentNode.UpdateComment(commentId, updatedComment);
    console.log(`Comment updated: ${commentId}`);
    return [updatedComment]; // Return the updated comment in an array
  } catch (error) {
    console.error(`Error updating comment: ${error}`);
    throw new Error("Failed to update comment.");
  }
}

export async function fetchReplies(_: any, { parentCommentId }: { parentCommentId: string }): Promise<Comment[]> {
  try {
    const parentComment = await DbHelper.CommentNode.fetchReplies(parentCommentId);
    console.log("Replies fetched for comment:", parentCommentId);
    return [parentComment];
  } catch (error) {
    console.error("Error fetching replies:", error);
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
// //END OF COMMENT NODE FUNCTIONALITIES // 

// JOURNEY NODE FUNCTIONALITES TILL LINE 401//
export async function createJourney(_: any, { authorUsername, journeyId, title, date }: { authorUsername: string; journeyId: string; title: string; date: number; }): Promise<Journey[]> {
  try {
    const journey: Journey = {
      id: journeyId,
      title,
      date
    };

    const author = { username: authorUsername };
    journey.author = author;

    const j = [await DbHelper.JourneyNode.CreateJourney(journey)];
    console.log("Journey created:", journey);
    return j;
  } catch (error) {
    console.error("Error creating journey:", error);
    throw error;
  }
}
export async function getUserJourneys(_: any, { username }: { username: string }) {
  try {
    // Fetch user journey using the database module function
    const userJournies = await DbHelper.JourneyNode.FetchUserJournies(username);
    console.log(userJournies);
    return userJournies;
  } catch (error) {
    console.error("Error fetching user journeys:", error);
    throw error;
  }
}
export async function fetchJourneyPosts(_: any, { username, journeyId }: { username: string; journeyId: string }): Promise<Post[]> {
  try {
    const journeyPosts = await DbHelper.JourneyNode.FetchJourneyPosts(username, journeyId);
    console.log("Journey posts fetched:", journeyPosts);
    return journeyPosts;
  } catch (error) {
    console.error("Error fetching journey posts:", error);
    throw error;
  }
}
export async function addPostToJourney(_: any, { postId, journeyId }: { postId: string; journeyId: string }): Promise<void> {
  try {
    await DbHelper.JourneyNode.AddPostToJourney(postId, journeyId);
    console.log("Post added to journey:", postId, journeyId);
  } catch (error) {
    console.error("Error adding post to journey:", error);
    throw error;
  }
}
export async function deleteJourney(_: any, { journeyId }: { journeyId: string }): Promise<void> {
  try {
    await DbHelper.JourneyNode.DeleteJourney(journeyId);
    console.log("Journey deleted:", journeyId);
  } catch (error) {
    console.error("Error deleting journey:", error);
    throw error;
  }
}
export async function deletePostFromJourney(_: any, { journeyId, postId }: { journeyId: string; postId: string }): Promise<void> {
  try {
    await DbHelper.JourneyNode.DeletePostFromJourney(journeyId, postId);
    console.log("Post deleted from journey:", postId, journeyId);
  } catch (error) {
    console.error("Error deleting post from journey:", error);
    throw error;
  }
}
//END OF JOURNEY NODE FUNCTIONALITIES // 

// REVIEW NODE FUNCTIONALITES TILL LINE 434//
export async function getReviewsFun(_: any, { username }: { username: string }) {
  try {
    // Fetch user reviews using the database module function
    const userReviews = await DbHelper.ReviewNode.FetchUserReviews(username);
    console.log(userReviews);
    const arr =[userReviews];
    return arr;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}
export async function fetchPlaceReviews(_: any, { placeId }: { placeId: string }): Promise<Review[]> {
  try {
    const placeReviews = await DbHelper.ReviewNode.FetchPlaceReviews(placeId);
    console.log("Place reviews fetched:", placeReviews);
    return placeReviews;
  } catch (error) {
    console.error("Error fetching place reviews:", error);
    throw error;
  }
}
// export async function addReview(_: any, { authorUsername, placeId, reviewId, text, rating, date }: { authorUsername: string; placeId: string; reviewId: string; text: string; rating: number; date: number; }): Promise<Review[]> {
//   try {
//     const review: Review = {
//       id: 123,
//       text,
//       rating,
//       date,
//       likesCntr: 0,
//       dislikesCntr: 0,
//       author: { username: authorUsername },
//       place: { id: placeId }
//     };

//     const r = [await DbHelper.ReviewNode.AddReview(review)];
//     console.log("Review added:", review);
//     return r;
//   } catch (error) {
//     console.error("Error adding review:", error);
//     throw error;
//   }
// }
export async function addReview(_: any, { authorUsername, placeId, text, rating, date }: { authorUsername: string; placeId: string; text: string; rating: number; date: number; }): Promise<Review[]> {
  try {
    const review: Review = {
      id: '', // This will be generated dynamically
      text,
      rating,
      date,
      likesCntr: 0,
      dislikesCntr: 0,
      author: { username: authorUsername },
      place: { id: placeId }
    };

    const r = [await DbHelper.ReviewNode.AddReview(review)];
    console.log("Review added:", review);
    return r;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

export async function deleteReview(_: any, { reviewId }: { reviewId: string }): Promise<void> {
  try {
    await DbHelper.ReviewNode.DeleteReview(reviewId);
    console.log("Review deleted:", reviewId);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}
//END OF REVIEW NODE FUNCTIONALITIES // 

// CATEGORY NODE FUNCTIONALITES TILL LINE 434//
export async function createCategory(_: any, { name, parentName }: { name: string; parentName?: string; }): Promise<Category[]> {
  try {
    const category: Category = {
      name,
      parent: parentName ? { name: parentName } : undefined
    };

    const c = [await DbHelper.CategoryNode.create(category)];
    console.log("Category created:", category);
    return c;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}
export async function updateCategory(_: any, { oldName, newName }: { oldName: string; newName: string }): Promise<void> {
  try {
    await DbHelper.CategoryNode.rename(oldName, newName);
    console.log("Category updated:", oldName, "to", newName);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}
export async function deleteCategory(_: any, { name }: { name: string }): Promise<void> {
  try {
    await DbHelper.CategoryNode.deleteTree(name);
    console.log("Category deleted:", name);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export async function fetchCategory(_: any, { name }: { name: string }): Promise<Category[]> {
  try {
    const fetchedCategories = await DbHelper.CategoryNode.fetchOne(name);
    console.log("Categories fetched:", fetchedCategories);
    return fetchedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
export async function fetchAllCategories(): Promise<{ name: string }[]> {
  try {
    const allCategories = await DbHelper.CategoryNode.fetchAllName();
    const categoriesWithNameField = allCategories.map((categoryName) => ({ name: categoryName }));
    console.log("All categories fetched:", categoriesWithNameField);
    return categoriesWithNameField;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
}
export async function fetchCategoryTree(_: any, { name }: { name: string }): Promise<Category[]> {
  try {
    const categoryTree = await DbHelper.CategoryNode.fetchTree(name);
    console.log("Category tree fetched:", categoryTree);
    return categoryTree;
  } catch (error) {
    console.error("Error fetching category tree:", error);
    throw error;
  }
}
//END OF CATEGORY NODE FUNCTIONALITIES // 

export function numSevFun() {
  return 7;
}
