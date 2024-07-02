import { dbDriver } from "../dbConnection.js";
import { User } from "../../entities/User.js";
import { Review } from "../../entities/Review.js";
import { v4 as uuidv4 } from 'uuid';
import { Place } from "../../entities/Place.js";
import { IRating } from "../../entities/Rating/IRating.js";



export class ReviewNode {
    // --------------------------------------------------------------------------------------
    // Fetches ------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    public async FetchUserReviews(username: string, currentUsername:string): Promise<Review[]> {
        try {
            const driver = dbDriver;
            const session = driver.session();
            const result = await session.run(
                `
        MATCH (user:User {username: $username})-[:ADD_REVIEW]->(review:Review)-[:REVIEW_ON_PLACE]->(place:Place)
        OPTIONAL MATCH (:User{username : $currentUsername})-[upvote:UPVOTE_REVIEW]->(review)
        OPTIONAL MATCH (:User{username : $currentUsername})-[downvote:DOWNVOTE_REVIEW]->(review)
        RETURN review,
               user.username AS authorUsername,
               user.profilePic AS authorProfilePic,
               place,
               review.text AS text,
               review.rating AS rating,
               review.date AS date,
               review.likesCntr AS likesCntr,
               review.dislikesCntr AS dislikesCntr,
               CASE WHEN upvote IS NOT NULL THEN true ELSE false END AS isUpVoted,
               CASE WHEN downvote IS NOT NULL THEN true ELSE false END AS isDownVoted
        `,
                { username ,currentUsername}
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
                const rating : IRating = {
                    overAll: parseInt(reviewProb.overAll),
                    affordability: parseInt(reviewProb.affordability),
                    accesability: parseInt(reviewProb.accesability),
                    priceMin: parseInt(reviewProb.priceMin),
                    priceMax: parseInt(reviewProb.priceMax),
                    atmosphere: parseInt(reviewProb.atmosphere)
                }
                const currentReview: Review = {
                    id: reviewProb.id,
                    author: author,
                    place: {
                        id: placeProb.id,
                        name: placeProb.name,
                    },
                    text: record.get("text"),
                    rating:rating,
                    date: parseInt(record.get("date")),
                    likesCntr: parseInt(record.get("likesCntr")),
                    dislikesCntr: parseInt(record.get("dislikesCntr")),
                    isUpvoted:record.get("isUpVoted"),
                    isDownvoted:record.get("isDownVoted")
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

    public async FetchPlaceReviews(placeId: string,currentUsername:string): Promise<Review[]> {
        try {
            const driver = dbDriver;
            const session = driver.session();
            const result = await session.run(
            `
                MATCH (place:Place {id: $placeId})<-[:REVIEW_ON_PLACE]-(review:Review)<-[:ADD_REVIEW]-(author:User)
                OPTIONAL MATCH (:User{username : $currentUsername})-[upvote:UPVOTE_REVIEW]->(review)
                OPTIONAL MATCH (:User{username : $currentUsername})-[downvote:DOWNVOTE_REVIEW]->(review)
                RETURN review,
                        author.username AS authorUsername,
                        author.profilePic AS authorProfilePic,
                        place.name as placeName,
                        place.id  as placeId,
                        review.text AS text,
                        review.rating AS rating,
                        review.date AS date,
                        review.likesCntr AS likesCntr,
                        review.dislikesCntr AS dislikesCntr,
                        CASE WHEN upvote IS NOT NULL THEN true ELSE false END AS isUpVoted,
                        CASE WHEN downvote IS NOT NULL THEN true ELSE false END AS isDownVoted
                ORDER BY review.likesCntr DESC       
            `,
                { placeId ,currentUsername}
            );
            session.close();

            const placeReviews: Review[] = [];

            result.records.forEach((record) => {
                const reviewProb = record.get("review").properties;
                const author: User = {
                    username: record.get("authorUsername"),
                    profilePic: record.get("authorProfilePic"),
                };

                const place: Place = {
                    name: record.get("placeName"),
                    id : record.get("placeId") 
                }
                const rating : IRating = {
                    overAll: parseInt(reviewProb.overAll),
                    affordability: parseInt(reviewProb.affordability),
                    accesability: parseInt(reviewProb.accesability),
                    priceMin: parseInt(reviewProb.priceMin),
                    priceMax: parseInt(reviewProb.priceMax),
                    atmosphere: parseInt(reviewProb.atmosphere)
                }

                const currentReview: Review = {
                    id: reviewProb.id,
                    author: author,
                    place: place, // Assuming place is a complete Place object
                    text: record.get("text"),
                    rating: rating,
                    date: parseInt(record.get("date")),
                    likesCntr: parseInt(record.get("likesCntr")),
                    dislikesCntr: parseInt(record.get("dislikesCntr")),
                    isUpvoted:record.get("isUpVoted"),
                    isDownvoted:record.get("isDownVoted")
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
            throw new Error("Place ID or author is missing in the review data.");
          }
      
          const driver = dbDriver;
          const session = driver.session();
      
          // Generate a UUID for the review ID
          review.id = uuidv4();
      
          const result = await session.run(
            `
            MATCH (author:User {username: $username}),
                  (place:Place {id: $placeId})
      
            CREATE (review:Review {
              id: $reviewId,
              text: $text,
              overAll: $overAll,
              affordability: $affordability,
              accesability : $accesability,
              priceMin: $priceMin,
              priceMax : $priceMax,
              atmosphere : $atmosphere,
              date: $date,
              likesCntr: 0,
              dislikesCntr: 0
            })<-[:ADD_REVIEW]-(author),
            (review)-[:REVIEW_ON_PLACE]->(place)
            
            SET author.reviewsCntr = author.reviewsCntr+ 1

            SET place.overAll = ((place.overAll * place.reviewsCntr) + $overAll) / (place.reviewsCntr + 1)
            SET place.affordability = ((place.affordability * place.reviewsCntr) + $affordability) / (place.reviewsCntr + 1)
            SET place.accesability = ((place.accesability * place.reviewsCntr) + $accesability) / (place.reviewsCntr + 1)
            SET place.minPrice = ((place.minPrice * place.reviewsCntr) + $priceMin) / (place.reviewsCntr + 1)
            SET place.maxPrice = ((place.maxPrice * place.reviewsCntr) + $priceMax) / (place.reviewsCntr + 1)
            SET place.atmosphere = ((place.atmosphere * place.reviewsCntr) + $atmosphere) / (place.reviewsCntr + 1)

            SET place.reviewsCntr = place.reviewsCntr + 1

            //add score to author
            SET author.score = author.score + 100
      
            RETURN review
            `,
            {
              username: review.author?.username,
              placeId: review.place?.id,
              reviewId: review.id,
              text: review.text,
              rating: review.rating,
              date: review.date,
              overAll: review.rating?.overAll,
              affordability: review.rating?.affordability,
              accesability : review.rating?.accesability,
              priceMin: review.rating?.priceMin,
              priceMax : review.rating?.priceMax,
              atmosphere : review.rating?.atmosphere,
              
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
                MATCH (review:Review {id: $id})<-[:ADD_REVIEW]-(author:User)
                SET author.reviewsCntr = author.reviewsCntr - 1
                DETACH DELETE review
                `,
                { id: reviewId }
            );
        } catch (err) {
            console.error(`Error deleting review: ${err}`);
            throw err;
        }
    }

    public async upvoteReview(reviewId: string, username: string): Promise<void> {
        this.undoDownvoteReview(reviewId,username);
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
                MATCH (review:Review {id: $reviewId}),
                      (user:User {username: $username}),
                      (review)<-[:ADD_REVIEW]-(author:User)
                MERGE (user)-[upvote:UPVOTE_REVIEW]->(review)
                ON CREATE SET review.likesCntr = COALESCE(review.likesCntr, 0) + 1,
                              author.totalUpvotes = COALESCE(author.totalUpvotes, 0) + 1
                `,
                { reviewId, username }
            );
        } catch (err) {
            console.error(`Error upvoting review: ${err}`);
            throw err;
        }
    }
    public async undoUpvoteReview(reviewId: string, username: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
                MATCH (user:User {username: $username})-[upvote:UPVOTE_REVIEW]->(review:Review {id: $reviewId}),
                    (review)<-[:ADD_REVIEW]-(author:User)
                DELETE upvote

                WITH review, author, CASE WHEN upvote IS NOT NULL THEN 1 ELSE 0 END AS hasUpvote
                    SET review.likesCntr = review.likesCntr - hasUpvote,
                    author.totalUpvotes = author.totalUpvotes - hasUpvote
                `,
                { reviewId, username }
            );
        } catch (err) {
            console.error(`Error undoing upvote for review: ${err}`);
            throw err;
        }
    }
    

    public async downvoteReview(reviewId: string, username: string): Promise<void> {
        this.undoUpvoteReview(reviewId,username);
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
                MATCH (review:Review {id: $reviewId}),
                      (user:User {username: $username}),
                      (review)<-[:ADD_REVIEW]-(author:User)
                MERGE (user)-[downvote:DOWNVOTE_REVIEW]->(review)
                ON CREATE SET review.dislikesCntr = COALESCE(review.dislikesCntr, 0) + 1,
                              author.totalDownvotes = COALESCE(author.totalDownvotes, 0) + 1
                `,
                { reviewId, username }
            );
        } catch (err) {
            console.error(`Error upvoting review: ${err}`);
            throw err;
        }
    }
    public async undoDownvoteReview(reviewId: string, username: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
                MATCH (user:User {username: $username})-[downvote:DOWNVOTE_REVIEW]->(review:Review {id: $reviewId}),
                    (review)<-[:ADD_REVIEW]-(author:User)
                DELETE downvote

                WITH review, author, CASE WHEN downvote IS NOT NULL THEN 1 ELSE 0 END AS hasDownvote
                    SET review.dislikesCntr = review.dislikesCntr - hasDownvote,
                    author.totalDownvotes = author.totalDownvotes - hasDownvote
                `,
                { reviewId, username }
            );
        } catch (err) {
            console.error(`Error undoing upvote for review: ${err}`);
            throw err;
        }
    }
    
    
    

}