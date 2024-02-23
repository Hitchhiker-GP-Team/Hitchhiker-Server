export const typeDefs = `#graphql
  # Comments in GraphQL Strings (such as this one) start with the hash (#) symbol.
  
  type Category{
    name: String
    Parent: Category
    subCategories: [Category]
  }

  type Comment{
    id: String
    author: User
    text: String
    date: Int
    likesCounter: Int
    likedBy: [User]
    repliesCntr: Int
    replies: [Comment]
  }

  type Coordinates{
    latitude: Int
    longitude: Int
  }

  type IRating{
    totalRating: Int
    affordability: Int
    priceRange: PriceRange
  }

  type Journey{
    id: String
    author: User
    title: String
    date: Int
    posts: [Post]
  }

  type Place{
    id: String
    mapsId: String
    name: String
    type: String
    location: Coordinates
    ratings: IRating
    description: String
    reviewsCntr: Int
    reviews: [Review]
    posts: [Post]
  }

  type PriceRange { 
    min: Int
    max: Int
    currency: String
  }

  type Post {
    id: String
    mediaURL: [String]
    caption: String
    author:User
    tags: [String]
    likesCntr: Int
    commentsCntr: Int
    category: String
    keywords: [String]
    hashtags: [String]
    date: Int
    place: Place
    liked:Boolean
    saved:Boolean
  }

  type Review { 
    id: Int
    author: User
    place: Place
    text: String
    rating: IRating
    date: Int
    likesCntr: Int
    dislikesCntr: Int
  }

  type User{
    username: String
    profilePic: String
    email: String
    password: String
    Name: String
    birthDate: Int 
    homeLocation: Coordinates
    sex: String
    #titles: titles #Not Handled
    Bio: String
    followingCntr: Int
    followings: [User]
    followersCntr: Int
    followers: [User]
    posts: [Post]
    postCntr: Int
    reviews: [Review]
    reviewsCntr: Int
  }


  type Query {
    getProfilePosts(username: String):[Post]
    getUserProfile(username: String):[User]
    getReviewsFun(username: String):[Review]
    getUserJourneys(username: String):[Journey]
    getFeedFun(username: String):[User]
  }

`;
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
