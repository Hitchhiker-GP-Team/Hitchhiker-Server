import { dbDriver } from "../dbConnection.js";
import { Comment } from "../../entities/Comment.js";
import { User } from "../../entities/User.js";
import { v4 } from "uuid";
import { auth } from "neo4j-driver";
console.log(v4());

export class CommentNode {
  // public async addComment(comment: Comment, postId: string): Promise<string> {
  //   try {
  //     comment.id = v4();
  //     await dbDriver.executeQuery(
  //       `
  //       CREATE (
  //           comment:Comment
  //           {
  //               id:$id,
  //               text: $text,
  //               date: $date,
  //               likesCntr:0,
  //               repliesCntr: 0
  //           }
  //           )
  //           WITH comment
  //           MATCH (user:User {username : $username})
  //           CREATE (user)-[:ADD_COMMENT]->(comment)
  //           WITH comment
  //           MATCH (post : Post{id:$postId})
  //           CREATE (comment)-[:COMMENT_ON_POST]->(post)
  //           `,
  //       {
  //         id: comment.id,
  //         text: comment.text,
  //         date: comment.date,
  //         username: comment.author!.username,
  //         postId: postId,
  //       },
  //       { database: "neo4j" }
  //     );
  //     return comment.id;
  //   } catch (err) {
  //     console.error(`Error CommentNode.addComment(): ${err}`);
  //     throw err;
  //   }
  // }
  public async addComment(comment: Comment, postId: string): Promise<string> {
    try {
      const driver = dbDriver;
      const session = driver.session();
  
      const result = await session.run(
        `
        MATCH (user:User {username: $username})
        MATCH (post:Post {id: $postId})
        CREATE (comment:Comment {
          id: $id,
          text: $text,
          date: $date,
          likesCounter: $likesCounter,
          repliesCntr: $repliesCntr
        })<-[:ADD_COMMENT]-(user)
        CREATE (comment)-[:COMMENT_ON_POST]->(post)
        SET post.commentsCntr = post.commentsCntr +1 
        RETURN comment
        `,
        {
          id: comment.id,
          text: comment.text,
          date: comment.date,
          likesCounter: comment.likesCounter,
          repliesCntr: comment.repliesCntr,
          username: comment.author?.username,
          postId: postId
        }
      );
  
      session.close();
  
      return comment.id || ''; // Ensure that comment.id is not undefined
    } catch (err) {
      console.error(`Error adding comment: ${err}`);
      throw err;
    }
  }

  // public async replyComment(reply: Comment): Promise<string> {
  //   try {
  //     reply.id = v4();
  //     await dbDriver.executeQuery(
  //       `
  //       CREATE (
  //           reply:Comment
  //           {
  //               id:$id,
  //               text: $text,
  //               date: $date,
  //               likesCntr:0,
  //               repliesCntr: 0
  //           }
  //           )
  //           WITH reply
  //           MATCH (user:User {username : $username})
  //           CREATE (user)-[:ADD_COMMENT]->(reply)
  //           WITH reply
  //           MATCH (parentComment : Comment{id:$parentId})
  //           SET parentComment.repliesCntr = parentComment.repliesCntr + 1  
  //           CREATE (reply)-[:REPLY_TO]->(parentComment)
  //           `,
  //       {
  //         id: reply.id,
  //         text: reply.text,
  //         date: reply.date,
  //         username: reply.author!.username,
  //         parentId: reply.parentId,
  //       },
  //       { database: "neo4j" }
  //     );
  //     return reply.id;
  //   } catch (err) {
  //     console.error(`Error CommentNode.replyComment(): ${err}`);
  //     throw err;
  //   }
  // }

  // public async replyComment(reply: Comment, parentId: string): Promise<string> {
  //   try {
  //     const driver = dbDriver;
  //     const session = driver.session();
  
