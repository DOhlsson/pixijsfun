/* jshint esversion: 6 */

const io = require('./index');
const entity = require('./entity');
const networking = require('./networking');

class Bullet extends entity.Entity {
  constructor(id, x, y, xvel, owner) {
    super(id, x, y, "img/bullet.png");
    this.xvel = xvel;
    this.range = this.x + xvel * 400;
    this.damage = 5;
    this.owner = owner;
    this.width = 2;
    this.height = 2;
  }

  move(map) {
    this.x += this.xvel;
    this.emitCoords();

    let col = this.getCollision();
    if(col.length > 0) {
      for(let i = 0;  i < col.length; i++)
        if(col[i].id !== this.owner) {
          col[i].takeDamage(this.damage);
          this.die();
        }
    }

    if((this.range < 0 && this.x < this.range) ||
      this.range > 0 && this.x > this.range) {
      this.emitDestroy();
      this.delete = true;
    }
  }

  emitCoords() {
    networking.addPackage({
      type: "bullet",
      id: this.id,
      x: this.x,
      y: this.y,
      texture: this.texture
    });
  }
}

module.exports = {
  Bullet: Bullet
};
