import { Category } from "../../entities/Category.js";
import { dbDriver } from "../dbConnection.js";

/**
 * @param {string} name - Category's name used as Primary Key to access the Nodes..
 * This class is a collection of needed functions to query the 'Category' Nodes from the DB.
 *
 * Note: all basic Categories Node have 'Origin' Node as a parent.
 */
export class CategoryNode {
  //-1- Create
  //
  /**
   * Create - Add new Category Node to the DB and link it to it's parent Category Node.
   *
   * If it not have parent make it the 'Origin' Node.
   * @param {Category} category - Category object.
   */
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
  /**
   * Create/Update - Make relationship "SUB_CATEGORY_TO" between (link) twoCategories.
   * @param {string} childName - child (sub) Category's name.
   * @param {string} parentName - parent Category's name.
   */
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

  /**
   * Update - Rename an existing Category.
   * @param {string} oldName - old (existing) Category's name.
   * @param {string} newName - new Category's name.
   */
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
  /**
   * Read - Takes a Category's name as a parameter
   * and returns (reads) its Category object from the DB.
   * @param {string} name - Category's name
   * @returns {Promise<Category>} Category object with this name.
   */
  async fetchOne(name: string): Promise<Category> {
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
  /**
   * Read - Returns (reads) all existing Categories names in the DB.
   * @returns {Promise<string[]>} list of all existing Categories.
   */
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
  /**
   * Read - Returns (reads) the Sub-Categories (children) of an arbitrary Category (parent)
   *
   * this method call itself recursively to traverse in all children Categories
   * @param {string} name - parent Category's name
   * @returns {Promise<Category>} Category object with this name with all children Categories of it.
   */
  async fetchTree(name: string): Promise<Category> {
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

  /**
   * Delete - Delete one Category
   * and returns (reads) its Category object from the DB.
   *
   *    * note: it has to be safe for children Nodes.
   * @param {string} name - Category's name
   */
  private async deleteOne(name: string) {
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
  /**
   * Delete - Delete Category Node and all its Sub-Categories (children) Nodes.
   *
   * this method call itself recursively to traverse in all children Categories
   * @param {string} name - parent Category's name
   * @returns {Promise<Category>} Category object with this name with all children Categories of it.
   */
  async deleteTree(name: string) {
    try {
      const { records } = await dbDriver.executeQuery(
        `
      MATCH (:Category  {name:$name})<-[:SUB_CATEGORY_TO]-(leaf:Category )
      RETURN leaf
        `,
        { name: name },
        { database: "neo4j" }
      );
      //if found leaf(s)
      if (records[0]) {
        for (let record of records) {
          let leafName: string = record.get("leaf").properties.name;
          await this.deleteTree(leafName);
        }
      }
      await this.deleteOne(name);
      return;
    } catch (err) {
      console.error(`Error CategoryNode.deleteTree(): ${err}`);
      throw err;
    }
  }
}