  //     const result = await session.run(
  //       `
  //       MATCH (user:User {username: $username})
  //       MATCH (parentComment:Comment {id: $parentId})
  //       CREATE (reply:Comment {
  //         id: $id,
  //         text: $text,
  //         date: $date,
  //         likesCounter: 0,
  //         repliesCntr: 0
  //       })<-[:REPLY_TO]-(parentComment)<-[:ADD_COMMENT]-(user)
  //       RETURN reply
  //       `,
  //       {
  //         id: reply.id,
  //         text: reply.text,
  //         date: reply.date,
  //         username: reply.author!.username,
  //         parentId: parentId
  //       }
  //     );
  
  //     session.close();
  
  //     return reply.id || '';
  //   } catch (err) {
  //     console.error(`Error replying to comment: ${err}`);
  //     throw err;
  //   }
  // }
  //correct vvvvvvv
  // public async replyComment(reply: Comment, parentId: string): Promise<string> {
  //   try {
  //     const driver = dbDriver;
  //     const session = driver.session();
  
  //     const result = await session.run(
  //       `
  //       MATCH (parentComment:Comment {id: $parentId})
  //       MATCH (user:User {username: $username})
  //       CREATE (reply:Comment {
  //         id: $id,
  //         text: $text,
  //         date: $date,
  //         likesCounter: 0,
  //         repliesCntr: 0
  //       })-[:REPLY_TO]->(parentComment)<-[:ADD_COMMENT]-(user)
  //       RETURN reply
  //       `,
  //       {
  //         id: reply.id,
  //         text: reply.text,
  //         date: reply.date,
  //         username: reply.author!.username,
  //         parentId: parentId
  //       }
  //     );
  
  //     session.close();
  
  //     return reply.id || '';
  //   } catch (err) {
  //     console.error(`Error replying to comment: ${err}`);
  //     throw err;
  //   }
  // }
  public async replyComment(reply: Comment, parentId: string): Promise<string> {
    try {
      const driver = dbDriver;
      const session = driver.session();
  
      const result = await session.run(
        `
        MATCH (parentComment:Comment {id: $parentId})
        MATCH (user:User {username: $username})
        CREATE (reply:Comment {
          id: $id,
          text: $text,
          date: $date,
          likesCounter: 0,
          repliesCntr: 0
        })
        CREATE (user)-[:ADD_REPLY]->(reply)
        CREATE (reply)-[:REPLY_TO]->(parentComment)
        RETURN reply
        `,
        {
          id: reply.id,
          text: reply.text,
          date: reply.date,
          username: reply.author!.username,
          parentId: parentId
        }
      );
  
      session.close();
  
      return reply.id || '';
    } catch (err) {
      console.error(`Error replying to comment: ${err}`);
      throw err;
    }
  }
  

  public async LikeComment(username: string, commentId: string) {
    try {
      await dbDriver.executeQuery(
        `
        MATCH (user:User {username : $username})
        WITH user
        MATCH (comment:Comment {id:$id})
        SET comment.likesCntr = comment.likesCntr + 1        
        CREATE (user)-[:LIKES_COMMENT]->(comment)
        `,
        { username: username, id: commentId }
      );
    } catch (err) {
      console.error(`Error CommentNode.LikeComment(): ${err}`);
      throw err;
    }
  }
  
  public async unLikeComment(username: string, commentId: string) {
    try {
      const driver = dbDriver;
      await driver.executeQuery(
        `
        MATCH (user:User {username : $username})-[like:LIKES_COMMENT]->(comment:Comment {id:$id})
        SET comment.likesCntr = comment.likesCntr - 1       
        DELETE like
        `,
        { username: username, id: commentId }
      );
    } catch (err) {
      console.error(`Error CommentNode.unLikeComment(): ${err}`);
      throw err;
    }
  }

  //fetch


  // public async fetchComment(id: string): Promise<Comment> {
  //   try {
  //     const { records } = await dbDriver.executeQuery(
  //       `
  //       MATCH (comment:Comment{id:$id})<-[:ADD_COMMENT]-(author:User)
  //       RETURN comment,author
  //       `,
  //       { id: id },
  //       { database: "neo4j" }
  //     );
  //     console.log(JSON.stringify(records[0], null, 2));
  //     const comment: Comment = this.fillData(
  //       records[0].get("author").properties,
  //       records[0].get("comment").properties
  //     );
  //     return comment;
  //   } catch (err) {
  //     console.error(`Error CommentNode.fetchComment(): ${err}`);
  //     throw err;
  //   }
  // }

