import neo4j, { Driver } from "neo4j-driver";
export let dbDriver: Driver;
export async function dbStart() {
  const URI = "neo4j://localhost";
  const USER = "neo4j";
  const PASSWORD = "00000000";
  try {
    dbDriver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await dbDriver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    throw new Error(`DB Connection Failed.\nCause: ${err}`);
  }
}
