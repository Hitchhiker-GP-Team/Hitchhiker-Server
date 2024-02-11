import { startServer } from "./api/appServer.js";
import { DbHelper } from "./db/DbHelper.js";
import { dbStart } from "./db/dbConnection.js";
import { Category } from "./entities/Category.js";

async function main() {
  await dbStart();
  await startServer();
}

main();
