import { Category } from "../../entities/Category.js";
import { dbDriver } from "../dbConnection.js";

export class CategoryNode {
  //Primary Key(name: string)
  //(note: we have to make 'Origin' node for all basic categories)

  //-1- Create
  //if it's not have parent make it the 'Origin'.
  async create(category: Category) {
    try {
      //Create Category
      await dbDriver.executeQuery(
        `
        CREATE (
            :Category
            {
                name:$name
            }
        )
        `,
        { name: category.name },
        { database: "neo4j" }
      );
      //link to Parent Category
      const childName: string = category.name!;
      let parentName: string = "Origin";
      if (category.parent !== undefined) parentName = category.parent.name!;
      this.linkChild(childName, parentName);
    } catch (err) {
      console.error(`Error CategoryNode.create(): ${err}`);
      throw err;
    }
  }
  //-6- Update/Create
  //link (neo4j: make relationships between) two categories as the child category is a sub-category of the parent category.
  async linkChild(childName: string, parentName: string) {
    try {
      //Delete the existing relationship (if exist).
      await dbDriver.executeQuery(
        `
        MATCH (:Category{name:$childName})-[r:SUB_CATEGORY_TO]->()
        DELETE r
        `,
        { childName: childName },
        { database: "neo4j" }
      );
      //Link with the Parent.
      await dbDriver.executeQuery(
        `
        MATCH (childCategory:Category),(parentCategory:Category)
        WHERE childCategory.name = $childName AND parentCategory.name = $parentName
        MERGE (childCategory)-[related_to:SUB_CATEGORY_TO]->(parentCategory)
        `,
        { childName: childName, parentName: parentName }
      );
    } catch (err) {
      console.error(`Error CategoryNode.linkChild(): ${err}`);
      throw err;
    }
  }

  //-2- Delete
  async delete(name: string) {
    try {
      await dbDriver.executeQuery(
        `
        MATCH (category:Category {name:$name})
        DETACH DELETE category
        `,
        { name: name },
        { database: "neo4j" }
      );
    } catch (err) {
      console.error(`Error CategoryNode.delete(): ${err}`);
      throw err;
    }
  }
  //note: it has to be safe for children.

  //-3- Update
  async rename(oldName: string, newName: string) {
    try {
      await dbDriver.executeQuery(
        `
        MATCH (category:Category {name:$oldName})
        SET category.name = $newName
        `,
        { oldName: oldName, newName: newName },
        { database: "neo4j" }
      );
    } catch (err) {
      console.error(`Error CategoryNode.rename(): ${err}`);
      throw err;
    }
  }

  //-4- Read
  async fetchAllName(): Promise<string[]> {
    try {
      const { records } = await dbDriver.executeQuery(
        `
        MATCH (category:Category)
        RETURN category
        `,
        {},
        { database: "neo4j" }
      );
      let categories: string[] = [];
      records.forEach((record) => {
        categories.push(record.get("category").properties.name);
      });
      console.log(categories);
      return categories;
    } catch (err) {
      console.error(`Error CategoryNode.fetchAllName(): ${err}`);
      throw err;
    }
  }

  async fetch(name: string): Promise<Category> {
    try {
      const { records } = await dbDriver.executeQuery(
        `
        MATCH (category:Category{name:$name}) 
        RETURN category
        `,
        { name: name },
        { database: "neo4j" }
      );
      let category: Category = new Category();
      category.name = records[0].get("category").properties.name;
      console.log(category);
      return category;
    } catch (err) {
      console.error(`Error CategoryNode.fetch(): ${err}`);
      throw err;
    }
  }
  //-5- Read(could be canceled)
  //like 'fetchAllName()' but it returns them recursively as it gets the category from its parent.

  async fetchTree(name: string): Promise<Category> {
    //let name = cName;
    //if (name === undefined) name = "Origin";
    try {
      const { records } = await dbDriver.executeQuery(
        `
        MATCH (:Category  {name:$name})<-[:SUB_CATEGORY_TO]-(leaf:Category )
        RETURN leaf
          `,
        { name: name },
        { database: "neo4j" }
      );
      let category: Category = new Category();
      category.name = name;
      //if found leaf(s)
      if (records[0]) {
        category.subCategories = [];
        for (let record of records) {
          {
            let leafName: string = record.get("leaf").properties.name;
            let leafCategory: Category = await this.fetchTree(leafName);
            category.subCategories!.push(leafCategory);
          }
        }
      }
      return category;
    } catch (err) {
      console.error(`Error CategoryNode.fetchTree(): ${err}`);
      throw err;
    }
  }
}
