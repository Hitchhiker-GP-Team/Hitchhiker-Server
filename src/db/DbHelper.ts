import neo4j from "neo4j-driver";

export async function db() {
  const URI = "neo4j://localhost";
  const USER = "neo4j";
  const PASSWORD = "00000000";
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err}`);
  }

  const { records, summary, keys } = await driver!.executeQuery(
    "MATCH (a) RETURN a",
    { database: "neo4j" }
  );

  // Summary information
  console.log(
    `>> The query ${summary.query.text} ` +
      `returned ${records.length} records ` +
      `in ${summary.resultAvailableAfter} ms.`
  );

  // Loop through results and do something with them
  console.log(">> Results");
  records.forEach((record) => {
    console.log(record.get("a").properties);
  });
}
