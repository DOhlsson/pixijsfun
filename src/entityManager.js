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

  getCollision(obj) {
    let retn;

    Object.keys(entities).forEach(key => {
      let e = entities[key];
      if( (obj.x >= e.x && obj.x <= e.x+e.width) &&
          (obj.y >= e.y && obj.y <= e.y+e.height) &&
        e !== obj && retn === undefined) {
        retn = e;
      }
    });

    return retn;
  }
};

