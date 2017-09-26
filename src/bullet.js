/*jshint esversion: 6 */

const io = require('./index');
const entity = require('./entity');

class Bullet extends entity.Entity {
  constructor(id, x, y, xvel) {
    super(id, x, y, "img/bullet.png");
    this.xvel = xvel;
    this.range = this.x + (xvel * 1000);
  }

  /* moves the bullet
   * returns false if the bullet should disappear
   */
  move() {
    this.x += this.xvel;

    return this.x != this.range;
  }

  emitCoords() {
    io.emit('bullet', {
      id: this.id,
      x: this.x,
      y: this.y,
      texture: this.texture
    });
  }

  emitDestroy() {
    io.emit('bullet', {
      id: this.id,
      x: 0,
      y: 0,
      texture: this.texture
    });
  }
}

module.exports = {
  Bullet: Bullet
};