  public async fetchComment(id: string): Promise<Comment> {
    try {
      const { records } = await dbDriver.executeQuery(
        `
        MATCH (comment:Comment{id:$id})<-[:ADD_COMMENT]-(author:User)
        RETURN comment, author
        `,
        { id: id },
        { database: "neo4j" }
      );
  
      if (records.length === 0) {
        throw new Error(`Comment with id ${id} not found.`);
      }
  
      const commentRecord = records[0].get("comment");
      const authorRecord = records[0].get("author");
  
      const comment: Comment = {
        id: commentRecord.properties.id,
        text: commentRecord.properties.text,
        date: commentRecord.properties.date,
        likesCounter: commentRecord.properties.likesCounter,
        repliesCntr: commentRecord.properties.repliesCntr,
        author: {
          username: authorRecord.properties.username,
          profilePic: authorRecord.properties.profilePic,
          email: authorRecord.properties.email,
          password: authorRecord.properties.password,
          Name: authorRecord.properties.Name,
          birthDate: authorRecord.properties.birthDate,
          homeLocation: authorRecord.properties.homeLocation,
          sex: authorRecord.properties.sex,
          Bio: authorRecord.properties.Bio,
          followingCntr: authorRecord.properties.followingCntr,
          followings: authorRecord.properties.followings,
          followersCntr: authorRecord.properties.followersCntr,
          followers: authorRecord.properties.followers,
          posts: authorRecord.properties.posts,
          postCntr: authorRecord.properties.postCntr,
          reviews: authorRecord.properties.reviews,
          reviewsCntr: authorRecord.properties.reviewsCntr,
        },
        likedBy: [], // You may need to populate this if necessary
        replies: [], // You may need to populate this if necessary
      };
  
      return comment;
    } catch (err) {
      console.error(`Error CommentNode.fetchComment(): ${err}`);
      throw err;
    }
  }
  

  //   async fetchReplies(parentCommentId: string): Promise<Comment> {
  //     try {
  //       const { records } = await dbDriver.executeQuery(
  //         `
  //         MATCH (parentCommentAuthor:User)-[:ADD_COMMENT]->(parentComment:Comment {id:$id})<-[:REPLY_TO]-(reply:Comment)
  //         RETURN parentComment,parentCommentAuthor,reply
  //         `,
  //         { id: parentCommentId },
  //         { database: "neo4j" }
  //       );
  //       //   const author = records[0].get("parentCommentAuthor").properties;
  //       //   console.log(JSON.stringify(author, null, 2));
  //       const parentComment: Comment = this.fillData(
  //         records[0].get("parentCommentAuthor").properties,
  //         records[0].get("parentComment").properties
  //       );
  //       //if found reply(ies)
  //       if (records[0]) {
  //         parentComment.replies = [];
  //         for (let record of records) {
  //           {
  //             const replyId: string = record.get("reply").properties.id;
  //             const reply: Comment = await this.fetchReplies(replyId);
  //             parentComment.replies!.push(reply);
  //           }
  //         }
  //       }
  //       return parentComment;
  //     } catch (err) {
  //       console.error(`Error CategoryNode.fetchReplies(): ${err}`);
  //       throw err;
  //     }
  //   }

