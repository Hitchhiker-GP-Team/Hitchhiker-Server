import { dbDriver } from "../dbConnection.js";
import { User } from "../../entities/User.js";
import { Review } from "../../entities/Review.js";



export class ReviewNode {
    //Creations
    public create(review: Review): boolean {
        throw new Error("Method not implemented.");
    }

    // --------------------------------------------------------------------------------------
    // Fetches ------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    public async FetchUserReviews(username: string): Promise<Review[]> {
        try {
            const driver = dbDriver;
            const session = driver.session();
            const result = await session.run(
                `
        MATCH (user:User {username: $username})-[:ADD_REVIEW]->(review:Review)-[:REVIEW_ON_PLACE]->(place:Place)
        RETURN review,
               user.username AS authorUsername,
               user.profilePic AS authorProfilePic,
               place,
               review.text AS text,
               review.rating AS rating,
               review.date AS date,
               review.likesCntr AS likesCntr,
               review.dislikesCntr AS dislikesCntr
        `,
                { username }
            );
            session.close();

            const userReviews: Review[] = [];

            result.records.forEach((record) => {
                const reviewProb = record.get("review").properties;
                const placeProb = record.get("place").properties;

                const author: User = {
                    username: record.get("authorUsername"),
                    profilePic: record.get("authorProfilePic"),
                    // Add other user properties as needed
                };

                const currentReview: Review = {
                    id: reviewProb.id,
                    author: author,
                    place: {
                        id: placeProb.id,
                        mapsId: placeProb.mapsId,
                        name: placeProb.name,
                        type: placeProb.type,
                        location: placeProb.location,
                        ratings: placeProb.ratings,
                        description: placeProb.description,
                        reviewsCntr: placeProb.reviewsCntr,
                        reviews: placeProb.reviews,
                        posts: placeProb.posts,
                    },
                    text: record.get("text"),
                    rating: record.get("rating"),
                    date: record.get("date"),
                    likesCntr: record.get("likesCntr"),
                    dislikesCntr: record.get("dislikesCntr"),
                };

                userReviews.push(currentReview);
            });

            console.log(userReviews);
            return userReviews;
        } catch (err) {
            console.error(`Error fetching user reviews: ${err}`);
            throw err;
        }
    }

    public async FetchPlaceReviews(placeId: string): Promise<Review[]> {
        try {
            const driver = dbDriver;
            const session = driver.session();
            const result = await session.run(
                `
      MATCH (place:Place {id: $placeId})<-[:REVIEW_ON_PLACE]-(review:Review)<-[:ADD_REVIEW]-(author:User)
      RETURN review,
             author.username AS authorUsername,
             author.profilePic AS authorProfilePic,
             place,
             review.text AS text,
             review.rating AS rating,
             review.date AS date,
             review.likesCntr AS likesCntr,
             review.dislikesCntr AS dislikesCntr
      `,
                { placeId }
            );
            session.close();

            const placeReviews: Review[] = [];

            result.records.forEach((record) => {
                const reviewProb = record.get("review").properties;
                const author: User = {
                    username: record.get("authorUsername"),
                    profilePic: record.get("authorProfilePic"),
                };

                const currentReview: Review = {
                    id: reviewProb.id,
                    author: author,
                    place: record.get("place"), // Assuming place is a complete Place object
                    text: record.get("text"),
                    rating: record.get("rating"),
                    date: record.get("date"),
                    likesCntr: record.get("likesCntr"),
                    dislikesCntr: record.get("dislikesCntr"),
                };

                placeReviews.push(currentReview);
            });

            console.log(placeReviews);
            return placeReviews;
        } catch (err) {
            console.error(`Error fetching place reviews: ${err}`);
            throw err;
        }
    }

    public async AddReview(review: Review): Promise<Review> {
        try {

            if (!review.place || !review.author) {
                throw new Error("Place ID is missing in the review data.");
              }

            const driver = dbDriver;
            const session = driver.session();

            const result = await session.run(
                `
          MATCH (author:User {username: $username}),
                (place:Place {id: $placeId})
    
          CREATE (review:Review {
            id: $reviewId,
            text: $text,
            rating: $rating,
            date: $date,
            likesCntr: 0,
            dislikesCntr: 0
          })<-[:ADD_REVIEW]-(author),
          (review)-[:REVIEW_ON_PLACE]->(place)
          
          RETURN review
          `,
                {
                    username: review.author.username,
                    placeId: review.place.id,
                    reviewId: review.id, // Assuming review ID is provided
                    text: review.text,
                    rating: review.rating,
                    date: review.date
                }
            );

            return review;

        } catch (err) {
            console.error(`Error adding review: ${err}`);
            throw err;
        }
    }
    
    public async DeleteReview(reviewId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
                MATCH (review:Review {id: $id})
                DETACH DELETE review
                `,
                { id: reviewId }
            );
        } catch (err) {
            console.error(`Error deleting review: ${err}`);
            throw err;
        }
    }
    

}