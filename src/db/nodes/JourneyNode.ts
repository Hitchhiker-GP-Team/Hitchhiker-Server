import { dbDriver } from "../dbConnection.js";
import { Journey } from "../../entities/Journey.js";

export class JourneyNode {
    //Creations
    public create(journey: Journey): boolean {
        throw new Error("Method not implemented.");
    }

    public async CreateJourney(journey: Journey): Promise<Journey> {
        try {
            if (!journey.author) {
                throw new Error('Journey author is undefined');
            }
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (author:User {username: $username})
      
        CREATE (journey:Journey {
          id: $journeyId,
          title: $title,
          date: $date
        })<-[:ADD_JOURNEY]-(author)
        
        RETURN journey
        `,
                {
                    username: journey.author.username,
                    journeyId: journey.id,
                    title: journey.title,
                    date: journey.date
                }
            );

            return journey;
        } catch (err) {
            console.error(`Error creating journey: ${err}`);
            throw err;
        }
    }

    public async AddPostToJourney(postId: string, journeyId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
            MATCH (post:Post {id: $postId}),
                  (journey:Journey {id: $journeyId})
          
            CREATE (post)-[:POST_BELONGS_TO_JOURNEY]->(journey)
            `
                , { postId: postId, journeyId: journeyId }
            );
        } catch (err) {
            console.error(`Error adding post to journey: ${err}`);
            throw err;
        }
    }
    
    public async DeleteJourney(journeyId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
      MATCH (journey:Journey {id: $journeyId})
      DETACH DELETE journey
      `
                , { journeyId: journeyId }
            );
        } catch (err) {
            console.error(`Error deleting journey: ${err}`);
            throw err;
        }
    }

}