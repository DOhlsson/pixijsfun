/*jshint esversion: 6 */

const io = require('./index');
const character = require('./character');

class Enemy extends character.Character {
  constructor(id, x, y, texture) {
    super(id, x, y, texture);
  }
}

class Ladybug extends Enemy {
  constructor(id, x, y) {
    super(id, x, y, "img/ladybug.png");
    this.setHeight(32);
    this.setWidth(32);

    this.startx = x;
    this.patrol = 1;
    this.damage = 10;
  }

  move(map) {
    this.verticalMovement();
    //this.horizontalMovement();

    if(this.x > this.startx+300) {
      this.patrol = -1;
    } else if(this.x < this.startx) {
      this.patrol = 1;
    }

    this.checkPlatforms(map);
    this.emitPosition();

    let col = this.getCollision();
    if(col !== undefined && col.constructor.name !== 'Ladybug') {
      col.takeDamage(this.damage);
      this.die();
    }

    this.x += this.patrol;
  }
}

module.exports = {
  Ladybug: Ladybug
};
