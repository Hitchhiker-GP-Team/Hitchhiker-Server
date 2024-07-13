import { dbDriver } from "../dbConnection.js";
import { Journey } from "../../entities/Journey.js";
import { Post } from "../../entities/Post.js";
import { Place } from "../../entities/Place.js";
import { User } from "../../entities/User.js";
import { v4 as uuidv4 } from "uuid";

export class JourneyNode {
  public async CreateJourney(journey: Journey): Promise<Journey> {
    try {
      if (!journey.author) {
        throw new Error("Journey author is undefined");
      }

      // Generate UUID if journey id is not provided
      if (!journey.id) {
        journey.id = uuidv4();
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
          date: journey.date,
        }
      );

      return journey;
    } catch (err) {
      console.error(`Error creating journey: ${err}`);
      throw err;
    }
  }

  public async FetchUserJournies(username: string): Promise<Journey[]> {
    try {
      const driver = dbDriver;
      const session = driver.session();
      const result = await session.run(
        `
                MATCH (user:User {username: $username})-[:ADD_POST]->(post:Post)-[:POST_BELONGS_TO_JOURNEY]->(journey:Journey)
                WHERE NOT (user)-[:ADD_JOURNEY]->(journey)
                MERGE (user)-[:ADD_JOURNEY]->(journey)
                RETURN journey
                `,
        { username }
      );
      session.close();

      const userJournies: Journey[] = [];

      result.records.forEach((record) => {
        const journeyProb = record.get("journey").properties;

        const journey: Journey = {
          title: journeyProb.title,
          id: journeyProb.id,
          date: parseFloat(journeyProb.date),
        };

        userJournies.push(journey);
      });

      console.log(userJournies);
      return userJournies;
    } catch (err) {
      console.error(`Error retrieving journeys: ${err}`);
      throw err;
    }
  }

  public async FetchJourneyPosts(
    username: string,
    journeyId: string
  ): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
                match (j:Journey{id:$journeyId})<-[:POST_BELONGS_TO_JOURNEY]-(p:Post)
                OPTIONAL MATCH (p)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
                OPTIONAL MATCH (author:User)-[:ADD_POST]->(p)   
                OPTIONAL MATCH (p)-[:HAPPEND_AT]->(place:Place)
                OPTIONAL MATCH (p)-[:TAG]->(tagged:User)
                OPTIONAL MATCH (user:User{username:$username})-[like:LIKES_POST]->(p)
                OPTIONAL MATCH (user:User{username:$username})-[save:SAVE_POST]->(p)
                RETURN p,
                    author.username AS username,
                    author.profilePic AS profilePic,
                    category.name AS categoryName,
                    place,
                    CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                    CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                    COLLECT(tagged.username) as tags
                    ORDER BY p.postingDate DESC
                    SKIP 0
                    LIMIT 50
                `,
        { username, journeyId }
      );

      console.log("lol");

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");

        const postProb = record.get("p").properties;
        const placeProb = record.get("place").properties;

        // load Place
        const place: Place = {
          name: placeProb.name,
          mapsId: placeProb.mapsId,
          id: placeProb.id,
        };

        // load User Card
        const author: User = {
          profilePic: record.get("profilePic"),
          username: record.get("username"),
        };

        // load Post object
        const currentPost: Post = {
          id: postProb.id,
          mediaURL: postProb.mediaUrls,
          author: author,
          caption: postProb.caption,
          date: parseFloat(postProb.postingDate), // test-driven
          hashtags: postProb.hashtags,
          tags: taggedUsers,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: record.get("categoryName"),
          liked: record.get("liked"),
          saved: record.get("saved"),
        };
        userPosts.push(currentPost);
      });

      return userPosts;
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  // --------------------------------------------------------------------------------------
  // Updates ------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async AddPostToJourney(
    postId: string,
    journeyId: string
  ): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
                MATCH (post:Post {id: $postId}), (journey:Journey {id: $journeyId})
                CREATE (post)-[:POST_BELONGS_TO_JOURNEY]->(journey)
                `,
        { postId: postId, journeyId: journeyId }
      );
    } catch (err) {
      console.error(`Error adding post to journey: ${err}`);
      throw err;
    }
  }

  // --------------------------------------------------------------------------------------
  // Deletions ----------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------
  public async DeleteJourney(journeyId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
                MATCH (journey:Journey {id: $journeyId})
                DETACH DELETE journey
                `,
        { journeyId: journeyId }
      );
    } catch (err) {
      console.error(`Error deleting journey: ${err}`);
      throw err;
    }
  }

  public async DeletePostFromJourney(
    journeyId: string,
    postId: string
  ): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
                MATCH (journey:Journey {id: $journeyId})<-[relation:POST_BELONGS_TO_JOURNEY]-(post:Post{id:$postId})
                DELETE relation
                `,
        { journeyId: journeyId, postId: postId }
      );
    } catch (err) {
      console.error(`Error deleting journey: ${err}`);
      throw err;
    }
  }
}
