import { DbHelper } from "../../db/DbHelper";
import { Review } from "../../entities/Review";

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
  //id falahy 
  export async function addReview(_: any, { authorUsername, placeId, reviewId, text, rating, date }: { authorUsername: string; placeId: string; reviewId: string; text: string; rating: number; date: number; }): Promise<Review[]> {
    try {
      const review: Review = {
        id: 123,
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