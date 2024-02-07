//import { startServer } from "./api/appServer.js";
import { db,db2,fetchUserPosts } from "./db/DbHelper.js";
//import { User } from "./entities/User.js";

async function main() {
  //await connectToDatabase();
  //await db();
  //await db2();
  await fetchUserPosts("kandeel00");
  //getUserPosts("kandeel00");
  //await performAnotherQuery("kandel00");
  //await fetchUserPosts("0ebe80ce-87dd-44b5-a320-888734565605");
  //await startServer();
  // const users: User[] = [new User(), new User()];
  // users.forEach((user) => {
  //   console.log(user);
  // });
}

main();
