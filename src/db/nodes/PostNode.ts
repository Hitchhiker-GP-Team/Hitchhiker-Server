import { dbDriver } from "../dbConnection.js";
import { Post } from "../../entities/Post.js";
import { User } from "../../entities/User.js";
import { Place } from "../../entities/Place.js";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../../entities/Category.js";

export class PostNode {
  // --------------------------------------------------------------------------------------
  // Fetches ------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async FetchUserProfilePosts(username: string): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (user:User {username: $username})-[:ADD_POST]->(post:Post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            SKIP 0
            LIMIT 50
            `,
        { username }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
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
          tags: postProb.tagstags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async FetchFollowingsPosts(username: string): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (user:User {username: $username})-[:FOLLOWS]->(following:User)
            OPTIONAL MATCH (following)-[:ADD_POST]->(post:Post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)

            RETURN post,
                   following.username AS username,
                   following.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            SKIP 0
            LIMIT 50
            `,
        { username }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];
      console.log(result.records[0]);
      if (result.records[0] === undefined) return [];
      result.records.forEach((record) => {
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
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
          tags: postProb.tags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async FetchSavedPosts(username: string): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (user:User {username: $username})-[:SAVE_POST]->(post:Post)
            OPTIONAL MATCH (author:User)-[:ADD_POST]->(post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            RETURN post,
                   author.username AS authorUsername,
                   author.profilePic AS authorProfilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   true AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
        { username }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tags usernames
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
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
          tags: postProb.tags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async FetchLikedPosts(username: string): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (user:User {username: $username})-[:LIKES_POST]->(post:Post)
            OPTIONAL MATCH (author:User)-[:ADD_POST]->(post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            RETURN post,
                   author.username AS authorUsername,
                   author.profilePic AS authorProfilePic,
                   category.name AS categoryName,
                   place,
                   true AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
        { username }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
        const place: Place = {
          name: placeProb.name,
          mapsId: placeProb.mapsId,
          id: placeProb.id,
        };

        // load User Card
        const author: User = {
          profilePic: record.get("authorProfilePic"),
          username: record.get("authorUsername"),
        };

        // load Post object
        const currentPost: Post = {
          id: postProb.id,
          mediaURL: postProb.mediaUrls,
          author: author,
          caption: postProb.caption,
          date: parseFloat(postProb.postingDate), // test-driven
          hashtags: postProb.hashtags,
          tags: postProb.tagstags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async FetchPlacePosts(
    username: string,
    placeId: string
  ): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (author:User)-[:ADD_POST]->(post:Post)-[:HAPPEND_AT]->(place:Place {id : $placeId})
            OPTIONAL MATCH (user:User{username:$username})
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            RETURN post,
                   author.username AS authorUsername,
                   author.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
        { placeId, username }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
        const place: Place = {
          name: placeProb.name,
          mapsId: placeProb.mapsId,
          id: placeProb.id,
        };

        // load User Card
        const author: User = {
          profilePic: record.get("profilePic"),
          username: record.get("authorUsername"),
        };

        // load Post object
        const currentPost: Post = {
          id: postProb.id,
          mediaURL: postProb.mediaUrls,
          author: author,
          caption: postProb.caption,
          date: parseFloat(postProb.postingDate), // test-driven
          hashtags: postProb.hashtags,
          tags: postProb.tags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async FetchCategoryPosts(
    username: string,
    category: string
  ): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (author:User)-[:ADD_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category{name:$category})
            OPTIONAL MATCH (user:User{username:$username})
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)

            RETURN post,
                   author.username AS authorUsername,
                   author.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
        { username, category }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tags usernames
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
        const place: Place = {
          name: placeProb.name,
          mapsId: placeProb.mapsId,
          id: placeProb.id,
        };

        // load User Card
        const author: User = {
          profilePic: record.get("profilePic"),
          username: record.get("authorUsername"),
        };
        // load Post object
        const currentPost: Post = {
          id: postProb.id,
          mediaURL: postProb.mediaUrls,
          author: author,
          caption: postProb.caption,
          date: parseFloat(postProb.postingDate), // test-driven
          hashtags: postProb.hashtags,
          tags: postProb.tags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async FetchArchivedPosts(username: string): Promise<Post[]> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (user:User {username: $username})-[:ARCHIVE_POST]->(post:Post)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   true AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
        { username }
      );

      // a list to hold all posts retrieved from the database
      const userPosts: Post[] = [];

      result.records.forEach((record) => {
        // load the list with tagged usernames
        const taggedUsers = record.get("tags");
        const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
          username: taggedUsername,
        }));

        //load post properties
        const postProb = record.get("post").properties;

        //load category
        const Category: Category = {
          name: record.get("categoryName"),
        };

        // load Place
        const placeProb = record.get("place").properties;
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
          tags: postProb.tags,
          place: place,
          keywords: postProb.keywords,
          likesCntr: parseFloat(postProb.likesCntr), // test-driven
          commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
          category: Category,
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

  public async fetchPostById(postId: string): Promise<Post | null> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (user:User)-[:ADD_POST]->(post:Post {id: $postId})
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            LIMIT 1
            `,
        { postId }
      );

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];

      // Load the list with tagged usernames
      const taggedUsers = record.get("tags");
      const tags: User[] = taggedUsers.map((taggedUsername: string) => ({
        username: taggedUsername,
      }));

      // Load post properties
      const postProb = record.get("post").properties;

      // Load category
      const category: Category = {
        name: record.get("categoryName"),
      };

      // Load place

      const placeProb = record.get("place").properties;
      const place: Place = {
        name: placeProb.name,
        mapsId: placeProb.mapsId,
        id: placeProb.id,
      };

      // Load user card
      const author: User = {
        profilePic: record.get("profilePic"),
        username: record.get("username"),
      };

      // Load post object
      const currentPost: Post = {
        id: postProb.id,
        mediaURL: postProb.mediaUrls,
        author: author,
        caption: postProb.caption,
        date: parseFloat(postProb.postingDate), // test-driven
        hashtags: postProb.hashtags,
        tags: postProb.tags,
        place: place,
        keywords: postProb.keywords,
        likesCntr: parseFloat(postProb.likesCntr), // test-driven
        commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
        category: category,
        liked: record.get("liked"),
        saved: record.get("saved"),
      };

      return currentPost;
    } catch (err) {
      console.error(`Error fetching post by ID: ${err}`);
      throw err;
    }
  }
  // --------------------------------------------------------------------------------------
  // Creations ----------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async CreatePost(post: Post): Promise<Post> {
    try {
      const d = Math.floor(Number(post.date));

      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
            MATCH (author:User {username: $username})
            MATCH (category:Category{name:$categoryName})

            //add score bettwen author and category
            MERGE (author)-[exp:HAS_EXPERIENCE_AT]->(category)
            ON CREATE SET exp.score = 100
            ON MATCH SET exp.score = exp.score + 100

            //add score to author
            SET author.score = COALESCE(author.score, 0) + 100
            //increase user's postCntr     
            SET author.postCntr = COALESCE(author.postCntr, 0) + 1

            CREATE (post:Post {
                id: $postId,
                caption: $caption,
                postingDate: $postingDate,
                likesCntr: $likesCntr,
                mediaUrls: $mediaUrls,
                hashtags: $hashtags,
                commentsCntr: $commentsCntr
            })<-[:ADD_POST]-(author),
            (post)-[belongs:POST_BELONGS_TO_CATEGORY]->(category)


            MERGE (place:Place {id: $placeId})
            ON CREATE SET place.name = $placeName,
                          place.overAll = 3,
                          place.atmosphere = 3,
                          place.affordability = 3,
                          place.accesability = 3,
                          place.minPrice = 0,
                          place.maxPrice = 0,
                          place.reviewsCntr = 0
            MERGE (post)-[rel:HAPPEND_AT]->(place)

            WITH  author ,post, $predictions AS predictedCategories
            UNWIND predictedCategories AS prediction
            MERGE (keyword:Keyword {name: prediction.name})
            MERGE (post)-[rel:POST_HAS_KEYWORD]->(keyword)
            SET rel.confidence = prediction.confidence
            


            

            RETURN post
            `,
        {
          //user
          username: post.author?.username,
          //post
          postId: post.id,
          caption: post.caption,
          postingDate: post.date,
          likesCntr: post.likesCntr,
          mediaUrls: post.mediaURL,
          hashtags: post.hashtags,
          commentsCntr: post.commentsCntr,
          tags: post.tags,
          //place
          placeId: post.place?.id,
          placeName: post.place?.name,
          //category
          categoryName: post.category?.name,
          predictions: post.keywords,
        }
      );

      return post;
    } catch (err) {
      console.error(`Error CreatePost: ${err}`);
      throw err;
    }
  }

  public async LikePost(us: string, postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username: $username}),
              (post:Post {id: $id}),
              (post)<-[:ADD_POST]-(author:User)

        OPTIONAL MATCH (post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)

        MERGE (user)-[:LIKES_POST]->(post)
        ON CREATE SET 
            post.likesCntr = post.likesCntr + 1,
            author.score = COALESCE(author.score, 0) + 10,
            user.madeLike = [true]
        FOREACH(ifthen in user.madeLike |
            //add score bettwen author and category
            MERGE (author)-[exp:HAS_EXPERIENCE_AT]->(category)
            ON CREATE SET exp.score = 10
            ON MATCH SET exp.score = exp.score + 10
            REMOVE user.madeLike
        )
        `,
        { username: us, id: postId }
      );
    } catch (err) {
      console.error(`Error LikePost: ${err}`);
      throw err;
    }
  }

  public async SavePost(us: string, postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username}),
            (post : Post{id:$id})
    
        CREATE (user)-[:SAVE_POST]->(post)
        `,
        { username: us, id: postId }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  public async ArchivePost(us: string, postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (u:User{username:$username})-[r:ADD_POST]->(p:Post{id:$id})
        DELETE r
        CREATE (u)-[:ARCHIVE_POST]->(p)
        `,
        { username: us, id: postId }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  // --------------------------------------------------------------------------------------
  // Updates ------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async UnLikePost(us: string, postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username})-[likeRel:LIKES_POST]->(post : Post{id:$id}),
              (post)<-[:ADD_POST]-(author:User),
              (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category),
              (author)-[exp:HAS_EXPERIENCE_AT]->(category)
      
        // Delete the LIKES_POST relationship
        DELETE likeRel

        // Decrement the likes counter on the post
        SET post.likesCntr = post.likesCntr - 1

        // Decrement the author's score
        SET author.score = COALESCE(author.score, 0) - 10

        // Decrement the score between the author and the category
        SET exp.score = exp.score - 10

        // Optionally remove the HAS_EXPERIENCE_AT relationship if the score reaches zero or below
        WITH exp, author, category
        WHERE exp.score <= 0
        DELETE exp

        `,
        { username: us, id: postId }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  public async UnSavePost(us: string, postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username})-[save:SAVE_POST]->(post : Post{id:$id})
        DELETE save 
        `,
        { username: us, id: postId }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  public async UnArchivePost(us: string, postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (u:User{username:$username})-[r:ARCHIVE_POST]->(p:Post{id:$id})
        DELETE r
        CREATE (u)-[:ADD_POST]->(p)
        `,
        { username: us, id: postId }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  // --------------------------------------------------------------------------------------
  // Deletions ----------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async DeletePost(postId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (post:Post{id:$id})<-[:ADD_POST]-(user:User)
        SET user.postCntr = COALESCE(user.postCntr, 0) - 1
        DETACH DELETE post
        `,
        { id: postId }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  public async DeleteALLPosts(username: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User{username:$username})-[:ADD_POST]->(post:Post)
        SET user.postCntr = 0
        DETACH DELETE post
        `,
        { username: username }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }

  public async DeleteAllArchivedPosts(username: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User{username:$username})-[:ARCHIVE_POST]->(post:Post)
        DETACH DELETE post
        `,
        { username: username }
      );
    } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
    }
  }
}
