/*jshint esversion: 6 */

const io = require('./index');

class Enemy {
  constructor(id, x, y, texture) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.xvel = 1;
    this.yvel = 0;
    this.hp = 1;
    this.height = 32;
    this.width = 32;
    this.onGround = true;
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

  setHp(hp) {
    this.hp = hp;
  }

  getHp() {
    return this.hp;
  }

  setHeight(height) {
    this.height = height;
  }

  getHeight() {
    return this.height;
  }

  setWidth(width) {
    this.width = width;
  }

  getWidth() {
    return this.width;
  }

  setYvel(yvel) {
    this.yvel = yvel;
  }

  getYvel() {
    return this.yvel;
  }

  setOnGround(onGround) {
    this.onGround = onGround;
  }

  isOnGround() {
    return this.onGround;
  }

  emitCoords() {
    io.emit('enemy', {
      id: this.id,
      x: this.x,
      y: this.y,
      texture: this.texture
    });
  }

  move() {
    this.x += this.xvel;

    this.emitCoords();
  }
}

class Ladybug extends Enemy {
  constructor(id, x, y) {
    super(id, x, y, "img/ladybug.png");
  }
}

module.exports = {
  Ladybug: Ladybug
};
