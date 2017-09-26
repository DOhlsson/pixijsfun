/*jshint esversion: 6 */

class Entity {
  constructor(id, x, y, texture, height, width) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.height = height;
    this.width = width;
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
}

module.exports = {
  Entity: Entity
};
