/* jshint esversion: 6 */

const collision = require('./collision');

const entities = {};
var nextId = 0;

/*
 * Returns the next used entity id
 *
 * @return Number
 */
function getFreeId() {
  while(entities[nextId] !== undefined) {
    nextId++;
  }
  return nextId++;
}

/*
 * Get entity by id
 *
 * @param: Number id
 * @return: Entity
 */
function getEntityById(id) {
  return entities[id];
}

/*
 * Get all entities
 *
 * @return Object
 */
function getEntities() {
  return entities;
}

/*
 * Adds any entity to position of id
 *
 * @param Number id
 * @param Entity entity
 */
function addEntity(id, entity) {
  entities[id] = entity;
}

/*
 * Delete an entity by id
 *
 * @param Number id
 */
function deleteEntityById(id) {
  delete entities[id];
}

/*
 * Returns all collisions as an array
 *
 * @param Entity entity
 * @return [Entity]
 */
function getCollisionsAsArray(entity) {
  let collisions = [];
  let rectSource = {
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height
  };

  Object.keys(entities).forEach(key => {
    let e = entities[key];
    if(e.id !== entity.id) {
      let rectTarget = {
        x: e.x,
        y: e.y,
        width: e.width,
        height: e.height
      };

      if(collision.isRectCollision(rectSource, rectTarget)) {
        collisions.push(e);
      }
    }
  });

  return collisions;
}

module.exports = {
  getFreeId: getFreeId,
  getEntityById: getEntityById,
  getEntities: getEntities,
  addEntity: addEntity,
  deleteEntityById: deleteEntityById,
  getCollisionsAsArray: getCollisionsAsArray
};

