import { dbDriver } from "../dbConnection.js";
import { Post } from "../../entities/Post.js";
import { User } from "../../entities/User.js";
import { Place } from "../../entities/Place.js";



export class PostNode  {
  //Creations
  public create(post: Post): boolean {
    throw new Error("Method not implemented.");
  }

  // --------------------------------------------------------------------------------------
  // Fetches ------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async fetchUserProfilePosts(username: string): Promise<Post[]> {
    try {

        const driver = dbDriver;
        const result = await driver.executeQuery(
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
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
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
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async fetchFollowingsPosts(username: string): Promise<Post[]> {
    try {


        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:FOLLOWS]->(following:User)-[:ADD_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category),
                  (post)-[:HAPPEND_AT]->(place:Place),
                  (post)-[:TAG]->(tagged:User)
            RETURN post,
                   following.username AS username,
                   following.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
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
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async fetchSavedPosts(username: string): Promise<Post[]> {
    try {


        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:SAVE_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category),
                  (post)-[:HAPPEND_AT]->(place:Place),
                  (post)-[:TAG]->(tagged:User)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
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
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async fetchLikedPosts(username: string): Promise<Post[]> {
    try {


        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:LIKES_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category),
                  (post)-[:HAPPEND_AT]->(place:Place),
                  (post)-[:TAG]->(tagged:User)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
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
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async fetchPlacePosts(placeId : String): Promise<Post[]> {
    try {


        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (author:User)-[:ADD_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category),
                  (post)-[:HAPPEND_AT]->(place:Place {id : $placeId}),
                  (post)-[:TAG]->(tagged:User)
            RETURN post,
                   author.username AS username,
                   author.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            {placeId}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
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
  // Creations ----------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async CreatePost(post : Post): Promise<Post> {
    try {

        post.id = '0ebe80ce-87da-43b5-a320-888706665605'
        const d = Math.floor(Number(post.date))

        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (author:User {username : $username}),
                (place : Place{id:$placeId}),
                (category : Category{name:$CategoryName})

            CREATE (post:Post {
                id:$postId ,
                caption: $caption ,
                postingDate: $postingDate ,
                likesCntr: $likesCntr,
                mediaUrls: $mediaUrls,
                hashtags: $hashtags,
                commentsCntr: $commentsCntr

            })<-[:ADD_POST]-(author),  
            (post)-[:HAPPEND_AT]->(place),
            (post)-[:POST_BELONGS_TO_CATEGORY]->(category)


            WITH post  
            UNWIND $tags AS taggedUser
            MATCH (tu:User {username: taggedUser.username})
            CREATE (post)-[:TAG]->(tu)
            
            RETURN post
            
            `
            ,
            {
              //user
              username    :post.author?.username, 
              //post
              postId      :post.id,
              caption     :post.caption,
              postingDate :post.date,
              likesCntr   :post.likesCntr,
              mediaUrls   :post.mediaURL,
              hashtags    :post.hashtags,
              commentsCntr:post.commentsCntr,
              tags :post.tags,
              //place
              placeId     :post.place?.id,
              //category
              CategoryName:post.category?.name,
            }
        );

        

        return post;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }


}




