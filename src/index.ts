import { startServer } from "./api/appServer.js";
import { dbStart } from "./db/dbConnection.js";

async function main() {
  await dbStart();
  await startServer()


}

main();
