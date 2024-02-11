import { dbDriver } from "../dbConnection.js";
import { Post } from "../../entities/Post.js";
import { User } from "../../entities/User.js";
import { Place } from "../../entities/Place.js";

export class PostNode  {
  //Creations
  public create(post: Post): boolean {
    throw new Error("Method not implemented.");
  }

  //Fetches
  public fetch(primaryKey: string): Post {
    throw new Error("Method not implemented.");
  }
  public async fetchUserProfilePosts(username: string): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const session = driver.session();
      const result = await session.run(
        `
        MATCH (user:User {username: $username})-[:ADD_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category),
              (post)-[:HAPPEND_AT]->(place:Place),
              (post)-[:TAG]->(tagged:User)
        RETURN post,
               user.username AS username,
               user.profilePic AS profilePic,
               category.name AS categoryName,
               place,
               COLLECT(tagged.username) as tags
        `,
        { username }
      );
      session.close();

      //a list to hold all posts retrieved from database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tags username's
        const taggedUsers = record.get("tags");

        const postProb = record.get("post").properties;
        const placeProb = record.get("place").properties;

        //load Place
        const place: Place = {
          name: placeProb.name,
          mapsId: placeProb.mapsId,
        };

        //load User Card
        const author: User = {
          profilePic: record.get("profilePic"),
          username: record.get("username"),
        };

        //load Post object
        const currentPost: Post = {
          id: postProb.id,
          mediaURL: postProb.mediaUrls,
          author: author,
          caption: postProb.caption,
          date: postProb.postingDate.low, //test-driven
          hashtags: postProb.hashtags,
          tags: taggedUsers,
          place: place,
          keywords: postProb.keywords,
          likesCntr: postProb.likesCntr.low, //test-driven
          commentsCntr: postProb.commentsCntr.low, //test-driven
          category: record.get("categoryName"),
        };

        userPosts.push(currentPost);
      });
      console.log(userPosts);
      return userPosts;
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }


  public update(post: Post): boolean {
    throw new Error("Method not implemented.");
  }

  public delete(primaryKey: string): boolean {
    throw new Error("Method not implemented.");
  }
}
