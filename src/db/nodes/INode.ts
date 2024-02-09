import { dbDriver } from "../dbConnection.js";
export interface INode<Entity> {
  //const driver:Driver = dbDriver;
  create(entity: Entity): boolean;
  fetch(primaryKey: string): Entity;
  update(entity: Entity): boolean;
  delete(primaryKey: string): boolean;
}
