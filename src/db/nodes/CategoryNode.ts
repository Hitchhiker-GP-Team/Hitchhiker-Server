import { Category } from "../../entities/Category.js";
import { dbDriver } from "../dbConnection.js";

export class CategoryNode {
  //Primary Key(name: string)
  //(note: we have to make 'Origin' node for all basic categories)

  //-1- Create
  async create(category: Category) {
    try {
      const driver = dbDriver;
      await driver.executeQuery(
        `
        CREATE (
            :Category
            {
                name:"$name
            }
        )`,
        { name: category.name }
      );
      let parentName: string;
      if (category.parent === undefined) parentName = "Origin";
      else parentName = category.parent.name!;

      await driver.executeQuery(
        `
        MATCH (subCategory:Category),(category:Category)
        WHERE subCategory.name = $childName AND category.name = $parentName
        MERGE (subCategory)-[related_to:SUB_CATEGORY_TO]->(category)
        RETURN related_to
        `,
        { childName: category.name, parentName: parentName }
      );
    } catch (err) {
      console.error(`Error create Category: ${err}`);
      throw err;
    }
  } //if it's not have parent make it the 'Origin'.

  //-2- Delete
  async delete(name: string): Promise<boolean> {
    return false;
  }
  //note: it has to be safe for children.

  //-3- Update
  async rename(oldName: string, newName: string) {
    throw new Error("Method not implemented.");
  }

  //-4- Read
  async fetchAllName(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  //-5- Read(could be canceled)
  //like 'fetchAllName()' but it returns them recursively as it gets the category from its parent.(
  async fetchTree() {
    throw new Error("Method not implemented.");
  }

  //-6- Update (could be canceled)
  //link (neo4j: make relationships between) two categories as the child category is a sub-category of the parent category.
  async linkChild(parentName: string, childName: string) {
    throw new Error("Method not implemented.");
  }
}
