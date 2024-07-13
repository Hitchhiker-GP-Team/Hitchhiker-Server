import { DbHelper } from "../../db/DbHelper.js";
import { Review } from "../../entities/Review.js";
import { v4 as uuidv4 } from "uuid";
import { IRating } from "../../entities/Rating/IRating.js";

export async function getReviewsFun(
  _: any,
  { username, currentUsername }: { username: string; currentUsername: string }
) {
  try {
    // Fetch user reviews using the database module function
    const userReviews = await DbHelper.ReviewNode.FetchUserReviews(
      username,
      currentUsername
    );
    console.log(userReviews);

    return userReviews;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}
export async function fetchPlaceReviews(
  _: any,
  { placeId, currentUsername }: { placeId: string; currentUsername: string }
): Promise<Review[]> {
  try {
    const placeReviews = await DbHelper.ReviewNode.FetchPlaceReviews(
      placeId,
      currentUsername
    );
    console.log("Place reviews fetched:", placeReviews);
    return placeReviews;
  } catch (error) {
    console.error("Error fetching place reviews:", error);
    throw error;
  }
}
export async function addReview(
  _: any,
  {
    authorUsername,
    placeId,
    text,
    overAll,
    affordability,
    accesability,
    priceMin,
    priceMax,
    atmosphere,
    date,
  }: {
    authorUsername: string;
    placeId: string;
    text: string;
    overAll: number;
    affordability: number;
    accesability: number;
    priceMin: number;
    priceMax: number;
    atmosphere: number;
    date: number;
  }
): Promise<Review[]> {
  try {
    const rating: IRating = {
      overAll,
      affordability,
      accesability,
      priceMin,
      priceMax,
      atmosphere,
    };
    const review: Review = {
      id: uuidv4(), // This will be generated dynamically
      text,
      rating,
      date,
      likesCntr: 0,
      dislikesCntr: 0,
      author: { username: authorUsername },
      place: { id: placeId },
    };

    const r = [await DbHelper.ReviewNode.AddReview(review)];
    console.log("Review added:", review);
    return r;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}
export async function deleteReview(
  _: any,
  { reviewId }: { reviewId: string }
): Promise<void> {
  try {
    await DbHelper.ReviewNode.DeleteReview(reviewId);
    console.log("Review deleted:", reviewId);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}
export async function upvoteReview(
  _: any,
  { reviewId, username }: { reviewId: string; username: string }
): Promise<void> {
  try {
    await DbHelper.ReviewNode.upvoteReview(reviewId, username);
    console.log(`Review upvoted by ${username}: ${reviewId}`);
  } catch (error) {
    console.error(`Error upvoting review ${reviewId} by ${username}:`, error);
    console.error(`Error upvote for review ${reviewId} by ${username}:`, error);
    throw error;
  }
}
export async function undoUpvoteReview(
  _: any,
  { reviewId, username }: { reviewId: string; username: string }
): Promise<void> {
  try {
    await DbHelper.ReviewNode.undoUpvoteReview(reviewId, username);
    console.log(`Undoing upvote for review ${reviewId} by ${username}`);
  } catch (error) {
    console.error(
      `Error undoing upvote for review ${reviewId} by ${username}:`,
      error
    );
    console.error(
      `Error undoing downvote for review ${reviewId} by ${username}:`,
      error
    );
    throw error;
  }
}
export async function downvoteReview(
  _: any,
  { reviewId, username }: { reviewId: string; username: string }
): Promise<void> {
  try {
    await DbHelper.ReviewNode.downvoteReview(reviewId, username);
    console.log(`Review downvoted by ${username}: ${reviewId}`);
  } catch (error) {
    console.error(`Error downvoting review ${reviewId} by ${username}:`, error);
    console.error(
      `Error downvote for review ${reviewId} by ${username}:`,
      error
    );
    throw error;
  }
}
export async function undoDownvoteReview(
  _: any,
  { reviewId, username }: { reviewId: string; username: string }
): Promise<void> {
  try {
    await DbHelper.ReviewNode.undoDownvoteReview(reviewId, username);
    console.log(`Undoing downvote for review ${reviewId} by ${username}`);
  } catch (error) {
    console.error(
      `Error undoing downvote for review ${reviewId} by ${username}:`,
      error
    );
    console.error(
      `Error undoing downvote for review ${reviewId} by ${username}:`,
      error
    );
    throw error;
  }
}
