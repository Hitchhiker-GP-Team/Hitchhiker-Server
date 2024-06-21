import { dbDriver } from "../dbConnection.js";
import { Place } from "../../entities/Place.js";


export class PlaceNode {

    public async AddPlace(place: Place): Promise<Place> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
            CREATE (place:Place {
                id: $id,
                name: $name,
                mapsId: $mapsId,
                type: $type,
                description: $description
            })
            `,
                {
                    id: place.id,
                    name: place.name,
                    mapsId: place.mapsId,
                    type: place.type,
                    description: place.description
                }
            );
            return place;
        } catch (err) {
            console.error(`Error adding place: ${err}`);
            throw err;
        }
    }

    public async EditPlace(placeId: string, updatedPlace: Place): Promise<Place> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
            MATCH (place:Place {id: $id})
            SET place.name = $name,
                place.mapsId = $mapsId,
                place.type = $type,
                place.description = $description
            `,
                {
                    id: placeId,
                    name: updatedPlace.name,
                    mapsId: updatedPlace.mapsId,
                    type: updatedPlace.type,
                    description: updatedPlace.description
                }
            );
            return updatedPlace;
        } catch (err) {
            console.error(`Error editing place: ${err}`);
            throw err;
        }
    }


    public async DeletePlace(placeId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
            MATCH (place:Place {id: $id})
            DETACH DELETE place
            `,
                {
                    id: placeId
                }
            );
        } catch (err) {
            console.error(`Error deleting place: ${err}`);
            throw err;
        }
    }

    // HAPPEND_AT post  place
    public async AddPostToPlace(postId: string, placeId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (post:Post {id: $postId}), (place:Place {id: $placeId})
        MERGE (post)-[:HAPPEND_AT]->(place)
        RETURN post, place
        `,
                { postId, placeId }
            );
        } catch (err) {
            console.error(`Error adding post to place: ${err}`);
            throw err;
        }
    }

    // PLACE_BELONGS_TO_CATEGORY place category
    public async AddPlaceToCategory(placeId: string, categoryName: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (place:Place {id: $placeId}), (category:Category {name: $categoryName})
        MERGE (place)-[:PLACE_BELONGS_TO_CATEGORY]->(category)
        RETURN place, category
        `,
                { placeId, categoryName }
            );
        } catch (err) {
            console.error(`Error adding place to category: ${err}`);
            throw err;
        }
    }

    // REVIEW_ON_PLACE review place
    public async AddReviewToPlace(reviewId: string, placeId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (review:Review {id: $reviewId}), (place:Place {id: $placeId})
        MERGE (review)-[:REVIEW_ON_PLACE]->(place)
        RETURN review, place
        `,
                { reviewId, placeId }
            );
        } catch (err) {
            console.error(`Error adding review to place: ${err}`);
            throw err;
        }
    }

    // HAS_RATING place rating
    public async AddRatingToPlace(ratingId: string, placeId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (rating:Rating {id: $ratingId}), (place:Place {id: $placeId})
        MERGE (place)-[:HAS_RATING]->(rating)
        RETURN place, rating
        `,
                { ratingId, placeId }
            );
        } catch (err) {
            console.error(`Error adding rating to place: ${err}`);
            throw err;
        }
    }

    // VISITED user place
    public async AddUserVisitedPlace(username: string, placeId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (user:User {username: $username}), (place:Place {id: $placeId})
        MERGE (user)-[:VISITED]->(place)
        RETURN user, place
        `,
                { username, placeId }
            );
        } catch (err) {
            console.error(`Error adding user visited place: ${err}`);
            throw err;
        }
    }

    public async getPlaceData(username: string, placeId: string): Promise<Place> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
                MATCH (place:Place{id : $placeId})
                return place
                `,
                { username, placeId }
            );

            const places: Place[] = [];

            result.records.forEach((record) => {
                const placeProb = record.get("place").properties;
                
                const place: Place = {

                    name: placeProb.name,
                    id: placeProb.id
               };

               places.push(place);

            })
            
            return places[0];
            
        } catch (err) {
            console.error(`Error fetching place: ${err}`);
            throw err;
        }
    }

    // public async searchPlaces(place: string): Promise<Place[]> {
    //     try {
    //         const driver = dbDriver;
    //         const session = driver.session();
    
    //         const result = await session.run(
    //             `
    //             MATCH (place:Place)
    //             WHERE place.name CONTAINS $place
    //             RETURN place
    //             `,
    //             { place: place }
    //         );
    
    //         session.close();
    
    //         return result.records.map(record => record.get("place").properties as Place);
    //     } catch (err) {
    //         console.error(`Error searching places: ${err}`);
    //         throw err;
    //     }
    // }
    public async SearchPlace(place: string): Promise<Place[]> {
        try {
            const driver = dbDriver;
            const session = driver.session();
    
            const result = await session.run(
                `
                MATCH (place:Place)
                WHERE toLower(place.name) STARTS WITH toLower($place)
                RETURN place
                `,
                { place: place }
            );
    
            session.close();
    
            return result.records.map(record => record.get("place").properties as Place);
        } catch (err) {
            console.error(`Error searching places: ${err}`);
            throw err;
        }
    }
    
    
}