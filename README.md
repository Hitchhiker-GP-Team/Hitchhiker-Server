# Hitchhicker Backend Server

This repository contains the backend server for the Hitchhicker application. The server is built using Node.js, Express, and Apollo Server for GraphQL. It provides APIs for managing users, posts, comments, categories, journeys, places, reviews, and notifications.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [APIs](#apis)
  - [User APIs](#user-apis)
  - [Post APIs](#post-apis)
  - [Comment APIs](#comment-apis)
  - [Category APIs](#category-apis)
  - [Journey APIs](#journey-apis)
  - [Place APIs](#place-apis)
  - [Review APIs](#review-apis)
  - [Notification APIs](#notification-apis)
- [Entities](#entities)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hitchhiker-GP-Team/Hitchhiker-Server.git
   ```

2. Change to the project directory:
   ```bash
   cd Hitchhiker-Server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the necessary environment variables for Neo4j Database:
   ```plaintext
   URI = database_uri
   USER = database_name
   PASSWORD = database_password
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. The server will be running at `http://localhost:4000`.

## Project Structure

The project has the following structure:

```
HITCHHICKER
│
├── src
│   ├── api
│   │   ├── controllers
│   │   │   ├── category.ts
│   │   │   ├── comment.ts
│   │   │   ├── journey.ts
│   │   │   ├── place.ts
│   │   │   ├── post.ts
│   │   │   ├── review.ts
│   │   │   └── user.ts
│   │   ├── appServer.ts
│   │   ├── resolver.ts
│   │   └── schema.ts
│   └── db
│       └── nodes
│           ├── CategoryNode.ts
│           ├── CommentNode.ts
│           ├── JourneyNode.ts
│           ├── NotificationNode.ts
│           ├── PlaceNode.ts
│           └── PostNode.ts
├── entities
│   ├── Notifications
│   │   ├── LikeCommentNotificationService.ts
│   │   ├── LikePostNotificationService.ts
│   │   └── NotificationService.ts
│   └── Rating
│       ├── HotelsRating.ts
│       ├── IRating.ts
│       ├── RatingFactory.ts
│       ├── ResturantRating.ts
│   ├── Category.ts
│   ├── Comment.ts
│   ├── Journey.ts
│   ├── Keyword.ts
│   ├── Notification.ts
│   ├── Place.ts
│   ├── Post.ts
│   ├── Review.ts
│   └── User.ts
├── models
│   ├── ClassificationModel.ts
│   ├── DetectionModel.ts
│   ├── ResNet-50.py
│   ├── yolo.py
│   └── index.ts
├── .env
├── .gitignore
├── input.json
├── output.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

## APIs

### User APIs

- **addUser**: Adds a new user to the system.
- **updateUser**: Updates an existing user's profile.
- **deleteUser**: Deletes a user from the system.
- **getUserProfile**: Retrieves the profile of a specific user.
- **followUser**: Allows a user to follow another user.
- **unfollowUser**: Allows a user to unfollow another user.
- **GetFollowingList**: Retrieves a list of users that a specific user is following.
- **GetFollowersList**: Retrieves a list of users that are following a specific user.
- **SearchUser**: Searches for users by username.
- **leaderBoard**: Retrieves the leaderboard of users based on their scores.
- **getUserNotifications**: Retrieves notifications for a specific user.

### Post APIs

- **getPostsFun**: Retrieves posts created by a specific user.
- **getFeedFun**: Retrieves the feed posts of a user's followings.
- **getSavedPosts**: Retrieves the posts saved by a specific user.
- **getLikedPosts**: Retrieves the posts liked by a specific user.
- **getPlacePosts**: Retrieves posts related to a specific place.
- **getCategoryPosts**: Retrieves posts related to a specific category.
- **fetchPostById**: Fetches a post by its ID.
- **getArchivedPosts**: Retrieves the archived posts of a user.
- **createPost**: Creates a new post.
- **likePost**: Likes a specific post.
- **savePost**: Saves a specific post.
- **archivePost**: Archives a specific post.
- **unlikePost**: Unlikes a specific post.
- **unsavePost**: Unsaves a specific post.
- **unarchivePost**: Unarchives a specific post.
- **deletePost**: Deletes a specific post.
- **deleteAllPosts**: Deletes all posts of a user.
- **deleteAllArchivedPosts**: Deletes all archived posts of a user.

### Comment APIs

- **fetchPostComments**: Fetches comments for a specific post.
- **addComment**: Adds a new comment to a post.
- **replyComment**: Adds a reply to a comment.
- **likeComment**: Likes a specific comment.
- **unLikeComment**: Unlikes a specific comment.
- **fetchComment**: Fetches a specific comment by its ID.
- **updateComment**: Updates a specific comment.
- **fetchReplies**: Fetches replies to a specific comment.
- **deleteComment**: Deletes a specific comment.

### Category APIs

- **createCategory**: Creates a new category.
- **updateCategory**: Updates an existing category.
- **deleteCategory**: Deletes a specific category.
- **fetchCategory**: Fetches a specific category by its name.
- **fetchAllCategories**: Fetches all categories.
- **fetchCategoryTree**: Fetches the category tree starting from a specific category.
- **SearchCategory**: Searches for categories by name.

### Journey APIs

- **createJourney**: Creates a new journey.
- **getUserJourneys**: Retrieves journeys created by a specific user.
- **fetchJourneyPosts**: Retrieves posts related to a specific journey.
- **addPostToJourney**: Adds a post to a journey.
- **deleteJourney**: Deletes a specific journey.
- **deletePostFromJourney**: Deletes a post from a journey.

### Place APIs

- **addPlace**: Adds a new place.
- **updatePlace**: Updates an existing place.
- **deletePlace**: Deletes a specific place.
- **addPostToPlace**: Adds a post to a place.
- **addPlaceToCategory**: Adds a place to a category.
- **addReviewToPlace**: Adds a review to a place.
- **addRatingToPlace**: Adds a rating to a place.
- **addUserVisitedPlace**: Marks a place as visited by a user.
- **SearchPlace**: Searches for places by name.
- **getPlaceData**: Retrieves data for a specific place.

### Review APIs

- **getReviewsFun**: Retrieves reviews written by a specific user.
- **fetchPlaceReviews**: Retrieves reviews for a specific place.
- **addReview**: Adds a new review for a place.
- **deleteReview**: Deletes a specific review.
- **upvoteReview**: Upvotes a specific review.
- **undoUpvoteReview**: Undoes an upvote for a review.
- **downvoteReview**: Downvotes a specific review.
- **undoDownvoteReview**: Undoes a downvote for a review.

### Notification APIs

- **createNotification**: Creates a new notification.

## Entities

Entities are defined in the `src/entities` directory. Each entity represents a model in the application and contains the necessary fields and methods for CRUD operations.

### User Entity
```typescript
export interface User {
  username: string;
  profilePic: string;
  email: string;
  password: string;
  Name: string;
  birthDate: number;
  sex: string;
  Bio: string;
  followingCntr: number;
  followersCntr: number;
  postCntr: number;
  reviewsCntr: number;
  homeLocation: [number];
}
```

### Post Entity
```typescript
export interface Post {
  id: string;
  author: { username: string };
  caption: string;
  date: number;
  likesCntr: number;
  mediaURL: string[];
  hashtags

: string[];
  commentsCntr: number;
  place: { id: string, name: string };
  keywords: string[];
  category: { name: string };
}
```

### Comment Entity
```typescript
export interface Comment {
  id: string;
  text: string;
  date: number;
  likesCounter: number;
  repliesCntr: number;
  author: { username: string };
  likedBy: string[];
  replies: string[];
}
```

### Category Entity
```typescript
export interface Category {
  name: string;
  parent?: { name: string };
}
```

### Place Entity
```typescript
export interface Place {
  id: string;
  name: string;
  mapsId: string;
  type: string;
  description: string;
}
```

### Review Entity
```typescript
export interface Review {
  id: string;
  author: { username: string };
  place: { id: string };
  text: string;
  rating: IRating;
  date: number;
  likesCntr: number;
  dislikesCntr: number;
}
```

### Notification Entity
```typescript
export interface Notification {
  initiatorProfilePic: string;
  id: string;
  date: string;
  initiator: string;
  body: string;
  author: string;
  receiver: string;
  referenceId: string;
  referenceType: string;
  initiatorsList: string[];
  initiatorsCntr: number;
  message: string;
}
```
