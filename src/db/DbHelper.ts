import neo4j from 'neo4j-driver';
import { Post } from '../entities';
import { User } from '../entities';

export async function db2() {
  const URI = 'neo4j://localhost';
  const USER = 'neo4j';
  const PASSWORD = '12345678';
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

    const session = driver.session();
    const result = await session.run('MATCH (a) RETURN a');
    await session.close();

    // Summary information
    console.log(
      `>> The query returned ${result.records.length} records in ${result.summary.resultAvailableAfter} ms.`
    );

    // Loop through results and do something with them
    console.log('>> Results');
    result.records.forEach(record => {
      console.log(record.get('a').properties);
    });
  } catch (err) {
    console.error(`Connection error\n${err}\nCause: ${err}`);
  } finally {
    if (driver) {
      await driver.close();
      console.log('Connection closed');
    }
  }
}

export async function db() : Promise<string>{
  const URI = 'neo4j://localhost';
  const USER = 'neo4j';
  const PASSWORD = '12345678';
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

    const session = driver.session();
    const result = await session.run('MATCH (a) RETURN a');
    await session.close();

    // Summary information
    console.log(
      `>> The query returned ${result.records.length} records in ${result.summary.resultAvailableAfter} ms.`
    );

    // Loop through results and do something with them
    console.log('>> Results');
    result.records.forEach(record => {
      console.log(record.get('a').properties);
    });
    return "lol";
  } catch (err) {
    console.error(`Connection error\n${err}\nCause: ${err}`);
  } finally {
    if (driver) {
      await driver.close();
      console.log('Connection closed');
    }
  }
  return "lol"
}

export async function fetchUserPosts(username: string): Promise<Post[]> {
  const URI = 'neo4j://localhost';
  const USER = 'neo4j';
  const PASSWORD = '12345678';
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const session = driver.session();
    
    const result = await session.run(
      `
      MATCH (u:User {username: $username})-[:ADD_POST]->(p:Post)
      RETURN p, u.username AS username, u.profilePic AS profilePic
      `,
      { username }
    );
    
    const userPosts : Post[] =[];

    result.records.forEach(record => {

      console.log(record.get('p').properties.caption)
      const  lol = console.log(record.get('profilePic'));
      //const user = new User();
                     
    });

    await session.close();
    return userPosts;
  } catch (err) {
    console.error(`Error fetching user posts: ${err}`);
    throw err;
  } finally {
    if (driver) {
      await driver.close();
      console.log('Connection closed');
    }
  }
}

