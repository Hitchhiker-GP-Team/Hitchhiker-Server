import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolver.js";
import { DbHelper } from "../db/DbHelper.js";
export async function startServer() {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

 // console.log(await  DbHelper.ReviewNode.fetchUserReviews("kandeel00"));
  console.log(await  DbHelper.ReviewNode.fetchPlaceReviews("0ebe80ce-87dd-44b5-a320-888705855605"));
  console.log(`🚀  Server ready at: ${url}`);
}
