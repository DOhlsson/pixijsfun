/* jshint esversion: 6 */

const entities = {};

module.exports = class EntityManager {
  constructor() {
    this.nextId = 0;
  }

  getFreeId() {
    while(entities[this.nextId] !== undefined) {
      this.nextId++;
    }
    return this.nextId++;
  }

  getEntity(id) {
    return entities[id];
  }

  getEntities() {
    return entities;
  }

  addEntity(id, e) {
    entities[id] = e;
  }

  deleteEntity(id) {
    delete entities[id];
  }
};
