// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
  type Post {

    id: String
    mediaURL: [String]
    caption: String
    author:postAuthor
    tags: [String]
    likesCntr: Int
    commentsCntr: Int
    category: String
    keywords: [String]
    hashtags: [String]
    date: String
    place: Place

  }

  type Place{
    name: String
    mapsId: String
  }

  type postAuthor{
    username: String
    profilePic: String
  }


  type Query {
    getProfilePosts(username: String):[Post]
  }

`;
