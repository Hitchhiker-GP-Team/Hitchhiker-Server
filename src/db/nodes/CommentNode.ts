import { dbDriver } from "../dbConnection.js";
import { Comment } from "../../entities/Comment.js";
import { User } from "../../entities/User.js";
import { v4 } from "uuid";
console.log(v4());

export class CommentNode {
  public async addComment(comment: Comment, postId: string): Promise<string> {
    try {
      comment.id = v4();
      await dbDriver.executeQuery(
        `
        CREATE (
            comment:Comment
            {
                id:$id,
                text: $text,
                date: $date,
                likesCntr:0,
                repliesCntr: 0
            }
            )
            WITH comment
            MATCH (user:User {username : $username})
            CREATE (user)-[:ADD_COMMENT]->(comment)
            WITH comment
            MATCH (post : Post{id:$postId})
            CREATE (comment)-[:COMMENT_ON_POST]->(post)
            `,
        {
          id: comment.id,
          text: comment.text,
          date: comment.date,
          username: comment.author!.username,
          postId: postId,
        },
        { database: "neo4j" }
      );
      return comment.id;
    } catch (err) {
      console.error(`Error CommentNode.addComment(): ${err}`);
      throw err;
    }
  }
  public async replyComment(reply: Comment): Promise<string> {
    try {
      reply.id = v4();
      await dbDriver.executeQuery(
        `
        CREATE (
            reply:Comment
            {
                id:$id,
                text: $text,
                date: $date,
                likesCntr:0,
                repliesCntr: 0
            }
            )
            WITH reply
            MATCH (user:User {username : $username})
            CREATE (user)-[:ADD_COMMENT]->(reply)
            WITH reply
            MATCH (parentComment : Comment{id:$parentId})
            SET parentComment.repliesCntr = parentComment.repliesCntr + 1  
            CREATE (reply)-[:REPLY_TO]->(parentComment)
            `,
        {
          id: reply.id,
          text: reply.text,
          date: reply.date,
          username: reply.author!.username,
          parentId: reply.parentId,
        },
        { database: "neo4j" }
      );
      return reply.id;
    } catch (err) {
      console.error(`Error CommentNode.replyComment(): ${err}`);
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

  async fetchComment(id: string): Promise<Comment> {
    try {
      const { records } = await dbDriver.executeQuery(
        `
        MATCH (comment:Comment{id:$id})<-[:ADD_COMMENT]-(author:User)
        RETURN comment,author
        `,
        { id: id },
        { database: "neo4j" }
      );
      console.log(JSON.stringify(records[0], null, 2));
      const comment: Comment = this.fillData(
        records[0].get("author").properties,
        records[0].get("comment").properties
      );
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
            comment.likedBy = $likedBy,
            comment.repliesCntr = $repliesCntr
        `,
        {
          id: commentId,
          text: updatedComment.text,
          date: updatedComment.date,
          likesCounter: updatedComment.likesCounter,
          likedBy: updatedComment.likedBy,
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


}
