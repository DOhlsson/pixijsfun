/*jshint esversion: 6 */

class Entity {
  constructor(id, x, y, texture, height, width) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }
}

module.exports = {
  Entity: Entity
};
