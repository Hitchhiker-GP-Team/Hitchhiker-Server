import { startServer } from "./api/appServer.js";
import { DbHelper } from "./db/DbHelper.js";
import { dbStart } from "./db/dbConnection.js";
import { Category } from "./entities/Category.js";

async function main() {
  await dbStart();
  await startServer();
  //const Sea: Category = { name: "Sea" };
  //await DbHelper.CategoryNode.create(Sea);

  await DbHelper.CategoryNode.fetchAllName();

  await DbHelper.CategoryNode.linkChild("Money", "Burger");

  //await DbHelper.CategoryNode.delete("Ocean");

  await DbHelper.CategoryNode.fetchAllName();

  //await DbHelper.CategoryNode.fetch("Food");
}

main();
