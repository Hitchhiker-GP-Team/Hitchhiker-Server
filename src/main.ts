import { startServer } from "./api";
import { db } from "./db";
import { User } from "./entities";

async function main() {
  await db();
  await startServer();
  const users: User[] = [new User("ahmed"), new User("ali")];
  users.forEach((user) => {
    console.log(user);
  });
}

main();
