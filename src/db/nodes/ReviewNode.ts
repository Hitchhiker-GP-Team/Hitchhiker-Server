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
             place.name as placeName,
             place.id  as placeId,
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
              atmosphere : review.rating?.priceMax,
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
    

}