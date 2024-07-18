import neo4j, { Driver } from "neo4j-driver";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Console } from "console";
export let dbDriver: Driver;
/**
 * Establishes a connection to the Neo4j database.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 * @throws {Error} If the connection to the database fails.
 */
export async function dbStart() {
  dotenv.config();

  const URI = process.env.URI;
  const USER = process.env.USER;
  const PASSWORD = process.env.PASSWORD;

  console.log(URI);
  console.log(USER);
  console.log(PASSWORD);
  

  if (!URI || !USER || !PASSWORD) {
    throw new Error("Missing environment variables for database connection.");
  }

  try {
    dbDriver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await dbDriver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    throw new Error(`DB Connection Failed.\nCause: ${err}`);
  }
}
