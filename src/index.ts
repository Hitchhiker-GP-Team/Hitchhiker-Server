//import { startServer } from "./api/appServer.js";
import { fetchUserPosts } from "./db/DbHelper.js";
import { User } from "./entities/User.js";
import { startServer } from "./api/appServer.js";
//import { User } from "./entities/User.js";

async function main() {
  //await connectToDatabase();
  //await db();
  //await db2();
  console.log((await fetchUserPosts("kandeel00")).at(0));

  //const user = new User()
  //getUserPosts("kandeel00");
  //await performAnotherQuery("kandel00");
  //await fetchUserPosts("0ebe80ce-87dd-44b5-a320-888734565605");
  await startServer();
  // const users: User[] = [new User(), new User()];
  // users.forEach((user) => {
  //   console.log(user);
  // });
}

main();
