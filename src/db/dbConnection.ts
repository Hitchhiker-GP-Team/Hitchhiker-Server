import neo4j, { Driver } from "neo4j-driver";
export let dbDriver: Driver;
export async function dbStart() {
  const URI = "neo4j+s://a028b8b8.databases.neo4j.io";
  const USER = "neo4j";
  const PASSWORD = "MnHmGt548pFTSLOHvtGQ1a-n-x2TI8OZaI5TkTA4cMo";
  try {
    dbDriver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await dbDriver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    throw new Error(`DB Connection Failed.\nCause: ${err}`);
  }
}