  public async fetchReplies(parentCommentId: string): Promise<Comment> {
    try {
      const { records } = await dbDriver.executeQuery(
        `
        MATCH (parentComment:Comment {id: $id})<-[:REPLY_TO]-(reply:Comment)<-[:ADD_COMMENT]-(author:User)
        RETURN reply, author
        `,
        { id: parentCommentId },
        { database: "neo4j" }
      );
  
      const parentComment: Comment = await this.fetchComment(parentCommentId);
      parentComment.replies = [];
  
      for (const record of records) {
        const replyRecord = record.get("reply");
        const authorRecord = record.get("author");
  
        const reply: Comment = {
          id: replyRecord.properties.id,
          text: replyRecord.properties.text,
          date: replyRecord.properties.date,
          likesCounter: replyRecord.properties.likesCounter,
          repliesCntr: replyRecord.properties.repliesCntr,
          author: {
            username: authorRecord.properties.username,
            profilePic: authorRecord.properties.profilePic,
            email: authorRecord.properties.email,
            password: authorRecord.properties.password,
            Name: authorRecord.properties.Name,
            birthDate: authorRecord.properties.birthDate,
            homeLocation: authorRecord.properties.homeLocation,
            sex: authorRecord.properties.sex,
            Bio: authorRecord.properties.Bio,
            followingCntr: authorRecord.properties.followingCntr,
            followings: authorRecord.properties.followings,
            followersCntr: authorRecord.properties.followersCntr,
            followers: authorRecord.properties.followers,
            posts: authorRecord.properties.posts,
            postCntr: authorRecord.properties.postCntr,
            reviews: authorRecord.properties.reviews,
            reviewsCntr: authorRecord.properties.reviewsCntr,
          },
          likedBy: [], // You may need to populate this if necessary
          replies: [], // You may need to populate this if necessary
        };
  
        parentComment.replies.push(reply);
      }
  
      return parentComment;
    } catch (err) {
      console.error(`Error fetching replies for comment ${parentCommentId}: ${err}`);
      throw err;
    }
  }

  private fillData(
    authorProp: { username: string; Name: string; profilePic: string },
    commentProp: {
      id: string;
      text: string;
      date: number;
      likesCntr: { low: number };
      repliesCntr: { low: number };
    }
  ): Comment {
    const author: User = {
      username: authorProp.username,
      Name: authorProp.Name,
      profilePic: authorProp.profilePic,
    };
    const comment: Comment = {
      id: commentProp.id,
      author: author,
      text: commentProp.text,
      date: commentProp.date,
      likesCounter: commentProp.likesCntr.low,
      repliesCntr: commentProp.repliesCntr.low,
    };
    return comment;
  }

  public async UpdateComment(commentId: string, updatedComment: Comment): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (comment:Comment {id: $id})
        SET comment.text = $text,
            comment.date = $date,
            comment.likesCounter = $likesCounter,
            comment.repliesCntr = $repliesCntr
        `,
        {
          id: commentId,
          text: updatedComment.text,
          date: updatedComment.date,
          likesCounter: updatedComment.likesCounter,
          repliesCntr: updatedComment.repliesCntr
        }
      );
    } catch (err) {
      console.error(`Error updating comment: ${err}`);
      throw err;
    }
  }

  public async DeleteComment(commentId: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (comment:Comment {id: $id})
        DETACH DELETE comment
        `,
        {
          id: commentId
        }
      );
    } catch (err) {
      console.error(`Error deleting comment: ${err}`);
      throw err;
    }
  }

  public async FetchPostComments(postId: string): Promise<Comment[]>
  {

    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
          `
          MATCH (comment:Comment)-[:COMMENT_ON_POST]->(post:Post{id:$id})
          OPTIONAL MATCH (author)-[:ADD_COMMENT]->(comment)
          RETURN comment,
                 author.username AS authorUsername,
                 author.profilePic AS authorProfilePic
          ORDER BY comment.date DESC
          SKIP 0
          LIMIT 50
          `,
          { 'id' : postId }
      );

      // a list to hold all comments retrieved from the database
      const postComments: Comment[] = [];

      result.records.forEach((record) => {

          // load User Card
          const author: User = {
              profilePic: record.get("authorProfilePic"),
              username: record.get("authorUsername"),
          };

          //---------------------------------
          // load Comment object
          //---------------------------------
          const currentPost: Comment = {
              author : author,
              text : record.get("comment").properties.text
          };


          //pushing current comment object into the list
          postComments.push(currentPost);
      });

      return postComments;
  } catch (err) {
      console.error(`Error fetching user posts: ${err}`);
      throw err;
  }

    
  }


}
