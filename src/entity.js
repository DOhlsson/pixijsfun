/* jshint esversion: 6 */

const io = require('./index');
const networking = require('./networking');

class Entity {
  constructor(id, x, y, texture, height, width) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.height = height;
    this.width = width;
    this.hitpoints = 1;
    this.facing = 1;
    this.delete = false;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getX() {
    return this.x;
  }

  setX(x) {
    this.x = x;
  }

  getY() {
    return this.y;
  }

  setY(y) {
    this.y = y;
  }

  getTexture() {
    return this.texture;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  getHeight() {
    return this.height;
  }

  setHeight(height) {
    this.height = height;
  }

  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
  }

  setHitpoints(hitpoints) {
    this.hitpoints = hitpoints;
  }

  getHitpoints() {
    return this.hitpoints;
  }

  setFacing(facing) {
    this.facing = facing;
  }

  getFacing() {
    return this.facing;
  }

  /*
   * Tells clients to render a new enitity
   */
  emitCreate() {
    networking.addPackage({
      type: "create",
      id: this.id,
      x: this.x,
      y: this.y,
      texture: this.texture,
      facing: this.facing
    });
  }

  /*
   * Lets clients know the new position of an entity
   */
  emitPosition() {
    networking.addPackage({
      type: "pos",
      id: this.id,
      x: this.x,
      y: this.y,
      texture: this.texture,
      facing: this.facing
    });
  }

  /*
   * Tells clients to destroy an entity
   */
  emitDestroy() {
    networking.addPackage({
      type: "destroy",
      id: this.id
    });
  }
}

module.exports = {
  Entity: Entity
};
