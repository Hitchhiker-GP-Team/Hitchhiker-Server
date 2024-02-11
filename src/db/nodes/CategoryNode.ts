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
        { name: category.name }
      );
      //link to Parent Category
      let parentName: string = "Origin";
      if (category.parent !== undefined) parentName = category.parent.name!;
      const childName: string = category.name!;
      this.linkChild(parentName, childName);
    } catch (err) {
      console.error(`Error create Category: ${err}`);
      throw err;
    }
  }
  //-6- Update/Create
  //link (neo4j: make relationships between) two categories as the child category is a sub-category of the parent category.
  // UPDATE NOT WORKING!!!!!
  async linkChild(childName: string, parentName: string) {
    try {
      await dbDriver.executeQuery(
        `
        MATCH (subCategory:Category),(category:Category)
        WHERE subCategory.name = $childName AND category.name = $parentName
        MERGE (subCategory)-[related_to:SUB_CATEGORY_TO]->(category)
        `,
        { childName: childName, parentName: parentName }
      );
    } catch (err) {
      console.error(`Error create Category: ${err}`);
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
        { name: name }
      );
    } catch (err) {
      console.error(`Error create Category: ${err}`);
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
        { oldName: oldName, newName: newName }
      );
    } catch (err) {
      console.error(`Error create Category: ${err}`);
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
      `
      );
      let categories: string[] = [];
      records.forEach((record) => {
        categories.push(record.get("category").properties.name);
      });
      console.log(categories);
      return categories;
    } catch (err) {
      console.error(`Error create Category: ${err}`);
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
        { name: name }
      );
      let category: Category = new Category();
      category.name = records[0].get("category").properties.name;
      console.log(category);
      return category;
    } catch (err) {
      console.error(`Error create Category: ${err}`);
      throw err;
    }
  }
  //-5- Read(could be canceled)
  //like 'fetchAllName()' but it returns them recursively as it gets the category from its parent.
  async fetchTree() {
    throw new Error("Method not implemented.");
  }
}
