import { DbHelper } from "../../db/DbHelper";
import { Category } from "../../entities/Category";

export async function createCategory(_: any, { name, parentName }: { name: string; parentName?: string; }): Promise<Category[]> {
    try {
      const category: Category = {
        name,
        parent: parentName ? { name: parentName } : undefined
      };
  
      const c = [await DbHelper.CategoryNode.create(category)];
      console.log("Category created:", category);
      return c;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
  export async function updateCategory(_: any, { oldName, newName }: { oldName: string; newName: string }): Promise<void> {
    try {
      await DbHelper.CategoryNode.rename(oldName, newName);
      console.log("Category updated:", oldName, "to", newName);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }
  export async function deleteCategory(_: any, { name }: { name: string }): Promise<void> {
    try {
      await DbHelper.CategoryNode.deleteTree(name);
      console.log("Category deleted:", name);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
  
  export async function fetchCategory(_: any, { name }: { name: string }): Promise<Category[]> {
    try {
      const fetchedCategories = await DbHelper.CategoryNode.fetchOne(name);
      console.log("Categories fetched:", fetchedCategories);
      return fetchedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
  export async function fetchAllCategories(): Promise<{ name: string }[]> {
    try {
      const allCategories = await DbHelper.CategoryNode.fetchAllName();
      const categoriesWithNameField = allCategories.map((categoryName) => ({ name: categoryName }));
      console.log("All categories fetched:", categoriesWithNameField);
      return categoriesWithNameField;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  }
  export async function fetchCategoryTree(_: any, { name }: { name: string }): Promise<Category[]> {
    try {
      const categoryTree = await DbHelper.CategoryNode.fetchTree(name);
      console.log("Category tree fetched:", categoryTree);
      return categoryTree;
    } catch (error) {
      console.error("Error fetching category tree:", error);
      throw error;
    }
  }