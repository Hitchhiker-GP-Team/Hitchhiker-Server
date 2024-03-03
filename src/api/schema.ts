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

    #Comment
    replyComment( reply: Comment , parentId: String):String

    # USER
    getUserProfile(username: String):[User]
    addUser(username: String, profilePic: String, email: String, password: String, Name: String,sex:String, birthDate: Int,Bio: String, followingCntr: Int, followersCntr: Int, postCntr: Int, reviewsCntr: Int,homeLocation:[Int]): [User]
    #updateUser( username: String; Bio: String; profilePic: String; email: String; Name: String): [User]
    deleteUser(username: String): [User]
    followUser(username: String, userToFollow: String): [User]
    unfollowUser(username: String, userToUnfollow: String): [User]
    # END USER

    #POST
    getFeedFun(username: String):[Post]
    getPostsFun(username: String):[Post]
    getSavedPosts(username: String):[Post]
    getLikedPosts(username: String):[Post]
    getPlacePosts(username: String, placeId: String):[Post]
    getCategoryPosts(username: String, category: String):[Post]
    getArchivedPosts(username: String):[Post]
    #createPost(authorUsername: String; caption: String; date: number; likesCntr: number; mediaUrls: String[]; hashtags: String[]; commentsCntr: number; tags: String[]; placeId: String; categoryName: String): [Post]
    likePost(username: String, postId: String): [Post]
    savePost(username: String, postId: String): [Post]
    archivePost(username: String, postId: String): [Post]
    unlikePost(username: String, postId: String): [Post]
    unsavePost(username: String, postId: String): [Post]
    unarchivePost(username: String, postId: String): [Post]
    deletePost(postId: String): [Post]
    deleteAllPosts(username: String): [Post]
    deleteAllArchivedPosts(username: String): [Post]
    #END POST

    #PLACE
    #addPlace(id: String; name: String; mapsId: String; type: String; description: String): [Place]
    #editPlace(placeId: String ; name?: String; mapsId?: String; type?: String; description?: String): [Place]
    deletePlace(placeId: String): [Place]
    addPostToPlace(postId: String, placeId: String): [Place]
    addPlaceToCategory(placeId: String, categoryName: String): [Place]
    addReviewToPlace(reviewId: String, placeId: String): [Place]
    addRatingToPlace(ratingId: String, placeId: String): [Place]
    addUserVisitedPlace(username: String, placeId: String): [Place]
    #END PLACE

    #JOURNEY 
    #createJourney(authorUsername: String; journeyId: String; title: String; date: number): [Journey]
    getUserJourneys(username: String):[Journey]
    fetchJourneyPosts(username: String, journeyId: String): [Journey]
    addPostToJourney(postId: String, journeyId: String): [Journey]
    deleteJourney(journeyId: String): [Journey]
    deletePostFromJourney(journeyId: String, postId: String): [Journey]
    #END JOURNEY

    #REVIEW
    getReviewsFun(username: String):[Review]
    fetchPlaceReviews(placeId: String):[Review]
    #addReview(authorUsername: string; placeId: string; reviewId: string; text: string; rating: number; date: number):[Review]
    deleteReview(reviewId: String):[Review]
    #END REVIEW

    #CATEGORY
    #createCategory(name: string; parentName?: string):[Category]
    updateCategory(oldName: String, newName: String):[Category]
    deleteCategory(name: String):[Category]
    fetchCategory(name: String):[Category]
    #fetchAllCategories():[Category]
    fetchCategoryTree(name: String):[Category]
    #END CATEGORY

  }
  type Mutation {
  addUser(
    username: String!,
    profilePic: String,
    email: String!,
    password: String!,
    Name: String!,
    birthDate: Int!,
    sex: String!,
    Bio: String!,
    followingCntr: Int!,
    followersCntr: Int!,
    postCntr: Int!,
    reviewsCntr: Int!
    homeLocation: [Int!]!
  ): User
  updateUser(
    username: String!,
    profilePic: String,
    email: String,
    password: String,
    Name: String,
    Bio: String
  ): User
  createPost(
    authorUsername: String!,
    caption: String!,
    date: Int!,
    likesCntr: Int!,
    mediaUrls: [String]!,
    hashtags: [String]!,
    commentsCntr: Int!,
    placeId: String!,
    categoryName: String!
  ): Post
  addPlace(
    id: String!,
    name: String!,
    mapsId: String!,
    type: String!,
    description: String!
  ): Place
  editPlace(
    placeId: String!,
    name: String,
    mapsId: String,
    type: String,
    description: String
  ): Place
  createJourney(
    authorUsername: String!,
    journeyId: String!,
    title: String!,
    date: Float!
  ): Journey
  addReview(
    authorUsername: String!,
    placeId: String!,
    reviewId: String!,
    text: String!,
    rating: Float!,
    date: Float!
  ): Review
  createCategory(
    name: String!,
    parentName: String
  ): Category
}
`
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
